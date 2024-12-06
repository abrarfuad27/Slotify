import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import NavBarMember from "../components/navbarMember";
import NavBarUser from "../components/navbarUser";
import "../style/bookAppointment.css";
import BookAppointmentSearchBar from "../components/bookAppointmentSearchBar";
import axios from "axios";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Modal from "react-modal"; // Import React Modal
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const { user, isLoading } = useAuth();
  const [url, setURL] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [selectedTimeslot, setSelectedTimeslot] = useState(null); // For the selected timeslot
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [previousUserState, setPreviousUserState] = useState(null);

  useEffect(() => {
    if (user) {
      setUserEmail(user.email); // Automatically populate email when user logs in
    } else {
      setUserEmail("");
    }
  }, [user]);

  useEffect(() => {
    // If the user logs out (previously logged in but now null), redirect to login
    if (!isLoading && previousUserState && !user) {
      navigate("/userLogin", { replace: true });
    }

    // Update the previous user state
    setPreviousUserState(user);
  }, [user, isLoading, navigate, previousUserState]);

  const openModal = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSearch = async (searchUrl) => {
    if (!searchUrl) {
      openModal("Please enter a URL", false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/getAvailableTimeslots",
        { searchUrl },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        const { firstName, lastName,creator, course, topic, timeslots } =
          response.data.availableTimeslots;

        setCreatorName(`${firstName} ${lastName}`);
        setCreatorEmail(creator);
        setCourse(course);
        setTopic(topic);
        setAvailableTimeslots(timeslots);
      } else {
        openModal(response.data.message || "Error fetching timeslots", false);
      }
    } catch (error) {
      console.error("Error fetching timeslots:", error);
      // Reset all fields if there is an error to prevent stale data
      setAvailableTimeslots([]);
      setSelectedDateSlots([]);
      setSelectedTimeslot(null);
      setCourse("");
      setTopic("");
      setCreatorName("");
      setCreatorEmail("");
      if (error.status == 404) {
        openModal("Appointment not found. Please enter a valid URL.", false);
      } else if (error.status == 405) {
        openModal("This appointment no longer has available timeslots.", false);
      } else {
        openModal("Failed to fetch timeslots. Please try again later.", false);
      }
    }
  };

  // Filter timeslots by selected date
  const handleDateChange = (newDate) => {
    const selectedDate = newDate.format("YYYY-MM-DD");
    const filteredSlots = availableTimeslots.filter(
      (slot) => dayjs(slot.timeslotDate).format("YYYY-MM-DD") === selectedDate
    );

    setSelectedDateSlots(filteredSlots);
  };

  const handleTimeslotClick = (timeslotId) => {
    setSelectedTimeslot(timeslotId); // Allow only one selection
    return;
  };

  const handleBook = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(mcgill\.ca|mail\.mcgill\.ca)$/;

    if (!emailRegex.test(userEmail)) {
      openModal("Please enter a valid McGill email address.", false);
      return;
    }

    if (!selectedTimeslot) {
      openModal("Please select a timeslot first.", false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/bookTimeslot",
        { email: userEmail, timeslotId: selectedTimeslot },
        { withCredentials: true }
      );
      openModal(response.data.message, true);
    } catch (error) {
      console.error("Error booking timeslot:", error);
      if (error.status == 400) {
        openModal("Timeslot is no longer available.", false);
      } else {
        openModal("Failed to book the timeslot. Please try again.", false);
      }
    }
  };

  return (
    <>
      {user ? <NavBarMember /> : <NavBarUser />}
      <div className="book-appointment-container">
        <h1 className="header">Book an Appointment</h1>
        <p className="enter-url-text">Enter the URL provided</p>
        <BookAppointmentSearchBar
          url={url}
          setURL={setURL}
          onSearch={handleSearch}
        />
        {availableTimeslots.length !== 0 && (
          <div className="calendar-timeslots-container">
            <p> {creatorName}'s Calendar</p>
            <div className="calendar-container">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  disablePast
                  displayStaticWrapperAs="desktop"
                  shouldDisableDate={(date) =>
                    !availableTimeslots.some(
                      (slot) =>
                        dayjs(slot.timeslotDate).format("YYYY-MM-DD") ===
                        date.format("YYYY-MM-DD")
                    )
                  }
                  onChange={handleDateChange}
                  sx={{
                    border: "1px solid #000000",
                    borderRadius: "10px",
                    width: "100%", // Full width for smaller screens
                    maxWidth: "400px", // Limit max width
                    margin: "0 auto", // Center align
                    "@media (max-width: 800px)": {
                      maxWidth: "300px", // Smaller calendar for medium screens
                    },
                    "@media (max-width: 600px)": {
                      maxWidth: "250px", // Compact calendar for small screens
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="timeslots-container">
              {selectedDateSlots.length > 0 ? (
                <div className="timeslots-list">
                  {selectedDateSlots.map((slot, index) => (
                    <div
                      key={slot.timeslotID}
                      className={`timeslot ${
                        selectedTimeslot === slot.timeslotID ? "selected" : ""
                      }`}
                      onClick={() => handleTimeslotClick(slot.timeslotID)}
                    >
                      {`${creatorName}  ${course}  ${topic} | ${slot.startTime} - ${slot.endTime}`}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No timeslots available for the selected date.</p>
              )}
            </div>
          </div>
        )}
        <div className="book-user-member-container">
          {/* Conditionally render user info */}
          {!user && availableTimeslots.length > 0 && (
            <div className="book-user-container">
              <p>Ready to book?</p>
              <input
                type="text"
                placeholder="Enter your email:"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <button onClick={handleBook}>Book Meeting</button>
              <p className="alternate-meeting-text">
                Alternative meeting timeslots can only be requested by members.
              </p>
              <p className="login-or-register">
                <a href="/userLogin">Log In</a> or{" "}
                <a href="/userRegister">Register</a>
              </p>
            </div>
          )}
          {user && availableTimeslots.length > 0 && (
            <div className="book-member-container">
              <p>Don't see a timeslot with your availability?</p>
              {
                <a href="/requests">
                  <p>Click here to request a meeting with {creatorName}!</p>
                </a>
              }
              <button onClick={handleBook}>Book Meeting</button>
            </div>
          )}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Appointment Booking Status"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>{isSuccess ? "Success" : "Error"}</h2>
          <p>{modalMessage}</p>
          <button
            onClick={() => {
              if (isSuccess) {
                window.location.reload(); // Refresh the page
              } else {
                closeModal(); // Close the modal if not successful
              }
            }}
          >
            OK
          </button>
        </Modal>
      </div>
    </>
  );
}
