import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute, PublicRoute } from "./components/route.jsx";

import RegisterPage from "./pages/userRegister.jsx";
import LoginPage from "./pages/userLogin.jsx";
import Error404 from "./pages/errorPage.jsx";
import MemberDashboard from "./pages/memberDashboard.jsx";

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
                  <div style={{ textAlign: "center", marginTop: "20%" }}>
                    <h1>Welcome to Slotify</h1>
                    <Link to="/userRegister">
                      <button style={buttonStyle}>Go to Register</button>
                    </Link>
                    <Link to="/userLogin">
                      <button style={buttonStyle}>Go to Log In</button>
                    </Link>
                  </div>
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
  margin: "0 10px",
};

export default App;
