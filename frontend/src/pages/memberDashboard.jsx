import React from 'react';

const MemberDashboard = () => {
  return (
   
    <div>
         {/* header */}
        <h1>Welcome!</h1>
        <div className='outer-div'>
            <div>
                <h2>Your upcoming meetings</h2>

                {/* TODO: set limit to max 2 info-cards showing */}
                {/* TODO: set the info cards as components? */}
                <div className='info-card'>
                    {/* TODO: replace info with dynamic data */}
                    <div className='card-banner'></div>
                    <p>Time : January 1, 2025 at 1:00 PM - 1:15 PM</p>
                    <p>Member : Prof. Joseph Vybihal</p>
                    <p>Course : COMP307</p>
                </div>

                <div className='info-card'>
                    <div className='card-banner'></div>

                </div>
            </div>
        </div>
        {/* footer */}
    </div>

  );
};

export default MemberDashboard;
