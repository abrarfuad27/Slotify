// Abrar Mohammad Fuad; 261083785
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

// Determine which database and SQL file to use
const isTestEnv = process.env.NODE_ENV === "test";
console.log("isTestEnv:", isTestEnv);
const dbFile = isTestEnv ? "./slotify_test.db" : "./slotify.db";
const createTablesSQL = fs.readFileSync(
  isTestEnv ? "src/utility/createTablesTest.sql" : "src/utility/createTables.sql",
  "utf-8"
);

// Create or connect to the SQLite database
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(`Error opening database (${dbFile}):`, err.message);
  } else {
    console.log(`Connected to the SQLite database (${dbFile}).`);
    
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
