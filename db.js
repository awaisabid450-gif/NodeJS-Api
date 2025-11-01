const mysql = require("mysql");

// Create MySQL connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root", // your MySQL username
  password: "pakistan", // your MySQL password
  database: "myshop", // your database name
});

// Async function to connect to MySQL
const connectDB = async () => {
  try {
    await new Promise((resolve, reject) => {
      db.connect((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    console.log("✅ Connected to MySQL database!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // stop the app if connection fails
  }
};

connectDB();

module.exports = db;
