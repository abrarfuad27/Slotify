import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarMember from "../components/navbarMember";
import "../style/requests.css";
import { useAuth } from "../context/AuthContext";
import { publicUrl } from '../constants';
import Footer from '../components/footer';

const Requests = () => {
    const [groupedRequests, setGroupedRequests] = useState([]); // Store grouped requests by appointee
    const [selectedAppointee, setSelectedAppointee] = useState(null); // Store selected appointee details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const email = user.email;
    const userData = { email };

    // Fetch and group requests
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${publicUrl}/requests`, {
                params: userData,
            });
            const requests = response.data.data || [];
            const grouped = groupByAppointee(requests); // Group requests by appointee
            setGroupedRequests(grouped);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to load requests.");
            setLoading(false);
        }
    };

    // Group requests by appointee email
    const groupByAppointee = (requests) => {
        const grouped = {};
        requests.forEach((request) => {
            if (!grouped[request.appointee]) {
                grouped[request.appointee] = {
                    firstName: request.firstName,
                    lastName: request.lastName,
                    appointee: request.appointee,
                    requests: [],
                };
            }
            grouped[request.appointee].requests.push(request);
        });
        return Object.values(grouped);
    };

    // Handle accept or deny
    const handleAction = async (timeSlotId, action) => {
        console.log(timeSlotId);
        try {
            if (action === "accept") {
                await axios.put(`${publicUrl}/handleRequests`, {
                    timeSlotId,
                });
            } else if (action === "deny") {
                await axios.delete(`${publicUrl}/handleRequests`, {
                    data: { timeSlotId },
                });
            }
            fetchRequests(); // Refresh the requests list
            setSelectedAppointee(null); // Close modal
        } catch (err) {
            console.error(`Failed to ${action} request:`, err);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="loading">
                <NavbarMember />
                <p>Loading requests...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="error">
                <NavbarMember />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="requests-page">
            <NavbarMember />
            <div className="container containerRequest">
                <h1 className="page-title">Review Requested Time Slots</h1>

                {/* Show message if no requests */}
                {groupedRequests.length === 0 ? (
                    <h4>No pending requests.</h4>
                ) : (
                    <>
                        {/* Table of Requests */}
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedRequests.map((appointee, index) => (
                                    <tr key={index}>
                                        <td>{appointee.firstName} {appointee.lastName}</td>
                                        <td>{appointee.appointee}</td>
                                        <td>
                                            <button
                                                className="view-details-button"
                                                onClick={() => setSelectedAppointee(appointee)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Modal for Selected Appointee */}
                {selectedAppointee && (
                    <div className="details-modal">
                        <div className="modal-content">
                            <h2>
                                {selectedAppointee.firstName}'s Proposed Time Slots
                            </h2>
                            <ul className="timeslots-list">
                                {selectedAppointee.requests.map((req, index) => (
                                    <li key={index} className="timeslot-item">
                                        <div>
                                            <p><strong>Date:</strong> {new Date(req.timeslotDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}</p>
                                            <p><strong>Time:</strong> {req.startTime} - {req.endTime}</p>
                                            <p><strong>Topic:</strong> {req.topic}</p>
                                            {req.course && <p><strong>Course:</strong> {req.course}</p>}
                                        </div>
                                        <div className="action-buttons">
                                            <button
                                                className="accept-button"
                                                onClick={() => handleAction(req.timeslotID, "accept")}
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="deny-button"
                                                onClick={() => handleAction(req.timeslotID, "deny")}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="close-details-button"
                                onClick={() => setSelectedAppointee(null)}
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

export default Requests;
