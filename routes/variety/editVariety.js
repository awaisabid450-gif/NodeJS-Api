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
router.post("/update/:id", async (req, res) => {
  try {
    const { name, color, size, price } = req.body;
    const { id } = req.params;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }

    const sql = "UPDATE Variety SET name = ?, color = ?, size = ?, price = ? WHERE id = ?";
    const values = [name, color, size, price, id];

    const result = await query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Variety not found" });
    }

    res.status(200).json({
      message: "✅ Variety updated successfully!",
      updatedId: id,
    });
  } catch (err) {
    console.error("❌ Error updating data:", err);
    res.status(500).json({ message: "Error updating variety", error: err.message });
  }
});

module.exports = router;
