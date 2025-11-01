const express = require("express");
const router = express.Router();
const db = require("../../db");
const secretToken = require("./middleware/verifyToken")

// Convert db.query to a promise-based function
const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// GET API to fetch all Varieties
router.get("/getVarieties", secretToken, async (req, res) => {
  try {
    const sql = "SELECT * FROM Variety";
    const results = await query(sql);

    res.status(200).json({
      message: "✅ Varieties fetched successfully!",
      total: results.length,
      data: results,
    });
  } catch (err) {
    console.error("❌ Error fetching varieties:", err);
    res.status(500).json({
      message: "Error fetching varieties",
      error: err.message,
    });
  }
});

module.exports = router;
