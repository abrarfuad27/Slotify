const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (userData, res) => {
  const { email, password } = userData;

  return new Promise((resolve, reject) => {
    // Check if the user exists in the database
    db.get(
      `SELECT * FROM Member WHERE email = ?`,
      [email],
      async (err, user) => {
        if (err) {
          reject("Database error: " + err.message);
        } else if (!user) {
          reject("Invalid email or password.");
        } else {
          try {
            // Compare the provided password with the stored encrypted password
            const isMatch = await bcrypt.compare(password, user.encryptedPassword);
            if (!isMatch) {
              reject("Invalid email or password. Please try again.");
            } else {
              // Generate a JWT token
              const token = jwt.sign(
                { id: user.id, email: user.email }, // Payload
                JWT_SECRET, // Secret key
                { expiresIn: "4h" } // Token expiration
              );

              // Set the token in an HTTP-only cookie
              res.cookie("authToken", token, {
                httpOnly: true, // Can't be accessed by JavaScript
                //secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
                maxAge: 4 * 60 * 60 * 1000, // 4 hours
                sameSite: "strict", // Prevents CSRF
              });
              resolve({
                message: "Login successful!",
                token, // You can still send the token in the response if needed
              });
            }
          } catch (error) {
            reject("Error during login: " + error.message);
          }
        }
      }
    );
  });
};

module.exports = { loginUser };
