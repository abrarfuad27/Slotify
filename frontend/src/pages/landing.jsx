import React from 'react';
import schedule_icon from '../assets/schedule_icon.png';
import meeting_icon from '../assets/meeting_icon.png';
import appointment_icon from '../assets/appointment_icon.png';

import '../style/landing.css';

const Landing = () => {
    const handleClick = () => { alert('Button was clicked!'); };

  return (
    <div className='landing'>
        {/* put nav bar component */}
        <div className='nav-dummy'></div>
        {/* hero section */}
        <div className='hero'>
            <div className='hero-img'></div>

            <div className='hero-txt'>
                {/* in css set the div to use background image */}
                {/* <img src={backgroundImage}></img> */}
                <h1>Simplify Your Appointments Today</h1>
                <h2>Perfect for office hours, meetings, and one-on-one sessions.</h2>
                <button onClick={handleClick} type='button' className='general-btn'>Secure your slot!</button>
            </div>
        </div>
        

        {/* content section */}
        <div className='content'>
            <div className='content-item'>
                <img src={schedule_icon}></img>
                <h3>Easy scheduling for office hours</h3>
                <p>Professors and TAs can set up regular office hours, 
                    making it simple for students to view and book available time slots.</p>
            </div>
            
            <div className='content-item'>
                <img src={meeting_icon}></img>
                <h3>One-time meeting creation</h3>
                <p>Create unique, non-recurring meetings for 
                    special appointments or  discussions, ensuring flexibility in scheduling.</p>
            </div>

            <div className='content-item'>
                <img src={appointment_icon}></img>
                <h3>Centralized appointment history</h3>
                <p>Access a clear, organized list of all past and 
                    upcoming appointments in one place for quick reference and better time management.</p>
            </div>
        </div>

        {/* put footer  */}
        <div className='footer-dummy'></div>
    </div>
  );
};

export default Landing;
