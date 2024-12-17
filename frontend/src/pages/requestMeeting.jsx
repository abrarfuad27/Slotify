//Salomon Lavy Perez
import React, { useEffect, useState } from "react";
import NavbarMember from "../components/navbarMember";
import "../style/requestMeeting.css";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
    const [curDate, setCurDate] = useState('');
    const { user } = useAuth();
    const { email } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Extract 'name' from query params
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");

    useEffect(() => {
        const curDate = new Date().toLocaleDateString('en-CA');
        setCurDate(curDate);
      }, []);
    // Add a new request
    const handleAdd = () => {
        setError(null); // Clear previous error

        if (requests.length >= 4) {
            setError("You can only add up to 4 requests.");
            return;
        }
        if (!date || !startTime || !endTime) {
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

        const newRequest = { date, startTime, endTime };
        for (let i = 0; i < requests.length; i++) {
            let req = requests[i];
            if (req.date === newRequest.date &&
                req.startTime === newRequest.startTime &&
                req.endTime === newRequest.endTime
            ) {
                setError("This date and time range already exists in your options.");
                return;
            } 
        }
        
        setRequests([...requests, newRequest]);
        setDate("");
        setStartTime("");
        setEndTime("");
    };

    // Remove a request
    const handleRemove = (index) => {
        const updatedRequests = requests.filter((_, i) => i !== index);
        setRequests(updatedRequests);
    };

    // Submit the requests
    const handleSubmit = async () => {
        try {
            if (!topic ) {
                setError("Please fill in topic field before adding a request.");
                return; 
            }
            if (course && !/^[A-Za-z0-9]+$/.test(course)) {
                setError("Course must contain only letters and numbers, with no spaces.");
                return;
            }
            for (const request of requests) {
                const appointmentId = "appt" + generateRandomId(11);
                const appointmentData = {
                    appointmentId: appointmentId,
                    mode: "one-time",
                    creator: email,
                    startDate: request.date,
                    endDate: request.date,
                    topic: topic,
                    course: course,
                    appointmentURL: "slotify.com/appt/"+generateRandomId(11),
                };

                // Create Appointment
                await axios.post(`${publicUrl}/createAppointmentOnRequest`, appointmentData);

                const timeslotData = {
                    timeslotID: "time"+generateRandomId(11),
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
        <div>
        <div className="request-meeting-page">
            <NavbarMember />
            <h1 className="page-title">Request Meeting</h1>
            <div className="container containerRequest">
                <p className="page-subtitle">
                    Request alternative time slots for {name || "User"}.
                </p>

                {!success ? (
                    <>
                        {error && <p className="error-message">{error}</p>}

                        <div className="request-form">
                            <div className="form-row">
                                <label>Topic: <span style={{ color: 'red' }}>*</span></label>
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
                                    pattern="^[A-Za-z0-9]+$"
                                    title="Letters and numbers only - no space"
                                    placeholder="COMP307"
                                    onChange={(e) => setCourse(e.target.value)}
                                />
                            </div>
                            <h3 style={{paddingRight:'27%'}}>Add options (maximum 4): </h3>
                            <div className="form-row">
                                <label>Date: <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={curDate}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>Start: <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>End: <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="button-group">
                                <button className="add-button" 
                                onClick={handleAdd} 
                                disabled={requests.length >= 4}
                                style={{ backgroundColor: requests.length >= 4 ? '#cccccc' : '#085a77', cursor: requests.length >= 4 ? 'not-allowed' : 'pointer' }}>
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
                                        {new Intl.DateTimeFormat("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }).format(new Date(request.date + "T00:00"))}{" "}
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
        </div>
        <Footer />
        </div>
    );
};

export default RequestMeeting;
