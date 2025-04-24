const { userPool } = require("../db"); // Import userPool from db.js

// ✅ Insert progress when the game is completed
const insertProgress = async (userId, gameId, score, totalAttempts, completionTime) => {
  const query = `
    INSERT INTO progress (user_id, game_id, score, total_attempts, completion_time, completed_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  const values = [userId, gameId, score, totalAttempts, completionTime];
  const result = await userPool.query(query, values);
  return result.rows[0];
};

// ✅ Get progress for a specific user
const getUserProgress = async (userId) => {
  const query = `
    SELECT 
      p.id, 
      g.game_name, 
      p.score, 
      p.total_attempts, 
      p.completion_time, 
      p.completed_at
    FROM progress p
    JOIN games g ON p.game_id = g.game_id
    WHERE p.user_id = $1
    ORDER BY p.completed_at DESC;
  `;
  const result = await userPool.query(query, [userId]);
  return result.rows;
};

// ✅ Get all progress data
const getAllProgress = async () => {
  const query = `
    SELECT 
      p.id, 
      u.username AS user_name, 
      g.game_name, 
      p.score, 
      p.total_attempts, 
      p.completion_time, 
      p.completed_at
    FROM progress p
    JOIN users u ON p.user_id = u.id
    JOIN games g ON p.game_id = g.game_id
    ORDER BY p.completed_at DESC;
  `;
  const result = await userPool.query(query);
  return result.rows;
};

// ✅ Update total_attempts when the game is played
const updateGameAttempts = async (userId, gameId) => {
  // Check if the user has already played this game before
  const checkQuery = `
    SELECT total_attempts 
    FROM progress 
    WHERE user_id = $1 AND game_id = $2 
    ORDER BY completed_at DESC 
    LIMIT 1;
  `;
  const checkValues = [userId, gameId];
  const checkResult = await userPool.query(checkQuery, checkValues);

  // If no previous attempt exists, create a new entry with total_attempts = 1
  if (checkResult.rows.length === 0) {
    const insertQuery = `
      INSERT INTO progress (user_id, game_id, total_attempts, completed_at)
      VALUES ($1, $2, 1, NOW()) 
      RETURNING total_attempts;
    `;
    const insertValues = [userId, gameId];
    const insertResult = await userPool.query(insertQuery, insertValues);
    return insertResult.rows[0].total_attempts; // Should return 1 as it’s a new game played
  }

  // If the game has been played before, increment the total_attempts
  const updatedAttempts = checkResult.rows[0].total_attempts + 1;

  const updateQuery = `
    UPDATE progress 
    SET total_attempts = $1, completed_at = NOW() 
    WHERE user_id = $2 AND game_id = $3 
    RETURNING total_attempts;
  `;
  const updateValues = [updatedAttempts, userId, gameId];
  const updateResult = await userPool.query(updateQuery, updateValues);
  return updateResult.rows[0].total_attempts; // Return the updated attempt count
};

module.exports = {
  insertProgress,
  getUserProgress,
  getAllProgress,
  updateGameAttempts,
};
