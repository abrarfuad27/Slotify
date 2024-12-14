// Abrar Mohammad Fuad; 261083785
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (userData, res) => {
  const { email, password } = userData;

  return new Promise((resolve, reject) => {
    // Validate input
    if (!email || !password) {
      return reject("Email and password are required.");
    }

    // Check if the user exists in the database
    db.get(
      `SELECT * FROM Member WHERE email = ?`,
      [email],
      async (err, user) => {
        if (err) {
          return reject("Database error: " + err.message);
        }

        if (!user) {
          return reject("Invalid email or password.");
        }

        try {
          // Compare the provided password with the stored encrypted password
          const isMatch = await bcrypt.compare(
            password,
            user.encryptedPassword
          );

          if (!isMatch) {
            return reject("Invalid email or password. Please try again.");
          }

          // Generate a JWT token with more specific payload
          const token = jwt.sign(
            { 
              id: user.email, // Using email as unique identifier
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            },
            JWT_SECRET,
            { 
              expiresIn: "4h",
              issuer: "Slotify",
              audience: "SlotifyUsers"
            }
          );

          // Set the token in an HTTP-only, secure cookie
          res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure in production
            sameSite: 'strict', // Protect against CSRF
            maxAge: 4 * 60 * 60 * 1000, // 4 hours
          });

          resolve({
            message: "Login successful!",
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        } catch (error) {
          reject("Error during login: " + error.message);
        }
      }
    );
  });
};

module.exports = { loginUser };