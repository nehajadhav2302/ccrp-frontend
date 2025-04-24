const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { adminPool, userPool } = require("../db");

// ========================================
// ✅ Admin Registration API
// ========================================
exports.adminRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if admin already exists
        const adminExists = await adminPool.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );
        if (adminExists.rowCount > 0) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new admin
        await adminPool.query(
            "INSERT INTO admins (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("Error during admin registration:", error.message);
        res.status(500).json({ error: "Database error" });
    }
};

// ========================================
// ✅ Admin Login API
// ========================================
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if admin exists
        const admin = await adminPool.query(
            "SELECT * FROM admins WHERE username = $1",
            [username]
        );
        if (admin.rowCount === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate JWT Token for Admin
        const token = jwt.sign(
            { id: admin.rows[0].id },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, message: "Admin login successful" });
    } catch (error) {
        console.error("Error during admin login:", error.message);
        res.status(500).json({ error: "Database error" });
    }
};

// ========================================
// ✅ User Registration API
// ========================================
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await userPool.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email]
      );
  
      if (existingUser.rowCount > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user
      await userPool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [username, email, hashedPassword]
      );
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(500).json({ error: "Database error" });
    }
  };
  
  // ========================================
  // ✅ User Login API
  // ========================================
  exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if user exists
      const user = await userPool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
  
      if (user.rowCount === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const dbUser = user.rows[0];
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, dbUser.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT Token for User
      const token = jwt.sign(
        { id: dbUser.id, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
        },
      });
    } catch (error) {
      console.error("Error during login:", error.message);
      res.status(500).json({ error: "Database error" });
    }
  };