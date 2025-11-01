const express = require("express");
const router = express.Router();
const db = require("../../db");

// Convert db.query to a promise-based function
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// POST API to add a new Variety
router.post("/addVariety", async (req, res) => {
  try {
    const { name, color, size, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }

    const sql = "INSERT INTO Variety (name, color, size, price) VALUES (?, ?, ?, ?)";
    const values = [name, color, size, price];

    const result = await query(sql, values);

    res.status(201).json({
      message: "✅ Variety added successfully!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    res.status(500).json({ message: "Error adding variety", error: err.message });
  }
});

module.exports = router;
