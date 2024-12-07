import React from 'react';
import { Link } from 'react-router-dom';
import '../style/navbarMember.css';
import slotifyLogo from '../assets/slotify-logo.png';
import { useAuth } from '../context/AuthContext';

const NavBarMember = () => {
  
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
    <nav className="navbar-member">
      <div className="logo">
        <img src={slotifyLogo} alt="Slotify Logo" className="logo"/>
      </div>
      <ul className="nav-links">
        <li><Link to="/memberDashboard">Home</Link></li>
        <li className="dropdown">
          <Link to="/appointments">Appointments</Link>
          <ul className="dropdown-menu">
            <li><Link to="/appointments">Book Appointment</Link></li>
            <li><Link to="/appointmentCreation">Create Appointment</Link></li>
          </ul>
        </li>
        <li className="dropdown">
          <Link to="/poll">Poll</Link>
          <ul className="dropdown-menu">
            <li><Link to="/createPoll">Create Poll</Link></li>
            <li><Link to="/poll">Access Poll</Link></li>
            <li><Link to="/poll-results">See Poll Results</Link></li>
          </ul>
        </li>
        <li><Link to="/history">History</Link></li>
        <li><Link to="/requests">View Requests</Link></li>
      </ul>
      <div className="logout-button">
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
};

export default NavBarMember;
