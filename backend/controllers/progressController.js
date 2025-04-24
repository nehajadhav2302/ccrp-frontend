const { userPool } = require("../db.js");

// 🎯 Get All Progress Data
exports.getAllProgressData = async (req, res) => {
  try {
    const result = await userPool.query("SELECT * FROM progress");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error Fetching Progress Data:", error.message);
    res.status(500).json({ message: "Error fetching progress data." });
  }
};

// 🎯 Get Progress Data for Specific User
exports.getUserProgressData = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const result = await userPool.query(
      `SELECT p.*, g.game_name 
       FROM progress p
       JOIN games g ON p.game_id = g.game_id
       WHERE p.user_id = $1
       ORDER BY p.completed_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error Fetching User Progress:", error.message);
    res.status(500).json({ message: "Error fetching user progress." });
  }
};


// 🎯 Add New Progress Data
exports.addProgressData = async (req, res) => {
  const { user_id, game_id, score, completion_time } = req.body;

  if (!user_id || !game_id || score === undefined || !completion_time) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Step 1: Get current attempt count for this user + game
    const attemptQuery = `
      SELECT COUNT(*) AS attempt_count
      FROM progress
      WHERE user_id = $1 AND game_id = $2
    `;
    const attemptResult = await userPool.query(attemptQuery, [user_id, game_id]);
    const previousAttempts = parseInt(attemptResult.rows[0].attempt_count, 10);
    const newTotalAttempts = previousAttempts + 1;

    // Step 2: Insert new progress record with calculated total_attempts
    const insertQuery = `
      INSERT INTO progress (user_id, game_id, score, total_attempts, completion_time, completed_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id;
    `;
    const values = [user_id, game_id, score, newTotalAttempts, completion_time];
    const insertResult = await userPool.query(insertQuery, values);

    res.status(200).json({
      message: "🎯 Game progress saved successfully.",
      new_game_id: insertResult.rows[0].id,
      total_attempts: newTotalAttempts,
    });
  } catch (error) {
    console.error("❌ Error saving game progress:", error.message);
    res.status(500).json({ message: "Error saving game progress." });
  }
};

// 🎯 Get Summary Data for User
exports.getSummaryData = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const result = await userPool.query(
      `SELECT p.game_id, COUNT(*) AS attempts
       FROM progress p
       WHERE p.user_id = $1
       GROUP BY p.game_id`,
      [userId]
    );

    res.status(200).json({
      games: result.rows.map((r) => r.game_id),
      attempts: result.rows.map((r) => parseInt(r.attempts, 10)),
    });
  } catch (error) {
    console.error("❌ Error Fetching Summary Data:", error.message);
    res.status(500).json({ message: "Error fetching summary data." });
  }
};

// 🎯 Get Scores for User
exports.getScoresData = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const result = await userPool.query(
      `SELECT g.game_name AS game_name, MAX(p.score) AS high_score
       FROM progress p
       JOIN games g ON p.game_id = g.game_id
       WHERE p.user_id = $1
       GROUP BY g.game_name`,
      [userId]
    );

    res.status(200).json({
      games: result.rows.map((r) => r.game_name),
      scores: result.rows.map((r) => r.high_score),
    });
  } catch (error) {
    console.error("❌ Error Fetching Scores Data:", error.message);
    res.status(500).json({ message: "Error fetching scores data." });
  }
};

// 📚 Get Average Completion Time per Game
exports.getAverageTimeData = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const result = await userPool.query(
      `SELECT g.game_name AS game_name, 
        ROUND(AVG(EXTRACT(EPOCH FROM p.completion_time)) / 60, 2) AS avg_time
       FROM progress p
       JOIN games g ON p.game_id = g.game_id
       WHERE p.user_id = $1
       GROUP BY g.game_name`,
      [userId]
    );

    res.status(200).json({
      games: result.rows.map((r) => r.game_name),
      times: result.rows.map((r) => parseFloat(r.avg_time).toFixed(2)),
    });
  } catch (error) {
    console.error("❌ Error Fetching Average Time Data:", error.message);
    res.status(500).json({ message: "Error fetching average time data." });
  }
};


// 📚 Get Game History for User
exports.getHistoryData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await userPool.query(
      `SELECT g.game_name AS game_name, p.score, p.total_attempts , p.completion_time, p.completed_at
       FROM progress p
       JOIN games g ON p.game_id = g.game_id
       WHERE p.user_id = $1
       ORDER BY p.completed_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error Fetching Game History:", error.message);
    res.status(500).json({ message: "Error fetching game history." });
  }
};

const { updateGameAttempts } = require("../models/progress");

exports.updateGameAttempts = async (req, res) => {
  const { user_id, game_id } = req.body;

  if (!user_id || !game_id) {
    return res.status(400).json({ message: "User ID and Game ID are required." });
  }

  try {
    // Call the updated method to handle attempt updates
    const totalAttempts = await updateGameAttempts(user_id, game_id);

    return res.status(200).json({
      message: "✅ Attempt updated successfully.",
      total_attempts: totalAttempts,
    });
  } catch (error) {
    console.error("❌ Error updating attempts:", error.message);
    return res.status(500).json({ message: "Error updating attempts." });
  }
};
