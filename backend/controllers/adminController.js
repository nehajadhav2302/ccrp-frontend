const { userPool, gamePool } = require('../db'); // Import your database pools

// Controller to fetch total users
exports.getTotalUsers = async (req, res) => {
    try {
        const result = await userPool.query('SELECT COUNT(*) AS total_users FROM users');
        const totalUsers = result.rows[0].total_users;
        res.json({ count: totalUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch total users' });
    }
};

// Controller to fetch total games played
exports.getTotalGamesPlayed = async (req, res) => {
    try {
        const result = await gamePool.query('SELECT COUNT(*) AS total_games FROM progress');
        const totalGames = result.rows[0].total_games;
        res.json({ count: totalGames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch total games played' });
    }
};

// Controller to fetch top score
exports.getTopScore = async (req, res) => {
    try {
        const result = await gamePool.query('SELECT MAX(score) AS top_score FROM progress');
        const topScore = result.rows[0].top_score;
        res.json({ topScore: topScore || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch top score' });
    }
};

//Average Score Per Game
exports.getAverageScorePerGame = async (req, res) => {
    try {
        const result = await gamePool.query(`
            SELECT g.game_name AS game_name, AVG(p.score) AS avg_score
            FROM progress p
            JOIN games g ON p.game_id = g.game_id
            GROUP BY g.game_name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch average score per game' });
    }
};

exports.getGameDistribution = async (req, res) => {
    try {
        const result = await gamePool.query(`
            SELECT g.game_name AS game_name, COUNT(*) AS times_played
            FROM progress p
            JOIN games g ON p.game_id = g.game_id
            GROUP BY g.game_name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch game distribution' });
    }
};

exports.mostPlayedGame = async (req, res) => {
    try {
        const result = await gamePool.query(`
            SELECT g.game_name, COUNT(*) AS play_count
            FROM progress p
            JOIN games g ON p.game_id = g.game_id
            GROUP BY g.game_name
            ORDER BY play_count DESC
            LIMIT 1;

        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch game distribution' });
    }
};
