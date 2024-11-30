import React from 'react';
import { Link } from 'react-router-dom';
import '../style/navbarMember.css';

const NavBarMember = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/path-to-logo.png" alt="Slotify Logo" />
        <span>Slotify</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
        <li><Link to="/poll">Poll</Link></li>
        <li><Link to="/history">History</Link></li>
        <li><Link to="/requests">View Requests</Link></li>
      </ul>
      <button className="logout-button">Log Out</button>
    </nav>
  );
};

export default NavBarMember;
