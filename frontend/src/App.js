import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/userRegister.jsx";
import LoginPage from "./pages/userLogin.jsx";
import NavBarMember from './components/navbarMember';
import './App.css';
import Landing from './pages/landing';
import MemberDashboard from './pages/memberDashboard';

import Appointments from './pages/appointments';
import MeetingRequests from './pages/meetingRequests';
import MeetingHistory from './pages/meetingHistory';
import CreatePoll from './pages/createPoll';

function App() {
  // const publicUrl = 'https://fall2024-comp307-group06.cs.mcgill.ca/api';
  const publicUrl = "http://localhost:5000";

  return (
    <Router>
      <div>
        {/* Navigation for demonstration */}
        <NavBarMember />
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center", marginTop: "20%" }}>
                <h1>Welcome to Slotify</h1>
                <Link to="/userRegister">
                  <button style={buttonStyle}>Go to Register</button>
                </Link>
                <Link to="/userLogin">
                  <button style={buttonStyle}>Go to Log In</button>
                </Link>
              </div>
            }
          />
          <Route path="/userRegister" element={<RegisterPage />} />
          <Route path="/userLogin" element={<LoginPage />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/memberDashboard" element={<MemberDashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/createPoll" element={<CreatePoll />} />
          <Route path="/history" element={<MeetingHistory />} />
          <Route path="/requests" element={<MeetingRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

// Inline button style for the home page
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#003366",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default App;
