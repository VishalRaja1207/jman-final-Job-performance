const { Sequelize, Op } = require("sequelize");
const Employee = require("../models/Employee");
const Performance = require("../models/Performance");
const Training = require("../models/Training");

// Get all trainer feedback
const getCourseDetails = async (req, res) => {
    const {id} = req.user;
    try {
        const results = await Performance.findOne({
            attributes: [
                'emp_id',
                [Sequelize.literal('COUNT(training_id)'), 'total_courses_attended'],
                [Sequelize.literal('SUM(CASE WHEN score >= 50 THEN 1 ELSE 0 END)'), 'total_courses_passed'], // Assuming passing score is 60
                [Sequelize.literal('ROUND((SUM(CASE WHEN score >= 50 THEN 1 ELSE 0 END) / COUNT(training_id)) * 100, 2)'), 'success_rate']

            ],
            where: {
                emp_id: id
            },
            group: ['emp_id']
        });

        res.status(200).json(results);
        return results;
    } catch (error) {
        console.error("Error fetching training results:", error);
        res.status(500).json({ error: "An error occurred while fetching results." });
    }
}

const getPassedTrainings = async (req, res) => {
    const {id} = req.user;
    try {
        const results = await Performance.findAll({
            attributes: [
                'emp_id',
                [Sequelize.col('Training.name'), 'Training Name'],
                [
                    Sequelize.fn("date", Sequelize.col("Training.start_date")),
                    "start_date",
                ],
                [
                    Sequelize.fn("date", Sequelize.col("Training.end_date")),
                    "end_date",
                ],
                'score'
            ],
            include: [
                {
                    model: Training,
                    attributes: [] // We include training attributes using Sequelize.col()
                }
            ],
            where: {
                emp_id: id,
                score: {
                    [Sequelize.Op.gte]: 50 // Filter by passing score (>= 60)
                }
            }
        });

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching training results:", error);
        res.status(500).json({ error: "An error occurred while fetching results." });
    }
};

const getFailedTrainings = async (req, res) => {
    const {id} = req.user;
    try {
        const results = await Performance.findAll({
            attributes: [
                'emp_id',
                [Sequelize.col('Training.name'), 'Training Name'],
                [
                    Sequelize.fn("date", Sequelize.col("Training.start_date")),
                    "start_date",
                ],
                [
                    Sequelize.fn("date", Sequelize.col("Training.end_date")),
                    "end_date",
                ],
                'score'
            ],
            include: [
                {
                    model: Training,
                    attributes: [] // We include training attributes using Sequelize.col()
                }
            ],
            where: {
                emp_id: id,
                score: {
                    [Sequelize.Op.lt]: 50 // Filter by passing score (>= 60)
                }
            }
        });

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching training results:", error);
        res.status(500).json({ error: "An error occurred while fetching results." });
    }
};




const getTrainerFeedback = async (req, res) => {
    const {id} = req.user; // Example employee ID, replace with req.user.id if needed    
    try {
        const results = await Performance.findAll({
            include: [
                {
                    model: Training,
                    attributes: [
                        'id', 
                        'name', 
                        [
                            Sequelize.fn("date", Sequelize.col("Training.start_date")),
                            "start_date",
                        ],
                        [
                            Sequelize.fn("date", Sequelize.col("Training.end_date")),
                            "end_date",
                        ],
                    ],
                },
                {
                    model: Employee,
                    where: { id: id },
                    attributes: ['id', 'name'], // Include employee name if needed
                },
            ],
            attributes: [
                'trainer_feedback',
                // Using Sequelize.fn for CASE statement correctly
                [
                    Sequelize.literal(`CASE WHEN score >= 50 THEN 'Pass' ELSE 'Fail' END`),
                    'status'
                ],
            ],
        });

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching training results:", error);
        res.status(500).json({ error: "An error occurred while fetching training results." });
    }
};

const updateEmployeeFeedback = async (req, res) => {
    const {id} = req.user;
    
    const { training_id, feedback1, feedback2, feedback3, feedback4 } = req.body; // Assuming you get these feedback ratings from the body

    // Calculate the score out of 100
    const totalFeedback = Number(feedback1) + Number(feedback2) + Number(feedback3) + Number(feedback4);
    const score = ((totalFeedback / 4) / 5) * 100; // Adjust this calculation as needed for your scoring logic
    console.log(score);
    
    try {
        // Update employee_feedback field in Performance table
        const updatedPerformance = await Performance.update(
            { employee_feedback: score }, // Set the new score
            {
                where: {
                    emp_id: id, // Use emp_id from req.user
                    training_id: training_id // Use training_id from body
                }
            }
        );

        if (updatedPerformance[0] === 0) {
            return res.status(404).json({ message: "Performance record not found" });
        }

        return res.status(200).json({ message: "Feedback updated successfully", score });
    } catch (error) {
        console.error("Error updating employee feedback:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getTrainerFeedback,
    updateEmployeeFeedback,
    getCourseDetails,
    getPassedTrainings,
    getFailedTrainings
};
