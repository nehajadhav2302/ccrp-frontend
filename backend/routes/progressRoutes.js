const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

// Correct Progress Routes
router.get("/all", progressController.getAllProgressData);
router.get("/user/:userId", progressController.getUserProgressData);
router.post("/add", progressController.addProgressData);
router.get("/summary/:userId", progressController.getSummaryData);
router.get("/scores/:userId", progressController.getScoresData);
router.get("/average-time/:userId", progressController.getAverageTimeData);
router.get("/history/:userId", progressController.getHistoryData);
router.post("/update-attempt", progressController.updateGameAttempts);


module.exports = router;
