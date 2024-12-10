import React from 'react';
import '../style/dashboardCard.css';

// Styled Information Card 
const DashboardCard = ({content, banner}) => {
  return (
    <div className='dashboard-card'>
        <div className='card-banner'>{banner}</div>
        <div className='card-content'>
            {content}
        </div>
    </div>
  );
};

export default DashboardCard;
