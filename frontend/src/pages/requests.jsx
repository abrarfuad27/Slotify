//Salomon Lavy Perez
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarMember from "../components/navbarMember";
import "../style/requests.css";
import { useAuth } from "../context/AuthContext";
import { publicUrl } from "../constants";
import Footer from "../components/footer";
import Modal from "react-modal";

const Requests = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [groupedRequests, setGroupedRequests] = useState([]);
    const [selectedAppointee, setSelectedAppointee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null); // New state for confirmation modal
    const { user } = useAuth();
    const email = user.email;

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${publicUrl}/requests`, {
                params: { email },
            });
            const requests = response.data.data || [];
            const grouped = groupByAppointee(requests);
            setGroupedRequests(grouped);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to load requests.");
            setLoading(false);
        }
    };

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

    const handleAction = async (timeSlotId, action) => {
        try {
            if (action === "accept") {
                await axios.put(`${publicUrl}/handleRequests`, { timeSlotId });

                // Find the accepted request details
                const acceptedRequest = groupedRequests
                    .flatMap((group) => group.requests)
                    .find((req) => req.timeslotID === timeSlotId);

                if (acceptedRequest) {
                    setConfirmationModal({
                        name: `${acceptedRequest.appointee}`,
                        date: new Date(acceptedRequest.timeslotDate).toLocaleDateString(),
                        time: `${acceptedRequest.startTime} - ${acceptedRequest.endTime}`,
                    });
                }
            } else if (action === "deny") {
                await axios.delete(`${publicUrl}/handleRequests`, {
                    data: { timeSlotId },
                });
            }
            fetchRequests();
            setSelectedAppointee(null);
        } catch (err) {
            console.error(`Failed to ${action} request:`, err);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <NavbarMember />
                <p>Loading requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <NavbarMember />
                <p>{error}</p>
            </div>
        );
    }

    const openModal = (message, success) => {
        setModalMessage(message);
        setIsSuccess(success);
        setModalIsOpen(true);
      };
    
      const closeModal = () => {
        setModalIsOpen(false);
      };
    return (
        <div className="requests-page">
            <NavbarMember />
            <h1 className="page-title">Review Requested Time Slots</h1>
            <div className="table-container">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedRequests.length === 0 ? (
                            <tr className="no-requests-row">
                                <td className="err" colSpan="3">No pending requests.</td>
                            </tr>
                        ) : (
                            groupedRequests.map((appointee, index) => (
                                <tr key={index}>
                                    <td>{`${appointee.firstName} ${appointee.lastName}`}</td>
                                    <td>{appointee.appointee}</td>
                                    <td>
                                        <button
                                            className="view-details-button"
                                            onClick={() => {setSelectedAppointee(appointee);
                                                openModal('');
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedAppointee && (
                <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Appointment Creation Status"
                className="modal"
                overlayClassName="modal-overlay"
                > 
                    <div className="details-modal">
                    <div className="modal-content" style={{maxHeight:'620px', overflow:'auto'}}>
                        <h2>{selectedAppointee.firstName}'s Proposed Time Slots</h2>
                        <ul className="timeslots-list">
                            {selectedAppointee.requests.map((req, index) => (
                                <li key={index} className="timeslot-item">
                                    <div>
                                        <p><strong>Date:</strong>{" "}
                                            {new Date(req.timeslotDate + 'T00:00:00').toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
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
                                            style={{backgroundColor:'#CF1C13'}}
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
                </Modal>
                
            )}

            {confirmationModal && (
                <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Appointment Creation Status"
                className="modal"
                overlayClassName="modal-overlay"
                > 
                
                <div>
                    <div>
                        <h2>Appointment Booked!</h2>
                        <p>
                            Appointment successfully booked with {confirmationModal.name}!
                        </p>
                        <button
                            className="close-modal-button"
                            onClick={() => setConfirmationModal(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
                </Modal>
            )}
            

            <Footer />
        </div>
    );
};

export default Requests;
