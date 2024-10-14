const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    getScores,
    getTraining,
    updateTraining,
    deleteTraining,
    getCumulativeScores,
    getTrainingScores,
    updateScore,
    deleteScore,
    getDesignationScores,
    getTrainingScoresByEmp,
    getEmployees,
    getLearningHistory,
    uploadScores,
    getRetention,
    getTrainingSuccessRate,
    getOverallRetentionData,
    createTraining,
    getNoOfEmployees,
    getCummulativeFeedbackScore
    
} = require('../controllers/admin')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/employees/no").get(getNoOfEmployees)
router.route("/scores").get(getScores).put(updateScore).delete(deleteScore)
router.route("/training").get(getTraining).post(createTraining).put(updateTraining).delete(deleteTraining)
router.route("/cummulative").get(getCumulativeScores)
router.route('/training/scores').get(getTrainingScores)
router.route('/employees').get(getEmployees)
router.route('/training/cummulative').get(getCummulativeFeedbackScore)
router.route('/history').get(getLearningHistory)
router.route('/retention').get(getRetention);
router.route('/retention/all').get(getOverallRetentionData);
router.route('/upload/score').post(upload.single('file'), uploadScores)
router.route('/training-emp-scores').get(getTrainingScoresByEmp)
router.route('/designation/scores').get(getDesignationScores);
router.route('/successrate').get(getTrainingSuccessRate);

module.exports = router;