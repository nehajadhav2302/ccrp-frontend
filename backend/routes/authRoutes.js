const express = require("express");
const {
  adminRegister,
  adminLogin,
} = require("../controllers/authController");

const router = express.Router();

// ✅ Admin Registration Route
router.post("/register", adminRegister);

// ✅ Admin Login Route
router.post("/login", adminLogin);

module.exports = router;

