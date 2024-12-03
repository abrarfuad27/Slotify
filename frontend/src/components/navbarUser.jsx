import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/navbarUser.css';
import slotifyLogo from '../assets/slotify-logo.png';

const NavBarUser = () => {

  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar-user">
      <div className="logo">
        <Link to="/">
            <img src={slotifyLogo} alt="Slotify Logo" className="logo"/>
        </Link>
      </div>
      <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
        {/* Appointments Dropdown */}
        <li className="dropdown">
          <Link to="/appointments">Appointments</Link>
          <ul className="dropdown-menu">
            <li><Link to="/appointments">Book Appointment</Link></li>
            <li><Link to="/create-appointment">Create Appointment</Link></li>
          </ul>
        </li>
        {/* Poll Dropdown */}
        <li className="dropdown">
          <Link to="/poll">Poll</Link>
          <ul className="dropdown-menu">
            <li><Link to="/create-poll">Create Poll</Link></li>
            <li><Link to="/poll">Access Poll</Link></li>
            <li><Link to="/poll-results">See Poll Results</Link></li>
          </ul>
        </li>
      </ul>
      <div className="auth-buttons">
        <Link to="/userLogin" className="auth-button login-button">Log In</Link>
        <Link to="/userRegister" className="auth-button signup-button">Sign Up</Link>
      </div>
    </nav>
  );
};

export default NavBarUser;
