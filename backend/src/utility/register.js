// Abrar Mohammad Fuad; 261083785
const bcrypt = require("bcrypt");
const db = require("./db");

const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  // Check if the user already exists
  return new Promise((resolve, reject) => {
    db.get(`SELECT email FROM Member WHERE email = ?`, [email], async (err, row) => {
      if (err) {
        reject("Database error: " + err.message);
      } else if (row) {
        reject("Email already exists");
      } else {
        try {
          // Encrypt the password
          const encryptedPassword = await bcrypt.hash(password, 10);

          // Insert the user into the database
          db.run(
            `INSERT INTO Member (email, encryptedPassword, firstName, lastName) VALUES (?, ?, ?, ?)`,
            [email, encryptedPassword, firstName, lastName],
            (err) => {
              if (err) {
                reject("Failed to register user: " + err.message);
              } else {
                resolve("Your Slotify account has been registerd successfully");
              }
            }
          );
        } catch (encryptionError) {
          reject("Failed to encrypt password: " + encryptionError.message);
        }
      }
    });
  });
};

module.exports = { registerUser };
