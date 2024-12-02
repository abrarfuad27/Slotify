import React, { useState, useEffect } from 'react';
import '../style/memberDashboard.css';
import DashboardCard from '../components/dashboardCard';
import NavBarMember from '../components/navbarMember';

const MemberDashboard = () => {
  const content = (
    <div className='card-content'>
        <p>Time: January 1, 2025 at 1:00 PM - 1:15 PM</p>
        <p>Member: Prof. Joseph Vybihal</p>
        <p>Course: COMP307</p>
        <p>URL:  https://example.com/</p>
    </div>
  );

  const [appointments, setAppointments] = useState([]);

//   dynamically change upcoming-meetings-container height
  const [height, setHeight] = useState(35);

//   simulates fetching upcoming appointments from database
  const fetchAppointment = () => {
    // query only 3 upcoming appointments, close to current date
    let queryData = [content, content, content];
    
    if (queryData.length === 0) {
        queryData = [(
            <div className='card-content'>
                <p>No meetings yet!</p>
                <p>Start by creating an appointment</p>
            </div>
        )]
    } else if (queryData.length === 2){
        setHeight(55);
    } else {
        setHeight(68);
    }
    setAppointments(queryData);
  }
  
  
  useEffect(() => { 
    fetchAppointment(); 
  }, []);

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
                        {appointments.map((appt, _)=>(
                            <DashboardCard content={appt}></DashboardCard>
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
