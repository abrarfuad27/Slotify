import React from 'react';
import { Link } from 'react-router-dom';
import '../style/navbarMember.css';
import slotifyLogo from '../assets/slotify-logo.png';

const NavBarMember = () => {
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
            <li><Link to="/create-appointment">Create Appointment</Link></li>
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
      <Link to="/landing">
        <button className="logout-button">Log Out</button>
      </Link>
    </nav>
  );
};

export default NavBarMember;
