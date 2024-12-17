// Name: Samuel Lin

import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import NavbarMember from '../components/navbarMember';
import NavbarUser from "../components/navbarUser";
import Footer from '../components/footer';
import '../style/pollAccess.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { publicUrl } from "../constants";
import SearchIcon from '@mui/icons-material/Search';

const PollAccess = () => {
  const { user, isLoading } = useAuth();
  // eslint-disable-next-line
  const [userEmail, setUserEmail] = useState("");
  const [previousUserState, setPreviousUserState] = useState(null);

  const [pollUrl, setPollUrl] = useState('');
  const [pollData, setPollData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserEmail(user.email); // Automatically populate email when user logs in
    } else {
      setUserEmail("");
    }
  }, [user]);

  useEffect(() => {
    // If the user logs out (previously logged in but now null), redirect to login
    if (!isLoading && previousUserState && !user) {
      navigate("/userLogin", { replace: true });
    }

    // Update the previous user state
    setPreviousUserState(user);
  }, [user, isLoading, navigate, previousUserState]);

  const openSuccessModal = () => setShowSuccessModal(true);
  const closeSuccessModal = () => {
    setPollUrl('');
    setPollData(null);
    setSelectedSlot(null);
    setSuccessMessage('');
    setErrorMessage('');
    setShowSuccessModal(false);
  };

  const openErrorModal = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setErrorMessage('');
    setShowErrorModal(false);
  };

  const extractPollId = (url) => {
    const match = url.match(/slotify\.com\/poll\/([A-Za-z0-9]{11})/);
    return match ? match[1] : null;
  };

  const handleUrlSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setPollData(null);
    setSelectedSlot(null);
    setSuccessMessage('');

    if (!pollUrl.trim()) {
      setErrorMessage('Please enter a poll URL or ID.');
      return;
    }

    const pollId = pollUrl.includes('slotify.com/poll')
      ? extractPollId(pollUrl)
      : /^[A-Za-z0-9]{11}$/.test(pollUrl)
      ? pollUrl
      : null;

    if (!pollId) {
      setErrorMessage('Invalid poll URL or ID. Please try again.');
      return;
    }

    try {
      const response = await axios.get(`${publicUrl}/getPollAndSlots`, {
        params: { pollId: pollId },
      });

      if (response.status === 200) {
        const fetchedPollData = response.data;
        if (!fetchedPollData.isActive) {
          setErrorMessage('This poll is closed and no longer accepting votes.');
          return;
        }
        setPollData(fetchedPollData);
      } else {
        openErrorModal('Poll not found. Please try again.');
      }
    } catch (error) {
      openErrorModal('Error fetching poll data. Please try again.');
    }
  };

  const handleSlotSelect = (pollSlotId) => {
    setSelectedSlot(pollSlotId);
  };

  const handleVoteSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
  
    if (!selectedSlot) {
      setErrorMessage('Please select a timeslot before submitting.');
      return;
    }
  
    if (pollData && !pollData.isActive) {
      if (!showErrorModal) {
        setErrorMessage('This poll is closed and no longer accepting votes.');
      }
      return;
    }
  
    try {
      const response = await axios.post(`${publicUrl}/voteOnSlot`, {
        pollSlotId: selectedSlot,
      });
  
      if (response.status === 200) {
        setSuccessMessage(
          `Your vote has been submitted successfully for poll ${pollData.pollName}!`
        );
        openSuccessModal();
      } else {
        openErrorModal('Failed to submit vote. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        openErrorModal(error.response.data.message || 'Error submitting your vote. Please try again.');
      } else {
        openErrorModal('Error submitting your vote.');
      }
    }
  };  

  return (
    <div className="poll-access-page">
      {user ? <NavbarMember /> : <NavbarUser />}
      <h1 className="poll-header">Vote on a Poll!</h1>
      <div className="poll-access-container">
        <p className="poll-access-subtitle">Enter the poll URL or ID</p>
        <div className="poll-url-input-container">
          <div className="input-with-icon">
            <SearchIcon 
              className="search-icon" 
              onClick={handleUrlSubmit} 
              style={{ cursor: "pointer" }} 
            />
            <input
              type="text"
              placeholder="e.g. slotify.com/poll/abcdef12345"
              value={pollUrl}
              onChange={(e) => setPollUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pollUrl.trim() !== '') {
                  handleUrlSubmit();
                }
              }}
              className="poll-url-input"
            />
          </div>
        </div>
      </div>
      {!showErrorModal && errorMessage && (
        <p className="poll-access-error-message">{errorMessage}</p>
      )}
      {pollData && (
        <div className="poll-details">
          <div className="poll-details-more">
            <h1>{pollData.pollName}</h1>
            <h3>Poll Question: <strong>{pollData.pollQuestion}</strong></h3>
            <p>
              <strong>Poll Owner:</strong> {pollData.creator}
            </p>
            <div className="poll-slots">
              {pollData.slots.map((slot) => {
                const date = new Date(slot.pollingSlotDate);
            
                const day = date.getDate();
                const month = date.toLocaleString("en-US", { month: "short" });
                const year = date.getFullYear();
                const suffix = ["th", "st", "nd", "rd"][
                  (day % 10 > 3 || Math.floor((day % 100) / 10) === 1) ? 0 : day % 10
                ];
                const formattedDate = `${month} ${day}${suffix}, ${year}`;
            
                // Parse the start and end times
                const startTime = new Date(`${slot.pollingSlotDate}T${slot.startTime}`);
                const endTime = new Date(`${slot.pollingSlotDate}T${slot.endTime}`);
            
                const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
            
                const formattedStartTime = new Intl.DateTimeFormat("en-US", timeOptions).format(startTime);
                const formattedEndTime = new Intl.DateTimeFormat("en-US", timeOptions).format(endTime);
            
                return (
                  <div
                    key={slot.pollSlotId}
                    className={`poll-slot ${selectedSlot === slot.pollSlotId ? "selected" : ""}`}
                    onClick={() => handleSlotSelect(slot.pollSlotId)}
                  >
                    {formattedDate} | {formattedStartTime} - {formattedEndTime}
                  </div>
                );
              })}
              <button className="poll-submit-vote-btn" onClick={handleVoteSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="poll-modal-title">Vote Casted!</div>
            <div className="poll-success-message">
              {successMessage}
            </div>
            <div className="poll-modal-link-container">
              <div className="poll-modal-buttons">
                <button
                  className="close-btn"
                  onClick={() =>
                    (window.location.href = `${user ? '/memberDashboard' : '/'}`)
                  }
                >
                  Return To Home
                </button>
                <button className="close-btn" onClick={() => closeSuccessModal()}>
                  Vote on Another Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="poll-modal-title">Error fetching or submitting poll data</div>
            <div className="poll-success-message">
              {errorMessage}
            </div>
            <button onClick={closeErrorModal}>Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PollAccess;
