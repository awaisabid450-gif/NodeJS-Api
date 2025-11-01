const db = require("./db");

// Create Variety table
const createVarietyTable = `
  CREATE TABLE IF NOT EXISTS Variety (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    size VARCHAR(50),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Create User table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Execute queries sequentially
db.query(createVarietyTable, (err) => {
  if (err) {
    console.error("❌ Error creating Variety table:", err);
    db.end();
    return;
  }
  console.log("✅ Variety table created successfully!");

  db.query(createUserTable, (err) => {
    if (err) {
      console.error("❌ Error creating Users table:", err);
    } else {
      console.log("✅ Users table created successfully!");
    }

    // Close DB connection
    db.end();
  });
});
