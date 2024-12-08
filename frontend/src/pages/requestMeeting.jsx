import React, { useState } from "react";
import NavbarMember from "../components/navbarMember";
import "../style/requestMeeting.css"; // Import your styles
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { publicUrl } from '../constants';

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
    const {user} = useAuth();

    // Add a new request
    const handleAdd = () => {
        if (requests.length >= 4) {
            alert("You can only add up to 4 requests.");
            return;
        }
        if (!date || !startTime || !endTime || !topic) {
            alert("Please fill in all fields before adding a request.");
            return;
        }
        const now = new Date();
        const selectedDate = new Date(date + "T" + startTime);

        if (startTime >= endTime) {
            alert("Start time must be earlier than end time.");
            return;
        }
        if (selectedDate < now) {
            alert("Start time must be in the future.");
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
        const creator = "joseph@mcgill.ca"; // Replace with the actual creator email

        try {
            for (const request of requests) {
                const appointmentId = generateRandomId(11);
                const appointmentData = {
                    appointmentId,
                    mode: "one-time",
                    creator,
                    startDate: request.date,
                    endDate: request.date,
                    topic: request.topic,
                    course: request.course,
                    appointmentURL: "http://slotify.com/" + generateRandomId(11),
                };

                // Create Appointment
                await axios.post(`${publicUrl}/createAppointmentOnRequest`, appointmentData);

                const timeslotData = {
                    timeslotID: generateRandomId(11),
                    appointmentId, // Use the generated appointmentId
                    startTime: request.startTime,
                    endTime: request.endTime,
                    timeslotDate: request.date,
                    appointee: user.email, // Replace with actual appointee email
                    isRequest: 1,
                    requestStatus: "pending",
                };

                // Create TimeSlot
                await axios.post(`${publicUrl}/createTimeSlot`, timeslotData);
            }

            setRequests([]); // Clear the requests
            setSuccess(true); // Show success message
        } catch (error) {
            console.error("Error submitting requests:", error);
            alert("There was an error processing your request. Please try again.");
        }
    };

    return (
        <div className="request-meeting-page">
            <NavbarMember />
            <div className="container">
                <h1 className="page-title">Request Meeting</h1>
                <p className="page-subtitle">
                    Request alternative time slots from Prof. Joseph Vybhial's appointment (maximum 4).
                </p>

                {/* Form Section */}
                {!success ? (
                    <>
                        <div className="request-form">
                            <label>
                                Date:
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Start:
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                End:
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Topic:
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Course:
                                <input
                                    type="text"
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                />
                            </label>
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

                        {/* Added Requests */}
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

                        {/* Submit Button */}
                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={requests.length === 0}
                        >
                            Send Request
                        </button>
                    </>
                ) : (
                    <div className="success-message">
                        <h2>Thank you for responding! Your answer has been recorded.</h2>
                        <button
                            className="back-button"
                            onClick={() => {
                                setSuccess(false);
                            }}
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestMeeting;
