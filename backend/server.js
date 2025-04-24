require("dotenv").config();
const express = require("express");
const http = require("http"); // Add http module for socket.io
const socketIo = require("socket.io"); // Import socket.io
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { userPool, adminPool, gamePool } = require("./db");

// ✅ Import Auth and Game Routes
const adminAuthRoutes = require("./routes/authRoutes");
const userAuthRoutes = require("./routes/userRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminProgress = require('./routes/adminProgress');

const app = express();
const port = process.env.PORT || 8080;

// ✅ Create HTTP Server for WebSocket
const server = http.createServer(app);
const io = socketIo(server);

// ✅ Attach io to app for controller access
app.set("io", io);

// ✅ Enable CORS and parse JSON
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "../")));

// 🎯 Main Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// 🎯 User Page
app.get("/User/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../User/index.html"));
});

// 🎯 Admin Page
app.get("/admin_auth/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin_auth/index.html"));
});

// 🎯 User Dashboard Page
app.get("/User/user_dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../User/user_dashboard.html"));
});

// Admin Dashboard API routes
app.use('/api/admin', adminProgress);

// ✅ Mount Auth Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/auth", userAuthRoutes); // User Auth API
app.use("/api/progress", progressRoutes); // Progress API

// ✅ Test Database Connection API
app.get("/test-db", async (req, res) => {
  try {
    const result = await gamePool.query("SELECT NOW()");
    res.json({ message: "✅ Database connected", time: result.rows[0].now });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// 🚀 Start WebSocket Connection
io.on("connection", (socket) => {
  console.log("🔌 User connected to WebSocket");

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected from WebSocket");
  });
});

// 🚀 Start Server with WebSocket
server.listen(port, () => {
  console.log(`🚀 Server is running on http://127.0.0.1:${port}`);
});
