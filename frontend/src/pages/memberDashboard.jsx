// Christina Chen
import React, { useState, useEffect } from 'react';
import '../style/memberDashboard.css';
import DashboardCard from '../components/dashboardCard';
import NavBarMember from '../components/navbarMember';
import axios from "axios";
import { parseISO, format } from 'date-fns';
import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer";
import { Link } from 'react-router-dom';
import { publicUrl } from '../constants';
import Modal from "react-modal";

const MemberDashboard = () => {
  // member metadata
  const { user } = useAuth();
  const email = user.email;
  const max_num_meetings = 5;

  // database information
  const [apptTimes, setApptTimes] = useState([]);
  const [apptDivs, setApptDivs] = useState([]);

  // height of upcoming-meetings-container
  const [height, setHeight] = useState(50);

  // modal attributes
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);


  // on mount, get upcoming appointments from database
  useEffect(() => {
    // arguments for getUpcomingAppointments
    const userData = {
      email,
      max_num_meetings
    };
    getUpcomingAppointments(userData);
  }, []);

  // update the dashboard with the upcoming meetings
  useEffect(() => {
    displayUpcomingAppointments();
  }, [apptTimes]);


  // method to get upcoming meetings/appointments
  const getUpcomingAppointments = async (userData) => {
    try {
      // database call to get meetings
      const resp = await axios.get(`${publicUrl}/upcomingAppointments`, {
        params: userData
      });
      // save the meeting times
      setApptTimes(resp.data.data);
    } catch (error) {
      openModal(`There was an error getting the upcoming appointments : Error ${error.status}`, false);
    }
  };

  // method to display upcoming meetings/appointments to dashboard
  const displayUpcomingAppointments = () => {
    let queryData = [];

    /* dynamically set the height of upcoming-meetings-container, 
    based on number of meetings */
    if (apptTimes.length === 0) {
      const empty_card = {
        'content': (
          <div className='card-content empty-card'>
            <p>No meetings yet!</p>
            <p>Start by creating an appointment</p>
          </div>
        ),
        'banner': ''
      };
      queryData.push(empty_card);
    } else if (apptTimes.length === 1) {
      setHeight(48);
    } else if (apptTimes.length === 2) {
      setHeight(55);
    } else {
      setHeight(70);
    }

    let data = '';
    let appointee = '';
    let organizer = '';
    let divElement = null;

    // creating the content of the meeting cards
    for (let i = 0; i < apptTimes.length; i++) {
      console.log(apptTimes[i]);
      data = apptTimes[i];

      // indicate whether a member is the creator or appointee of the meeting
      organizer = data.creator === email ? 'You' : data.creator;
      appointee = data.appointee === email ? 'You' : data.appointee;
      divElement = {
        'content': (
          <div className='card-content'>
            <p>Time: {formatDate(data['timeslotDate'])} from {data['startTime']}-{apptTimes[i]['endTime']}</p>
            <p>Organizer: {organizer} </p>
            <p>Participant: {appointee ? appointee : 'No one yet'} </p>
            <p>Topic: {data['topic']}</p>
            <p>URL:  {data['appointmentURL']} </p>
          </div>
        ),
        'banner': data['course']
      };
      // add content
      queryData.push(divElement);
    }
    setApptDivs(queryData);
  };

  function formatDate(dateString) {
    const formattedDate = format(parseISO(dateString), "MMM do, yyyy");
    return formattedDate;
  }

  // modal methods
  const openModal = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className='member-dashboard'>
        <NavBarMember />
        {/* main content */}
        <div className='dashboard-content'>
          <div className='dashboard-background'></div>

          {/* dashboard header */}
          <div className='dashboard-el'>
            <h1>Welcome!</h1>
            <div className='upcoming-meetings-container container-box' style={{ height: `${height}%` }}>
              <h2>Your upcoming meetings</h2>

              {/* upcoming meeting cards */}
              <div className='info-card-container'>
                {apptDivs.map((appt, index) => (
                  <DashboardCard content={appt.content} banner={appt.banner} key={index} />
                ))}
              </div>
            </div>
            {/* button to create appointment */}
            <Link to="/appointmentCreation" className='create-appt-btn'>Create an Appointment</Link>
          </div>

        </div>
        <Footer />

        {/* modal for backend error */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Appointment Creation Status"
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
};

export default MemberDashboard;