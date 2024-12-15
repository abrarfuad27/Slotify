// Abrar Mohammad Fuad; 261083785
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// Load the SQL file
const createTablesSQL = fs.readFileSync("src/utility/createTables.sql", "utf-8");

// Create or connect to the SQLite database
const db = new sqlite3.Database("./slotify.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    
    // Run the SQL to initialize tables
    db.exec(createTablesSQL, (err) => {
      if (err) {
        console.error("Error initializing tables:", err.message);
      } else {
        console.log("Tables initialized successfully.");
      }
    });
  }
});

module.exports = db;
