/* Name: Abrar Fuad Mohammad, Samuel Lin */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/navbarMember.css";
import slotifyLogo from "../assets/slotify-logo.png";
import { useAuth } from "../context/AuthContext";

const NavBarMember = () => {
  const { logout } = useAuth(); // Access the logout function from AuthContext

  const [toggle, setToggle] = useState(false); // state to keep track of hamburger
  const [dropdownToggle, setDropdownToggle] = useState({
    appointments: false,
    poll: false,
  }); // state to keep track of dropdown menus on mobile screens (can't rely on hover to drop down the dropdown menus)

  // function to toggle the hamburger menu
  const handleHamburgerToggle = () => {
    setToggle(!toggle);
    setDropdownToggle({
      appointments: false,
      poll: false,
    });
  };

  // function to toggle dropdown menus
  const handleDropdownToggle = (menu) => {
    setDropdownToggle((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === menu ? !prevState[key] : false;
        return acc;
      }, {}); // {} as the initial value of the accumulator
      return newState;
    });
  };

  // Side effect to add/remove no-scroll class on body
  useEffect(() => {
    if (toggle) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [toggle]);

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      // Redirect to the home after logging out
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="navbar-member">
        <div className="logo">
          <Link to="/memberDashboard">
            <img src={slotifyLogo} alt="Slotify Logo" className="logo" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/memberDashboard">Home</Link>
          </li>
          <li className="dropdown">
            <Link to="/bookAppointment">
              Appointments <span className="down-arrow">&#9662;</span>
            </Link>
            <ul className="dropdown-menu ">
              <li>
                <Link to="/bookAppointment">Book Appointment</Link>
              </li>
              <li>
                <Link to="/appointmentCreation">Create Appointment</Link>
              </li>
              <li>
                <Link to="/upcomingAppointments">Upcoming Appointments</Link>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <Link to="/poll">
              Poll <span className="down-arrow">&#9662;</span>
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/createPoll">Create Poll</Link>
              </li>
              <li>
                <Link to="/poll">Access Poll</Link>
              </li>
              <li>
                <Link to="/managePoll">Manage Poll</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/meetingHistory">History</Link>
          </li>
          <li>
            <Link to="/requests">View Requests</Link>
          </li>
        </ul>

        <div className="logout-button">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div className="hamburger" onClick={handleHamburgerToggle}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      <div className={`hamburger-content ${toggle ? "active" : ""}`}>
        <div className="close-icon" onClick={handleHamburgerToggle}>
          &#10005; {/* Unicode for cross icon */}
        </div>
        <Link to="/memberDashboard">Home</Link>
        <div className="dropdown">
          <Link to="/bookAppointment">Appointments </Link>
          <span
            className="down-arrow"
            onClick={() => handleDropdownToggle("appointments")}
          >
            &#9662;
          </span>
          <ul
            className={`dropdown-menu ${
              dropdownToggle.appointments ? "active" : ""
            }`}
          >
            <li>
              <Link to="/bookAppointment">Book Appointment</Link>
            </li>
            <li>
              <Link to="/appointmentCreation">Create Appointment</Link>
            </li>
            <li>
              <Link to="/upcomingAppointments">Upcoming Appointments</Link>
            </li>
          </ul>
        </div>
        <div className="dropdown">
          <Link to="/poll">Poll </Link>
          <span
            className="down-arrow"
            onClick={() => handleDropdownToggle("poll")}
          >
            &#9662; {/* Unicode for down arrow */}
          </span>
          <ul
            className={`dropdown-menu ${dropdownToggle.poll ? "active" : ""}`}
          >
            <li>
              <Link to="/createPoll">Create Poll</Link>
            </li>
            <li>
              <Link to="/poll">Access Poll</Link>
            </li>
            <li>
              <Link to="/managePoll">Manage Poll</Link>
            </li>
          </ul>
        </div>
        <Link to="/meetingHistory">History</Link>
        <Link to="/requests">View Requests</Link>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </>
  );
};

export default NavBarMember;
