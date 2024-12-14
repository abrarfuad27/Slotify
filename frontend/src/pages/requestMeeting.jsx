import React, { useState } from "react";
import NavbarMember from "../components/navbarMember";
import "../style/requestMeeting.css";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from "react-router-dom";
import { publicUrl } from '../constants';
import Footer from '../components/footer';

const generateRandomId = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

const RequestMeeting = () => {
    const [requests, setRequests] = useState([]);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [topic, setTopic] = useState("");
    const [course, setCourse] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const { creatorEmail } = useParams();
    const navigate = useNavigate();
    console.log(creatorEmail)
    // Add a new request
    const handleAdd = () => {
        setError(null); // Clear previous error

        if (requests.length >= 4) {
            setError("You can only add up to 4 requests.");
            return;
        }
        if (!date || !startTime || !endTime || !topic) {
            setError("Please fill in all fields before adding a request.");
            return;
        }

        const now = new Date();
        const selectedDate = new Date(date + "T" + startTime);

        if (startTime >= endTime) {
            setError("Start time must be earlier than end time.");
            return;
        }
        if (selectedDate < now) {
            setError("Start time must be in the future.");
            return;
        }

        const newRequest = { date, startTime, endTime, topic, course };
        setRequests([...requests, newRequest]);
        setDate("");
        setStartTime("");
        setEndTime("");
        setTopic("");
        setCourse("");
    };

    // Remove a request
    const handleRemove = (index) => {
        const updatedRequests = requests.filter((_, i) => i !== index);
        setRequests(updatedRequests);
    };

    // Submit the requests
    const handleSubmit = async () => {
        try {
            for (const request of requests) {
                const appointmentId = generateRandomId(11);
                const appointmentData = {
                    appointmentId,
                    mode: "one-time",
                    creatorEmail,
                    startDate: request.date,
                    endDate: request.date,
                    topic: request.topic,
                    course: request.course,
                    appointmentURL: "slotify.com/" + generateRandomId(11),
                };

                // Create Appointment
                await axios.post(`${publicUrl}/createAppointmentOnRequest`, appointmentData);

                const timeslotData = {
                    timeslotID: generateRandomId(11),
                    appointmentId,
                    startTime: request.startTime,
                    endTime: request.endTime,
                    timeslotDate: request.date,
                    appointee: user.email,
                    isRequest: 1,
                    requestStatus: "pending",
                };

                // Create TimeSlot
                await axios.post(`${publicUrl}/createTimeSlot`, timeslotData);
            }

            setRequests([]);
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting requests:", error);
            alert("There was an error processing your request. Please try again.");
        }
    };

    return (
        <div className="request-meeting-page">
            <NavbarMember />
            <div className="container containerRequest">
                <h1 className="page-title">Request Meeting</h1>
                <p className="page-subtitle">
                    Request alternative time slots (maximum 4).
                </p>

                {!success ? (
                    <>
                        {error && <p className="error-message">{error}</p>}

                        <div className="request-form">
                            <div className="form-row">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Start:</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>End:</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Topic:</label>
                                <input
                                    type="text"
                                    value={topic}
                                    placeholder="Office Hours"
                                    onChange={(e) => setTopic(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Course:</label>
                                <input
                                    type="text"
                                    name="course"
                                    value={course}
                                    pattern="^[A-Za-z0-9]+$" title="Letters and numbers only - no space" placeholder="COMP307"
                                    onChange={(e) => setCourse(e.target.value)}
                                />
                            </div>
                            <div className="button-group">
                                <button className="add-button" onClick={handleAdd}>
                                    Add
                                </button>
                                <button
                                    className="reset-button"
                                    onClick={() => {
                                        setDate("");
                                        setStartTime("");
                                        setEndTime("");
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                        <div className="requests-list">
                            {requests.map((request, index) => (
                                <div key={index} className="request-item">
                                    <span>
                                        {new Date(request.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}{" "}
                                        | {request.startTime} - {request.endTime}
                                    </span>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleRemove(index)}
                                    >
                                        🗑
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={requests.length === 0}
                        >
                            Send Request
                        </button>
                    </>
                ) : (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Request Sent Successfully!</h2>
                            <p>Your meeting requests have been sent.</p>
                            <button
                                className="close-modal"
                                onClick={() => navigate("/memberDashboard")}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RequestMeeting;