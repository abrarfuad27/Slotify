import React, { useEffect, useState } from "react";
import NavbarMember from "../components/navbarMember";
import "../style/meetingHistory.css";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { useAuth } from '../context/AuthContext';
import { publicUrl } from '../constants';


const UpcomingAppointments = () => {
   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
   const [upcomingCreatorAppointments, setUpcomingCreatorAppointments] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const {user} = useAuth();


   const email = user.email // Replace this with dynamic user data if available
   const max_num_meetings = 1000;
   const userData = { email, max_num_meetings };


   // Fetch appointments on mount
   useEffect(() => {
       fetchAppointments();
   }, []);


   const fetchAppointments = async () => {
       try {
           // Fetch upcoming appointments
           const upcomingResponse = await axios.get(`${publicUrl}/upcomingAppointments`, {
               params: userData,
           });
           setUpcomingAppointments(upcomingResponse.data.data || []);


           const upcomingCreatorResponse = await axios.get(`${publicUrl}/upcomingCreatorAppointments`, {
               params: userData,
           });
           setUpcomingCreatorAppointments(upcomingCreatorResponse.data.data || []);


           setLoading(false);
       } catch (err) {
           console.error("Error fetching appointments:", err);
           setError("Failed to load appointments. Please try again.");
           setLoading(false);
       }
   };


   const formatDate = (dateString) => {
       return format(parseISO(dateString), "MMM do, yyyy");
   };


   if (loading) {
       return <div className="loading">Loading...</div>;
   }


   if (error) {
       return <div className="error">{error}</div>;
   }


   return (
       <div className="bg meeting-history-page">
       <NavbarMember />
       <div className="container">
           <h1 className="page-title">History</h1>


           {/* Upcoming Appointments Section */}
           <div className="appointments-section">
               <h2>Upcoming Appointments</h2>
               {upcomingAppointments.length > 0 ? (
                   <table className="appointments-table">
                       <thead>
                           <tr>
                               <th>Appointment with:</th>
                               <th>Date</th>
                               <th>Time</th>
                               <th>Mode</th>
                               <th>URL</th>
                           </tr>
                       </thead>
                       <tbody>
                           {upcomingAppointments.map((appt, index) => (
                               <tr key={index}>
                                   <td data-label="Appointment with:">{appt.creator}</td>
                                   <td data-label="Date">{formatDate(appt.timeslotDate)}</td>
                                   <td data-label="Time">
                                       {appt.startTime} - {appt.endTime}
                                   </td>
                                   <td data-label="Mode">{appt.course || "One-time"}</td>
                                   <td data-label="URL">
                                       <a
                                           href={appt.appointmentURL}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                       >
                                           {appt.appointmentURL}
                                       </a>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               ) : (
                   <p>No upcoming appointments found.</p>
               )}
           </div>


           <div className="appointments-section">
               <h2>Upcoming Created Appointments</h2>
               {upcomingCreatorAppointments.length > 0 ? (
                   <table className="appointments-table">
                       <thead>
                           <tr>
                               <th>Appointee:</th>
                               <th>Date</th>
                               <th>Time</th>
                               <th>Mode</th>
                               <th>URL</th>
                           </tr>
                       </thead>
                       <tbody>
                           {upcomingCreatorAppointments.map((appt, index) => (
                               <tr key={index}>
                                   <td data-label="Appointee:">{appt.appointee}</td>
                                   <td data-label="Date">{formatDate(appt.timeslotDate)}</td>
                                   <td data-label="Time">
                                       {appt.startTime} - {appt.endTime}
                                   </td>
                                   <td data-label="Mode">{appt.course || "One-time"}</td>
                                   <td data-label="URL">
                                       <a
                                           href={appt.appointmentURL}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                       >
                                           {appt.appointmentURL}
                                       </a>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               ) : (
                   <p>No upcoming created appointments found.</p>
               )}
           </div>
       </div>
   </div>
   );
};


export default UpcomingAppointments;