import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/navbarUser.css";
import slotifyLogo from "../assets/slotify-logo.png";

const NavBarUser = () => {
  return (
    <nav className="navbar-user">
      <div className="logo">
        <Link to="/">
          <img src={slotifyLogo} alt="Slotify Logo" className="logo" />
        </Link>
      </div>
      <ul className="nav-links">
        <li className="dropdown">
          <Link to="/bookAppointment">Book Appointment</Link>
        </li>
        <li className="dropdown">
          <Link to="/poll">Access Poll</Link>
        </li>
      </ul>
      <div className="auth-buttons">
        <Link to="/userLogin" className="auth-button login-button">
          Log In
        </Link>
        <Link to="/userRegister" className="auth-button signup-button">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default NavBarUser;
