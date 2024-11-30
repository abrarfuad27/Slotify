import React from 'react';
import '../style/dashboardCard.css';

const DashboardCard = ({content}) => {
  return (
   
    <div className='dashboard-card'>
        <div className='card-banner'></div>
        <div className='appointment-content'>
            {content}
        </div>
    </div>

  );
};

export default DashboardCard;
