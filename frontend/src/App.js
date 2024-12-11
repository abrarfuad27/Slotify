import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute, PublicRoute } from "./components/route.jsx";

import RegisterPage from "./pages/userRegister.jsx";
import LoginPage from "./pages/userLogin.jsx";
import Error404 from "./pages/errorPage.jsx";

import AppointmentCreation from "./pages/appointmentCreation.jsx";
import "./App.css";
import Landing from "./pages/landing";
import MemberDashboard from "./pages/memberDashboard";
// import Appointments from "./pages/appointments";
import MeetingHistory from "./pages/meetingHistory";
import CreatePoll from "./pages/createPoll";
import PollAccess from "./pages/pollAccess.jsx";
import BookAppointment from "./pages/bookAppointment.jsx";
import RequestMeeting from "./pages/requestMeeting.jsx";
import Requests from "./pages/requests.jsx";
import ManagePoll from "./pages/managePoll";


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
              path="/poll" 
              element={
                <PollAccess />
              }  
            />
            <Route
              path="/managePoll"
              element={
                <ProtectedRoute>
                  <ManagePoll />
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
            <Route
              path="/meetingHistory"
              element={
                <ProtectedRoute>
                  <MeetingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requestMeeting"
              element={
                <ProtectedRoute>
                  <RequestMeeting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointmentCreation"
              element={
                <ProtectedRoute>
                  <AppointmentCreation />
                </ProtectedRoute>
              }
            />
            <Route path="/error404" element={<Error404 />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
