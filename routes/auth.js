const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config();
const router = express.Router();

// In-memory "database" for demo (replace with MySQL later)
// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const checkUserQuery = "SELECT * FROM Users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, result) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into database
      const insertUserQuery = `
        INSERT INTO Users (name, email, password)
        VALUES (?, ?, ?)
      `;
      db.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (err) {
    console.error("Error in register route:", err);
    res.status(500).json({ message: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email, password ::",email, password )

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists in the database
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = result[0];
      console.log("USer::",password);

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("isMatch::",isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    });
  } catch (err) {
    console.error("Error in login route:", err);
    res.status(500).json({ message: err.message });
  }
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = router;
