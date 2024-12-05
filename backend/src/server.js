const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authenticateToken } = require("./utility/authenticate"); // Import the authenticateToken function
const { registerUser } = require("./utility/register");
const { loginUser } = require("./utility/login");
const db = require("./utility/db");
const { getUpcomingAppts } = require("./utility/upcomingAppointments"); // Import the get upcoming appointments function
const {createAppointments } = require("./utility/createAppointments");
const app = express();
const PORT = 4000;

const corsOptions = {
  origin: "http://localhost:3000", // Your React app's URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Route to handle registration
app.post("/userRegister", async (req, res) => {
  const userData = req.body;
  console.log("Received registration data:", userData);
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
    const result = await loginUser(req.body, res);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Route to handle user logout
app.post("/userLogout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully!" });
});

// Validation route
app.get("/validateUser", authenticateToken, (req, res) => {
  // If we've made it this far, the user is authenticated
  res.json({
    isLoggedIn: true,
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
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

// Route to handle appointment creation
app.post("/createAppointments", async (req, res) => {
  try {
    const result = await createAppointments(req.body, res); 
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});// Add a closing curly brace here

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
