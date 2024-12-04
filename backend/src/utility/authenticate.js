const jwt = require("jsonwebtoken");
const db = require("./db");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      isAuthenticated: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Additional database check to ensure user still exists
    db.get(
      `SELECT email FROM Member WHERE email = ?`,
      [decoded.email],
      (err, user) => {
        if (err) {
          return res.status(500).json({
            message: "Server error during validation",
            isAuthenticated: false,
          });
        }

        if (!user) {
          return res.status(401).json({
            message: "User no longer exists",
            isAuthenticated: false,
          });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    // Token is invalid or expired
    return res.status(403).json({
      message: "Invalid or expired token",
      isAuthenticated: false,
    });
  }
};

module.exports = { authenticateToken };
