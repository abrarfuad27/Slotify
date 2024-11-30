import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/userRegister.jsx";
import LoginPage from "./pages/userLogin.jsx";

function App() {
  // const publicUrl = 'https://fall2024-comp307-group06.cs.mcgill.ca/api';
  const publicUrl = "http://localhost:5000";

  return (
    <Router>
      <div>
        {/* Navigation for demonstration */}
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
