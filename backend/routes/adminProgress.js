const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Path to your controller file

// Admin Dashboard Routes
router.get('/total-users', adminController.getTotalUsers); // Total users
router.get('/total-games', adminController.getTotalGamesPlayed); // Total games played
router.get('/top-score', adminController.getTopScore); // Top score
router.get('/most-played-game', adminController.mostPlayedGame );
router.get('/average-score-per-game', adminController.getAverageScorePerGame); // Chart: Avg Score per Game
router.get('/game-distribution', adminController.getGameDistribution );

module.exports = router;
