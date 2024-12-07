import React, { useEffect, useState } from "react";
import NavbarMember from "../components/navbarMember";
import "../style/meetingHistory.css";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { useAuth } from '../context/AuthContext';

const MeetingHistory = () => {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [previousAppointments, setPreviousAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    const email = user.email // Replace this with dynamic user data if available
    const userData = { email };

    // Fetch appointments on mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // Fetch upcoming appointments
            const upcomingResponse = await axios.get("http://localhost:4000/upcomingAppointments", {
                params: userData,
            });
            setUpcomingAppointments(upcomingResponse.data.data || []);

            // Fetch previous appointments
            const previousResponse = await axios.get("http://localhost:4000/meetingHistory", {
                params: userData,
            });
            setPreviousAppointments(previousResponse.data.data || []);

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
                                        <td>{appt.creator}</td>
                                        <td>{formatDate(appt.timeslotDate)}</td>
                                        <td>
                                            {appt.startTime} - {appt.endTime}
                                        </td>
                                        <td>{appt.course || "One-time"}</td>
                                        <td>
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

                {/* Previous Appointments Section */}
                <div className="appointments-section">
                    <h2>Previous Appointments</h2>
                    {previousAppointments.length > 0 ? (
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
                                {previousAppointments.map((appt, index) => (
                                    <tr key={index}>
                                        <td>{appt.creator}</td>
                                        <td>{formatDate(appt.timeslotDate)}</td>
                                        <td>
                                            {appt.startTime} - {appt.endTime}
                                        </td>
                                        <td>{appt.course || "One-time"}</td>
                                        <td>
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
                        <p>No previous appointments found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingHistory;