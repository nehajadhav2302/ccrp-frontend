require("dotenv").config();
const { Pool } = require("pg");

// Debugging: Check if .env variables are loading properly
console.log(
  "Loaded Databases:",
  process.env.USER_DATABASE_NAME,
  process.env.ADMIN_DATABASE_NAME,
  process.env.GAMES_DATABASE_NAME
);

// Create a connection pool for each database
const userPool = new Pool({
  user: process.env.USER_DATABASE_USER,
  host: process.env.USER_DATABASE_HOST,
  database: process.env.USER_DATABASE_NAME,
  password: process.env.USER_DATABASE_PASSWORD,
  port: process.env.USER_DATABASE_PORT,
});

const adminPool = new Pool({
  user: process.env.ADMIN_DATABASE_USER,
  host: process.env.ADMIN_DATABASE_HOST,
  database: process.env.ADMIN_DATABASE_NAME,
  password: process.env.ADMIN_DATABASE_PASSWORD,
  port: process.env.ADMIN_DATABASE_PORT,
});

// Game Database Connection
const gamePool = new Pool({
  user: process.env.GAMES_DATABASE_USER,
  host: process.env.GAMES_DATABASE_HOST,
  database: process.env.GAMES_DATABASE_NAME,
  password: process.env.GAMES_DATABASE_PASSWORD,
  port: process.env.GAMES_DATABASE_PORT,
});

// Function to test DB connections
(async () => {
  try {
    await userPool.connect();
    console.log("✅ Connected to User Database");
  } catch (err) {
    console.error("❌ User Database Connection Error:", err.message);
  }

  try {
    await adminPool.connect();
    console.log("✅ Connected to Admin Database");
  } catch (err) {
    console.error("❌ Admin Database Connection Error:", err.message);
  }

  try {
    await gamePool.connect();
    console.log("✅ Connected to Games Database");
  } catch (err) {
    console.error("❌ Games Database Connection Error:", err.message);
  }
})();

module.exports = { userPool, adminPool, gamePool };
