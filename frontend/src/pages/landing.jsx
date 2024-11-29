import React from 'react';
import backgroundImage from '../assets/bg_img.png';
// Define the MyPage component
const Landing = () => {
  return (
    <div>
    {/* put nav bar component */}
        {/* hero section */}
        <div className='hero'> 
            {/* in css set the div to use background image */}
            {/* <img src={backgroundImage}></img> */}
            <h1>Simplify Your Appointments Today</h1>
            <h2>Perfect for office hours, meetings, and one-on-one sessions.</h2>
            <button></button>
        </div>

        {/* content section */}
        <div className='content'>
            <div className='content-item'>
                <h3>Easy scheduling for office hours</h3>
                <p>Professors and TAs can set up regular office hours, 
                    making it simple for students to view and book available time slots.</p>
            </div>
            
            <div className='content-item'>
                <h3>One-time meeting creation</h3>
                <p>Create unique, non-recurring meetings for 
                    special appointments or  discussions, ensuring flexibility in scheduling.</p>
            </div>

            <div className='content-item'>
                <h3>Centralized appointment history</h3>
                <p>Access a clear, organized list of all past and 
                    upcoming appointments in one place for quick reference and better time management.</p>
            </div>
        </div>

        {/* put footer  */}
    </div>
  );
};

export default Landing;
