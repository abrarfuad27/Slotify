
// import React from "react";
// import { useAuth } from "../context/AuthContext";

// export default function MemberDashboard() {
//   const { logout } = useAuth(); // Access the logout function from AuthContext

//   const handleLogout = async () => {
//     try {
//       await logout(); // Call the logout function
//       // Redirect to the home after logging out
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Member Dashboard</h1>
//       <button className="btn btn-primary" onClick={handleLogout}>
//         Sign Out
//       </button>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import '../style/memberDashboard.css';
import DashboardCard from '../components/dashboardCard';
import NavBarMember from '../components/navbarMember';
import axios from "axios";
import { parseISO, format } from 'date-fns';

const MemberDashboard = () => {
  // database information
  const [apptTimes, setApptTimes] = useState([]);
  const [apptDivs, setApptDivs] = useState([]);
  // dynamically change upcoming-meetings-container height
  const [height, setHeight] = useState(35);


  // TODO: replace dummy data
  const email = 'student@mcgill.ca';
  const userData = {
      email
  };

    // on mount, get upcoming appointments from database
    useEffect(()=> {
      getUpcomingAppointments();
    }, []);

    // update the dashboard with the upcoming meetings
    useEffect(() => { 
      displayUpcomingAppointments();
    }, [apptTimes]);

    // method to get upcoming meetings/appointments
    const getUpcomingAppointments = async () => {
      try{
        const resp = await axios.get('http://localhost:4000/upcomingAppointments', {
          params: userData
        });
        setApptTimes(resp.data.data);  
      }catch (error) {
        console.error('There was an error getting the upcoming appointments.', error);
      }
    };

    // format date
    function formatDate(dateString) { 
      const formattedDate = format(parseISO(dateString), "MMM do, yyyy");
      return formattedDate; 
    }
  
    // method to display upcoming meetings/appointments to dashboard
    const displayUpcomingAppointments = () => {
      let queryData = [];
      
      if (apptTimes.length === 0) {
        const empty_card = { 
            'content':(
            <div className='card-content'>
                <p>No meetings yet!</p>
                <p>Start by creating an appointment</p>
            </div>
            ),
            'banner': ''
        };
        queryData.push(empty_card);
          // queryData = [(
          //     <div className='card-content'>
          //         <p>No meetings yet!</p>
          //         <p>Start by creating an appointment</p>
          //     </div>
          // )]
      } else if (apptTimes.length === 2){
          setHeight(55);
      } else {
          setHeight(68);
      }

      let data = '';
      let divElement = null;
      for (let i=0; i < apptTimes.length; i++){
        console.log(apptTimes[i]);
        
        data = apptTimes[i];
        const divElement = { 
          'content':(
          <div className='card-content'>
            <p>Time: {formatDate(data['timeslotDate'])} from {data['startTime']}-{apptTimes[i]['endTime']}</p>
            <p>Organizer: {data['creator']}</p>
            <p>Topic: {data['topic']}</p>
            <p>URL:  {data['appointmentURL']} </p>
          </div>
          ),
          'banner': data['course']
        };
        
        queryData.push(divElement);
        
      }
      setApptDivs(queryData);
  };
  
  return (
    <div className='member-dashboard'>
        <NavBarMember/>
        <div className='dashboard-content'>
            <div className='dashboard-background'></div>
            {/* header */}
            <div className='dashboard-el'>
                <h1>Welcome!</h1>
                <div className='upcoming-meetings-container container-box' style={{height: `${height}vh`}}>
                    <h2>Your upcoming meetings</h2>

                    {/* TODO: set limit to max 3 info-cards showing */}
                    <div className='info-card-container'>
                        {apptDivs.map((appt, _)=>(
                            <DashboardCard content={appt.content} banner={appt.banner}></DashboardCard>
                        ))}
                    </div>
                </div>
                <button type='button' className='create-appt-btn'>Create an Appointment</button>
            </div>

        </div>
        
        {/* footer */}
        <div className='footer-dummy'></div>
    </div>

  );
};

export default MemberDashboard;
