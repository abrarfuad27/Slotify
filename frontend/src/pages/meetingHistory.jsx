//Salomon Lavy Perez
import React, { useEffect, useState } from "react";
import NavbarMember from "../components/navbarMember";
import "../style/meetingHistory.css";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { useAuth } from '../context/AuthContext';
import { publicUrl } from '../constants';
import Footer from '../components/footer';

const MeetingHistory = () => {
    const [previousAppointments, setPreviousAppointments] = useState([]);
    const [previousCreatorAppointments, setPreviousCreatorAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    const email = user.email // Replace this with dynamic user data if available
    const max_num_meetings = 1000;
    const userData = { email, max_num_meetings };

    // Fetch appointments on mount
    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line
    }, []);

    const fetchAppointments = async () => {
        try {
            // Fetch upcoming appointments
            const previousResponse = await axios.get(`${publicUrl}/meetingHistory`, {
                params: userData,
            });
            setPreviousAppointments(previousResponse.data.data || []);

            // Fetch previous appointments
            const previousCreatorResponse = await axios.get(`${publicUrl}/meetingCreatorHistory`, {
                params: userData,
            });
            setPreviousCreatorAppointments(previousCreatorResponse.data.data || []);

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
        <div className="bg meeting-history">
        <NavbarMember />
        <div className="container">
            <h1 className="page-title">History</h1>

            {/* Upcoming Appointments Section */}
            <div className="appointments-section">
                <h2>Previous Appointments Created By Others</h2>
                <div class="appointments-table-div">
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
                        {previousAppointments.length > 0 ? (
                            previousAppointments.map((appt, index) => (
                                <tr key={index}>
                                    <td data-label="Appointment with:">{appt.creator}</td>
                                    <td data-label="Date">{formatDate(appt.timeslotDate)}</td>
                                    <td data-label="Time">
                                        {appt.startTime} - {appt.endTime}
                                    </td>
                                    <td data-label="Mode">{appt.mode || "One-time"}</td>
                                    <td data-label="URL">{appt.appointmentURL}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="err">No previous appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Previous Appointments Section */}
            <div className="appointments-section">
                <h2>My Previous Created Appointments</h2>
                <div class="appointments-table-div">
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
                        {previousCreatorAppointments.length > 0 ? (
                            previousCreatorAppointments.map((appt, index) => (
                                <tr key={index}>
                                    <td data-label="Appointee:">{appt.appointee}</td>
                                    <td data-label="Date">{formatDate(appt.timeslotDate)}</td>
                                    <td data-label="Time">
                                        {appt.startTime} - {appt.endTime}
                                    </td>
                                    <td data-label="Mode">{appt.mode || "One-time"}</td>
                                    <td data-label="URL">{appt.appointmentURL}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="err">No previous created appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        <Footer />
    </div>
    );
};

export default MeetingHistory;