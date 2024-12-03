const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { registerUser } = require("./utility/register"); // Import the register function
const { loginUser } = require("./utility/login"); // Import the login function
const { getUpcomingAppts } = require("./utility/upcomingAppointments"); // Import the get upcoming appointments function
const app = express();
const PORT = 4000;
// const PORT = 5000;

// Enable CORS to allow requests from the local frontend
app.use(cors());
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON data

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken; // Read JWT from HTTP-only cookie

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid or expired token." });
    }

    req.user = user; // Attach user to the request object
    next(); // Allow the request to proceed
  });
};

//Route to handle registration
app.post("/userRegister", async (req, res) => {
  const userData = req.body; // Access the sent data
  console.log("Received data:", userData);
  try {
    const result = await registerUser(userData);
    res.status(201).json({ status: "success", message: result });
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
});

// Route to handle login
app.post("/userLogin", async (req, res) => {
  try {
    const result = await loginUser(req.body, res); // Pass `res` for setting cookies
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Route to handle user logout
app.post("/userLogout", (req, res) => {
  res.clearCookie("authToken"); // Removes the cookie
  res.json({ message: "Logged out successfully!" });
});

// Route to handle member dashboard page upcoming meetings
app.get("/upcomingAppointments", async (req, res) => {
  try {
    const result = await getUpcomingAppts(req.query, res); 
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running`);
});
