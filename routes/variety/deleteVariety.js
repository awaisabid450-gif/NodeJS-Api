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
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM Variety WHERE id = ?";
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Variety not found" });
    }

    res.status(200).json({
      message: "✅ Variety deleted successfully!",
      deletedId: id,
    });
  } catch (err) {
    console.error("❌ Error deleting data:", err);
    res.status(500).json({ message: "Error deleting variety", error: err.message });
  }
});


module.exports = router;
