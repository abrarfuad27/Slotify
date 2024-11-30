import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NavBarMember from './components/navbarMember';
import './App.css';
import Landing from './pages/landing';
import MemberDashboard from './pages/memberDashboard';

import Appointments from './pages/appointments';
import MeetingRequests from './pages/meetingRequests';
import MeetingHistory from './pages/meetingHistory';
import CreatePoll from './pages/createPoll';

// import axios from 'axios';

function App() {
  // State to store the message from the backend
  const [message, setMessage] = useState('');

  // const publicUrl = 'https://fall2024-comp307-group06.cs.mcgill.ca/api';
  const publicUrl = 'http://localhost:4000';

  // Function to fetch the message from the backend
  const fetchMessage = async () => {
    try {
      const response = await fetch(`${publicUrl}/message`);
      // const response = axios.get(`${publicUrl}/message`);
      console.log(`${publicUrl}/message`);
      const data = await response.json();
      console.log(data);
      setMessage(data.msg); // Update state with the backend message
    } catch (error) {
      console.error('Error fetching the message:', error);
      setMessage(`Error fetching message: ${error}`);
    }
  };

  return (

    <Router>
        <NavBarMember />
        <Routes>
          {/* <Landing></Landing> */}
          <MemberDashboard></MemberDashboard>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/createPoll" element={<CreatePoll />} />
          <Route path="/history" element={<MeetingHistory />} />
          <Route path="/requests" element={<MeetingRequests />} />
        </Routes>
    </Router>
    // <div className="App">
    //   <button onClick={fetchMessage}>Click to print Hello World</button>
    //   <div>{message}</div>
    // </div>

    // style.css global with primary colours, font, h1 h2 etc. navbar dummy
  );
}

export default App;
