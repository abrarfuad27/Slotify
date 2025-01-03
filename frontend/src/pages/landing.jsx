// Christina Chen
import React from 'react';
import NavBarUser from '../components/navbarUser';
import Footer from '../components/footer';
import schedule_icon from '../assets/schedule_icon.png';
import meeting_icon from '../assets/meeting_icon.png';
import appointment_icon from '../assets/appointment_icon.png';
import { Link } from 'react-router-dom';
import '../style/landing.css';

const Landing = () => {

  return (
    <div className='landing'>
        <NavBarUser />

        {/* Hero Section */}
        <div className='hero'>
            <div className='hero-img'></div>
            <div className='hero-txt'>
                <h1>Simplify Your Appointments Today</h1>
                <h2>Perfect for office hours, meetings, and one-on-one sessions.</h2>
                <Link to="/userRegister" className='general-btn'>Secure your slot!</Link>
            </div>
        </div>
        
        {/* Content Section */}
        <div className='content'>
            <div className='content-item' id='item1'>
                <img src={schedule_icon} alt='Schedule icon'></img>
                <h3>Easy scheduling for office hours</h3>
                <p>Professors and TAs can set up regular office hours, 
                    making it simple for students to view and book available time slots.</p>
            </div>
            
            <div className='content-item' id='item2'>
                <img src={meeting_icon} alt='Meeting icon'></img>
                <h3>One-time meeting creation</h3>
                <p>Create unique, non-recurring meetings for 
                    special appointments or  discussions, ensuring flexibility in scheduling.</p>
            </div>

            <div className='content-item' id='item3'>
                <img src={appointment_icon} alt='Appointment icon'></img>
                <h3>Centralized appointment history</h3>
                <p>Access a clear, organized list of all past and 
                    upcoming appointments in one place for quick reference and better time management.</p>
            </div>
        </div>
        
        <Footer />
    </div>
  );
};

export default Landing;
