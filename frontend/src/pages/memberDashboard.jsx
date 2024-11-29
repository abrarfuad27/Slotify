import React from 'react';
import '../style/memberDashboard.css';
import DashboardCard from '../components/dashboardCard';

const MemberDashboard = () => {
  const content = (
    <div className='card-content'>
        <p><b>Time:</b> January 1, 2025 at 1:00 PM - 1:15 PM</p>
        <p><b>Member:</b> Prof. Joseph Vybihal</p>
        <p><b>Course:</b> COMP307</p>
        <p><b>URL:</b>  https://example.com/</p>
    </div>
  );
  
  return (
    <div className='member-dashboard'>
        {/* nav bar */}
        <div className='nav-dummy'></div>
        
        <div className='dashboard-content'>
            <div className='dashboard-background'></div>
            {/* header */}
            <div className='dashboard-el'>
                <h1>Welcome!</h1>
                <div className='upcoming-meetings-container'>
                    <h2>Your upcoming meetings</h2>

                    {/* TODO: set limit to max 3 info-cards showing */}
                    <div className='info-card-container'>
                        <DashboardCard content={content}></DashboardCard>
                        <DashboardCard content={content}></DashboardCard>                                
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
