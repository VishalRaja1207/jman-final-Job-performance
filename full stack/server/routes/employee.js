const express = require('express')
const router = express.Router();
const {
    getTrainerFeedback,
    updateEmployeeFeedback,
    getCourseDetails,
    getPassedTrainings,
    getFailedTrainings
} = require("../controllers/employee")

router.route("/").get(getCourseDetails)
router.route("/pass").get(getPassedTrainings)
router.route("/fail").get(getFailedTrainings)
router.route("/feedback").get(getTrainerFeedback).put(updateEmployeeFeedback)

module.exports = router