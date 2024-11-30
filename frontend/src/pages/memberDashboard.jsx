import React from "react";
import { useAuth } from "../context/AuthContext";

export default function MemberDashboard() {
  const { logout } = useAuth(); // Access the logout function from AuthContext

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      // Redirect to the home after logging out
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container">
      <h1>Member Dashboard</h1>
      <button className="btn btn-primary" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}
