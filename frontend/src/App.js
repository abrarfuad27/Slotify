import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute, PublicRoute } from "./components/route.jsx";

import RegisterPage from "./pages/userRegister.jsx";
import LoginPage from "./pages/userLogin.jsx";

import Error404 from "./pages/errorPage.jsx";
import "./App.css";
import Landing from "./pages/landing";
import MemberDashboard from "./pages/memberDashboard";

import Appointments from "./pages/appointments";
import MeetingRequests from "./pages/meetingRequests";
import MeetingHistory from "./pages/meetingHistory";
import CreatePoll from "./pages/createPoll";
import BookAppointment from "./pages/bookAppointment.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />
            <Route
              path="/userRegister"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/bookAppointment" element={<BookAppointment />} />

            <Route
              path="/createPoll"
              element={
                <ProtectedRoute>
                  <CreatePoll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <MeetingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userLogin"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/memberDashboard"
              element={
                <ProtectedRoute>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/error404" element={<Error404 />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>

    // function App() {
    //   // const publicUrl = 'https://fall2024-comp307-group06.cs.mcgill.ca/api';
    //   const publicUrl = "http://localhost:4000";

    //   return (
    //     <Router>
    //       <div>
    //         {/* Navigation for demonstration */}
    //         {/* <NavBarMember /> */}
    //         <Routes>
    //           <Route
    //             path="/"
    //             element={
    //               <div style={{ textAlign: "center", marginTop: "20%" }}>
    //                 <h1>Welcome to Slotify</h1>
    //                 <Link to="/userRegister">
    //                   <button style={buttonStyle}>Go to Register</button>
    //                 </Link>
    //                 <Link to="/userLogin">
    //                   <button style={buttonStyle}>Go to Log In</button>
    //                 </Link>
    //               </div>
    //             }
    //           />
    //           <Route path="/userRegister" element={<RegisterPage />} />
    //           <Route path="/userLogin" element={<LoginPage />} />
    //           <Route path="/" element={<Landing />} />
    //           <Route path="/memberDashboard" element={<MemberDashboard />} />
    //           <Route path="/appointments" element={<Appointments />} />
    //           <Route path="/createPoll" element={<CreatePoll />} />
    //           <Route path="/history" element={<MeetingHistory />} />
    //           <Route path="/requests" element={<MeetingRequests />} />
    //         </Routes>
    //       </div>
    //     </Router>
  );
}

export default App;
