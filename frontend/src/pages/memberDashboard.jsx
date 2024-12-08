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

const MemberDashboard = () => {
  const { user } = useAuth();
  // database information
  const [apptTimes, setApptTimes] = useState([]);
  const [apptDivs, setApptDivs] = useState([]);
  // dynamically change upcoming-meetings-container height
  const [height, setHeight] = useState(50);

  const email = user.email;
  const max_num_meetings = 5;
  const userData = {
      email,
      max_num_meetings
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
        const resp = await axios.get(`${publicUrl}/upcomingAppointments`, {
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
      
      if (apptTimes.length === 0 ) {
        const empty_card = { 
            'content':(
            <div className='card-content empty-card'>
                <p>No meetings yet!</p>
                <p>Start by creating an appointment</p>
            </div>
            ),
            'banner': ''
        };
        queryData.push(empty_card);
      } else if (apptTimes.length === 1){
        setHeight(48);
      } else if (apptTimes.length === 2){
          setHeight(55);
      } else {
          setHeight(70);
      }

      let data = '';
      let appointee = '';
      let organizer = '';
      let divElement = null;
      for (let i=0; i < apptTimes.length; i++){
        console.log(apptTimes[i]);
        data = apptTimes[i];
        organizer = data.creator===email ? 'You' : data.creator;
        appointee = data.appointee===email ? 'You' : data.appointee;
        divElement = { 
          'content':(
          <div className='card-content'>
            {/* TODO add logic to display "you" if you are the Organizer, similar for participant */}
            {/* SQL fetch information about the meetings you've organized OR for which you are an attendee */}
            <p>Time: {formatDate(data['timeslotDate'])} from {data['startTime']}-{apptTimes[i]['endTime']}</p>
            <p>Organizer: {organizer} </p>
            <p>Participant: { appointee ? appointee : 'No one yet'} </p>
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
                <div className='upcoming-meetings-container container-box' style={{height: `${height}%`}}>
                    <h2>Your upcoming meetings</h2>

                    {/* TODO: set limit to max 3 info-cards showing */}
                    <div className='info-card-container'>
                        {apptDivs.map((appt, _)=>(
                            <DashboardCard content={appt.content} banner={appt.banner}></DashboardCard>
                        ))}
                    </div>
                </div>
                <Link to="/appointmentCreation" className='create-appt-btn'>Create an Appointment</Link>
            </div>

        </div>
        {/* footer */}
        <Footer />
        
    </div>

  );
};

export default MemberDashboard;