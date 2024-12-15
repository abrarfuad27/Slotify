/* Name: Abrar Fuad Mohammad, Samuel Lin */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/navbarUser.css";
import slotifyLogo from "../assets/slotify-logo.png";

const NavBarUser = () => {
  // state to toggle the hamburger menu
  const [toggle, setToggle] = useState(false);

  // function to toggle the hamburger menu
  const handleHamburgerToggle = () => {
    setToggle(!toggle);
  };

  // Side effect to add/remove no-scroll class on body
  useEffect(() => {
    if (toggle) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [toggle]);

  return (
    <>
      <nav className="navbar-user">
        <div className="logo">
          <Link to="/">
            <img src={slotifyLogo} alt="Slotify Logo" className="logo" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/bookAppointment">Book Appointment</Link>
          </li>
          <li>
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
        <div className="hamburger" onClick={handleHamburgerToggle}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      {/* rendered when the hamburger menu is clicked (hamburger visible when screen is below 900px) */}
      <div className={`hamburger-content ${toggle ? "active" : ""}`}>
        <div className="close-icon" onClick={handleHamburgerToggle}>
          &#10005; {/* Unicode for cross icon */}
        </div>
        <Link to="/bookAppointment">Book Appointment</Link>
        <Link to="/poll">Access Poll</Link>
        <Link to="/userLogin" className="auth-button login-button">
          Log In
        </Link>
        <Link to="/userRegister" className="auth-button signup-button">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default NavBarUser;
