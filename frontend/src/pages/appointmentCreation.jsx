// Christina Chen
import React, { useState } from 'react';
import '../style/appointmentCreation.css';
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import FormComponent from '../components/appointmentForm';
import NavBarMember from '../components/navbarMember';
import Footer from "../components/footer";
import icon from "../assets/create_appt_icon.png";
import { publicUrl } from "../constants";
import Modal from "react-modal";
import copy_icon from "../assets/copy-icon.png";
const AppointmentCreation = () => {
  const { user } = useAuth();
  const email = user.email;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [apptLink, setApptLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Error modal methods
  const openModal = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Generate url for meetings and polls
  const generateUrl = (urlLength) => {
    const tokens = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let url = '';

    // Randomly generate a string of length === urlLength
    for (let i = 0; i < urlLength; i++) {
      const randInd = Math.floor(Math.random() * tokens.length);
      url += tokens[randInd];
    }
    return url;
  }

  // Method to create appointment 
  const handleSubmit = async (formData) => {
    try {
      // Argument validation
      if (!formData) {
        throw new Error('Invalid form data');
      }

      // Create structured request data
      const requestData = createRequestData(formData);

      // Create appointment in database
      const response = await axios.post(
        `${publicUrl}/createAppointments`,
        { ...requestData },
        {
          withCredentials: true,
        }
      );

      // Set modal message based on response
      if (response.data.status === "success") {
        setApptLink(requestData.appointmentURL);
        openModal("Appointment created! Save the appointment URL: ", true);
      }
      else {
        openModal(response.data.message || "Error creating appointment.", false);
      }

    } catch (error) {
      openModal("Failed to create appointment. Please try again later.", false);
    }
  };

  // Preparing data to create appointment
  const createRequestData = (formData) => {

    // If meeting is one-time, the start date === end date
    if (formData.meeting_mode === 'one-time') {
      formData.end_date = formData.start_date;
    }

    let requestData = {};
    const timeslotIds = [];

    // Generate one meeting Url per timeslot
    for (let i = 0; i < formData.timeslot_dates.length; i++) {
      timeslotIds.push('time' + generateUrl(11));
    }

    // Structure request data
    requestData = {
      ...formData,
      'creator': email,
      'appointmentId': 'appt' + generateUrl(11),
      'appointmentURL': 'slotify.com/appt/' + generateUrl(11),
      'timeslotIds': timeslotIds,
    }

    return requestData;
  };

  // Method to copy poll Url to clipboard
  const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (error) {
        console.error('Could not copy text:', error);
    }
  };

  return (
    <div className='appt-creation bg'>
      <NavBarMember />

      {/* Main content */}
      <div className='create-appt-content'>
        <div className='create-appt-header'>
          <h1>Create an Appointment&nbsp;</h1><img className='create-appt-icon' src={icon} alt='Create appointment header icon' />
        </div>
        <FormComponent onSubmit={handleSubmit} />
      </div>
      <Footer />

      {/* Error/success modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Appointment Creation Status"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {/* Modal content */}
        <h2>{isSuccess ? "Success" : "Error"}</h2>


        {/* Modal button to copy Url */}
        <p>{modalMessage}</p>
        <div className='created-appt-url-section'>
          <p className='appt-url'>
            {apptLink}
          </p>
          <button
            className="copy-icon-btn"
            onClick={() => copyToClipboard(apptLink)}
            style={{ display: apptLink ? 'inline-flex' : 'none',  background:'none'}}
          >
            <img src={copy_icon} alt='Copy icon' />
          </button>
        </div>
        <div className="appt-copy-confirmation">{copied && "Link Copied!"}</div>


        {/* Modal closing button */}
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
  );
};

export default AppointmentCreation;