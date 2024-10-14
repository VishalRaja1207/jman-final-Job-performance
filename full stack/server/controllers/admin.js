const Employee = require("../models/Employee");
const Performance = require("../models/Performance");
const Training = require("../models/Training");
const { Sequelize } = require("sequelize");
const xlsx = require("xlsx");

//create training 
const createTraining = async (req, res) => {
  const {courseName, startDate, endDate} = req.body
  try {
    const newTraining = await Training.create({
      name: courseName,
      start_date: startDate,
      end_date: endDate,
    });

    res.status(201).json({ message: 'Training created successfully', data: newTraining });
  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}

//get all training
const getTraining = async (req, res) => {
  try {
    const training = await Training.findAll({
      attributes: [
        "id",
        "name",
        [Sequelize.fn("date", Sequelize.col("start_date")), "start_date"],
        [Sequelize.fn("date", Sequelize.col("end_date")), "end_date"],
      ],
    });
    if (training.length === 0) {
      return res.status(200).json({ message: "No records found" });
    }

    res.status(200).json(training);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//update training
const updateTraining = async (req, res) => {
  const { id } = req.query; // Get the training id from URL parameters
  const { name, start_date ,end_date } = req.body; // Fields to update
  console.log(req.body);
  
  try {
    const training = await Training.findByPk(id); // Find the training by id

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    // Update the training details
    await training.update({
      name: name || training.name,
      start_date: start_date || training.start_date,
      end_date: end_date || training.end_date,
    });

    res
      .status(200)
      .json({ message: "Training updated successfully", training });
  } catch (error) {
    console.error("Error updating training:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//delete training
const deleteTraining = async (req, res) => {
  const { id } = req.query; // Get the training id from URL parameters
  
  try {
    const training = await Training.findByPk(id); // Find the training by id

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    // Delete the training record
    await training.destroy();

    res.status(200).json({ message: "Training deleted successfully" });
  } catch (error) {
    console.error("Error deleting training:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//get scores based on training id and designation
const getScores = async (req, res) => {
  const { training_id, designation } = req.query;

  try {
    const results = await Performance.findAll({
      include: [
        {
          model: Employee,
          attributes: ["id", "name", "designation"],
          where: {
            designation: designation,
          },
        },
        {
          model: Training,
          attributes: ["id", "name", "start_date", "end_date"],
          where: {
            id: Number(training_id),
          },
        },
      ],
      attributes: ["score", "Employee.id", "Training.id"],
    });

    if (results.length === 0) {
      return res.status(200).json({ message: "No records found" });
    }

    // Respond with the data
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//delete score
const deleteScore = async (req, res) => {
  const { emp_id, training_id } = req.query;
  try {
    console.log(emp_id, training_id);

    // Find the performance record by emp_id and training_id
    const performance = await Performance.findOne({
      where: {
        emp_id: emp_id,
        training_id: training_id,
      },
    });

    if (!performance) {
      return res.status(404).json({ message: "Performance not found" });
    }

    // Delete the performance record
    await performance.destroy();

    res.status(200).json({ message: "Performance deleted successfully" });
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//update score
const updateScore = async (req, res) => {
  const { emp_id, training_id } = req.body;

  try {
    console.log(emp_id, training_id);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//get employees
const getEmployees = async (req, res) => {
  const { designation } = req.query;
  const whereCondition = designation ? { designation: designation } : {};
  try {
    const employee = await Employee.findAll({
      attributes: ["id", "name"],
      where: whereCondition
    });
    if (employee.length === 0) {
      return res.status(200).json({ message: "No records found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//get cummulative scores of employee
const getCumulativeScores = async (req, res) => {
  const { id } = req.query;

  const whereCondition = id ? { emp_id: id } : {};
  try {
    const results = await Performance.findAll({
      attributes: [
        "emp_id",
        [Sequelize.col("Employee.name"), "Name"],
        [Sequelize.col("Employee.designation"), "Designation"],
        [
          Sequelize.literal("(SUM(score) / (COUNT(training_id) * 100)) * 100"),
          "Percentage",
        ],
        [Sequelize.literal("COUNT(training_id)"), "Total Trainings"],
      ],
      include: [
        {
          model: Employee,
          attributes: [],
        },
      ],
      where: whereCondition,
      group: ["emp_id", "Employee.name", "Employee.designation"],
      order: [["Percentage", "DESC"]],
      limit: 7
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching employee scores:", error);
  }
};

//get training scores
const getTrainingScores = async (req, res) => {
  try {
    const results = await Performance.findAll({
      attributes: [
        "training_id",
        [Sequelize.col("Training.name"), "Name"],
        [
          Sequelize.literal(
            "ROUND((SUM(score) / (COUNT(emp_id) * 100)) * 100)"
          ),
          "Percentage",
        ],
      ],
      include: [
        {
          model: Training,
          attributes: [],
        },
      ],
      group: ["training_id", "Training.name"],
      order: [["Percentage", "DESC"]],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching employee scores:", error);
  }
};

//get designation scores
const getDesignationScores = async (req, res) => {
  try {
    const results = await Performance.findAll({
      attributes: [
        // 'training_id',
        [Sequelize.col("Employee.designation"), "categories"],
        [
          Sequelize.literal(
            "ROUND((SUM(score) / (COUNT(emp_id) * 100)) * 100)"
          ),
          "series",
        ],
      ],
      include: [
        {
          model: Employee,
          attributes: [],
        },
      ],
      group: ["Employee.designation"],
      order: [["series", "DESC"]],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching employee scores:", error);
  }
};

//get training scores by employee
const getTrainingScoresByEmp = async (req, res) => {
  const { id } = req.query;
  try {
    const results = await Performance.findAll({
      attributes: [
        "training_id",
        "emp_id",
        [Sequelize.col("Training.name"), "Name"],
        [
          Sequelize.literal(
            "ROUND((SUM(score) / (COUNT(emp_id) * 100)) * 100)"
          ),
          "Percentage",
        ],
      ],
      include: [
        {
          model: Training,
          attributes: [],
        },
      ],
      // Instead of using the alias "Percentage" in the ORDER BY clause, we use the same expression
      group: ["training_id", "Training.name", "emp_id"],
      where: {
        emp_id: id,
      },
      order: ["emp_id"],

      raw: true, // Return raw results
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching employee scores:", error);
  }
};

//get learning
const getLearningHistory = async (req, res) => {
  const { id } = req.query;
  try {
    const results = await Performance.findAll({
      attributes: [
        [Sequelize.col("Training.id"), "training_id"],
        [Sequelize.col("Employee.name"), "employee_name"],
        [Sequelize.col("Employee.designation"), "designation"],
        [Sequelize.col("Training.name"), "training_name"],
        [Sequelize.col("score"), "score"],
        [
          Sequelize.fn("date", Sequelize.col("Training.start_date")),
          "start_date",
        ],
        [Sequelize.fn("date", Sequelize.col("Training.end_date")), "end_date"],
      ],
      include: [
        {
          model: Training,
          attributes: [],
        },
        {
          model: Employee,
          attributes: [],
        },
      ],
      where: {
        emp_id: id,
      },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching employee training details:", error);
  }
};

const uploadScores = async (req, res) => {
  const { id } = req.query; // The training_id passed via query

  try {
    // Ensure the file is uploaded correctly
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(data);

    // Proceed with upserting logic
    for (const row of data) {
      const { emp_id, score, start_date, end_date } = row;

      const existingRecord = await Performance.findOne({
        where: { emp_id: emp_id, training_id: id },
      });

      if (existingRecord) {
        await Performance.update(
          { score: score },
          { where: { emp_id: emp_id, training_id: id } }
        );
      } else {
        await Performance.create({
          emp_id: emp_id,
          training_id: id,
          score: score,
        });
      }
    }

    res.status(200).json({ message: "Data successfully uploaded and updated" });
  } catch (error) {
    console.error("Error uploading scores:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getRetention = async (req, res) => {
  const { empId } = req.query;

  try {
    const results = await Performance.findAll({
      attributes: [
        "emp_id",
        [
          Sequelize.literal("(SUM(score) / (COUNT(training_id) * 100)) * 100"),
          "score", // Calculate the score percentage
        ],
        [
          Sequelize.literal(
            "CASE WHEN (SUM(score) / (COUNT(training_id) * 100)) * 100 >= 50 THEN 1 ELSE 0 END"
          ),
          "retention", // Determine retention based on score
        ],
      ],
      where: { emp_id: empId }, // Filter by employee ID
      group: ["emp_id"], // Group by employee ID
      raw: true, // Return raw results without Sequelize's model wrapping
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching retention data:", error);
    res.status(500).json({ message: "Error fetching retention data" });
  }
};

const getNoOfEmployees = async (req, res) => {
  try {
    const employeeCount = await Employee.count();
    return res.status(200).json({ count: employeeCount });
  } catch (error) {
    console.error("Error fetching employee count:", error);
    res.status(500).json({ message: "Error fetching employee count" });
  }
}

const getOverallRetentionData = async(req, res) => {
  try {
    // First, calculate the total number of employees
    const totalEmployees = await Performance.count({
        distinct: true,
        col: 'emp_id'
    });

    // Then, calculate the number of employees whose average score is greater than 50
    const passedEmployeesCount = await Performance.findAll({
        attributes: [
            [Sequelize.col('emp_id'), 'emp_id'],
            [Sequelize.fn('AVG', Sequelize.col('score')), 'avg_score']
        ],
        group: ['emp_id'],
        having: Sequelize.where(Sequelize.fn('AVG', Sequelize.col('score')), '>', 50)
    });

    const passedCount = passedEmployeesCount.length;

    // Calculate percentage
    const percentageOfPassedEmployees = (passedCount * 100) / totalEmployees;

    console.log('Percentage of employees passed:', percentageOfPassedEmployees);
    return res.status(200).json({data: percentageOfPassedEmployees});
  } catch (error) {
    console.error("Error fetching retention data:", error);
    res.status(500).json({ message: "Error fetching retention data" });
  }
}

const getTrainingSuccessRate = async (req, res) => {
  const { id } = req.query; // Assuming id is passed as a query parameter

  try {
    const thresholdScore = 50; // Define the threshold score

    const result = await Performance.findOne({
      where: {
        emp_id: id, // Filter by specific employee ID
      },
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("training_id")),
          "total_trainings",
        ], // Count total trainings attended
        [
          Sequelize.fn(  
            "SUM",
            Sequelize.literal(
              `CASE WHEN score >= ${thresholdScore} THEN 1 ELSE 0 END`
            )
          ),
          "trainings_passed",
        ], // Count passed trainings
      ],
    });

    // If result is found, calculate percentage
    if (result) {
      const totalTrainings = result.getDataValue("total_trainings");
      const trainingsPassed = result.getDataValue("trainings_passed");

      // Safeguard against division by zero
      const successRate =
        totalTrainings > 0 ? (trainingsPassed / totalTrainings) * 100 : 0;

      res.status(200).json({
        total_trainings: totalTrainings,
        trainings_passed: trainingsPassed,
        cumulative_success_rate: successRate.toFixed(2), // Return success rate as percentage
      });
    } else {
      res
        .status(404)
        .json({ message: "No training records found for this employee" });
    }
  } catch (error) {
    console.error(
      "Error fetching cumulative training success rates for employee:",
      error
    );
    res.status(500).json({ message: "Server Error" });
  }
};

//get cummulative feedback score
const getCummulativeFeedbackScore = async (req, res) => {
  const { id } = req.query; // training_id is passed as query parameter
  try {
    const results = await Performance.findAll({
      where: {
        training_id: id
      },
      attributes: [
        'training_id',
        [Sequelize.fn("COALESCE", Sequelize.fn("AVG", Sequelize.col("employee_feedback")), 0), "average_feedback"] // Use COALESCE to replace null with 0
      ],
      group: ["training_id"]
    });

    return res.status(200).json(results[0]);
  } catch (error) {
    console.error(
      "Error fetching cumulative training feedback score:",
      error
    );
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getScores,
  createTraining,
  getTraining,
  updateTraining,
  deleteTraining,
  getCumulativeScores,
  getTrainingScores,
  updateScore,
  deleteScore,
  getTrainingScoresByEmp,
  getDesignationScores,
  getLearningHistory,
  getEmployees,
  uploadScores,
  getRetention,
  getTrainingSuccessRate,
  getOverallRetentionData,
  getNoOfEmployees,
  getCummulativeFeedbackScore
};
