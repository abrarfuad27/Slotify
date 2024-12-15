
const { backendPort, frontendUrl } = require("./constants.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authenticateToken } = require("./utility/authenticate"); // Import the authenticateToken function
const { registerUser } = require("./utility/register");
const { loginUser } = require("./utility/login");
const db = require("./utility/db");
const { getUpcomingAppts, getCreatorUpcomingAppts } = require("./utility/upcomingAppointments"); // Import the get upcoming appointments function
const { createPollAndSlots } = require("./utility/createPollAndSlots");
const { getPollAndSlots } = require("./utility/getPollAndSlots");
const { votePoll } = require("./utility/votePoll");
const { getAvailableTimeslots } = require("./utility/getTimeslots");
const { bookTimeslot } = require("./utility/bookTimeslot");
const { getMeetingHistory, getCreatorMeetingHistory } = require("./utility/meetingHistory"); 
const { createTimeSlot } = require("./utility/createTimeSlot"); 
const { getRequests } = require("./utility/getRequests");
const { acceptRequest, deleteRequest } = require("./utility/answerRequest");
const {createAppointments } = require("./utility/createAppointments");
const {createAppointmentOnRequest } = require("./utility/createAppointmentOnRequest");
const {getManagedPolls} = require("./utility/getManagedPolls")
const {endPoll} = require("./utility/endPoll")


const app = express();
const PORT = backendPort;

const corsOptions = {
  origin: `${frontendUrl}`, // React app's URL
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
// Route to get member dashboard page's upcoming meetings
app.get("/upcomingAppointments", async (req, res) => {
  try {
    const result = await getUpcomingAppts(req.query);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
    console.log(error.message); // log for programmer debugging
  }
});

app.get("/upcomingCreatorAppointments", async (req, res) => {
  try {
    const result = await getCreatorUpcomingAppts(req.query, res);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.post("/createPollAndSlots", async (req, res) => {
  const pollData = req.body;
  console.log("Received poll data:", pollData);
  try {
    const result = await createPollAndSlots(pollData);
    res.status(201).json({ status: "success", message: result });
  } catch (error) {
    res.status(400).json({ status: "error", message: error });
  }
});

app.get("/getPollAndSlots", async (req, res) => {
  try {
    const result = await getPollAndSlots(req.query, res);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.post("/voteOnSlot", async (req, res) => {
  const { pollSlotId } = req.body;

  if (!pollSlotId) {
    return res.status(400).json({ message: "Polling slot ID is required." });
  }

  try {
    const result = await votePoll(pollSlotId); // Call the function
    res.status(200).json({ status: "success", message: result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

app.post("/getAvailableTimeslots", async (req, res) => {
  const { searchUrl } = req.body;

  try {
    const availableTimeslots = await getAvailableTimeslots(searchUrl);
    res.status(200).json({ status: "success", availableTimeslots });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

app.post("/bookTimeslot", async (req, res) => {
  const { timeslotId, email } = req.body;

  try {
    const result = await bookTimeslot(timeslotId, email);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// Route to handle member dashboard page past meetings
app.get("/meetingHistory", async (req, res) => {
  try {
    const result = await getMeetingHistory(req.query); // Use req.query instead of req.body for GET requests
    console.log(req)
    res.json({ data: result }); // Send the resolved data as JSON
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.get("/meetingCreatorHistory", async (req, res) => {
  try {
    const result = await getCreatorMeetingHistory(req.query); // Use req.query instead of req.body for GET requests
    console.log(req)
    res.json({ data: result }); // Send the resolved data as JSON
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//create TimeSlots
app.post("/createTimeSlot", async (req, res) => {
  try {
    const result = await createTimeSlot(req.body, res);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//get Requests
app.get("/requests", async (req, res) => {
  try {
    const result = await getRequests(req.query); // Use req.query instead of req.body for GET requests
    res.json({ data: result }); // Send the resolved data as JSON
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//accept Requests
app.put("/handleRequests", async (req, res) => {
  try {
    const { timeSlotId } = req.body;
    const result = await acceptRequest(timeSlotId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
//deny Requests
app.delete("/handleRequests", async (req, res) => {
  try {
    const { timeSlotId } = req.body;
    const result = await deleteRequest(timeSlotId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.post("/createAppointmentOnRequest", async (req, res) => {
  try {
    const result = await createAppointmentOnRequest(req.body, res);
    res.status(201).json({ status: "success", message: result });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Route to handle appointment creation
app.post("/createAppointments", async (req, res) => {
  try {
    const result = await createAppointments(req.body, res);
    // console.log(res.json(result));
    res.status(201).json({ status: "success", message: result });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// TODO PUT THE THING ON the server one
// Route to get managed active/inactive polls
app.get("/getManagedPolls", async (req, res) => {
  try {
    const result = await getManagedPolls(req.query, res); 
    // console.log(res.json(result));
    res.json(result);
    // res.status(201).json({ status: "success", message: result });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Route to handle ending polls
app.put("/endPoll", async (req, res) => {
  try {
    const { pollId } = req.body;
    const result = await endPoll(pollId, res); 
    // console.log(res.json(result));
    res.status(201).json({ status: "success", message: result });

  } catch (error) {
    res.status(400).json({ message: error });
  }
});
// Add a closing curly brace here


// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
