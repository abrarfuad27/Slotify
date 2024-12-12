import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import NavbarMember from '../components/navbarMember';
import NavbarUser from "../components/navbarUser";
import Footer from '../components/footer';
import '../style/pollAccess.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { publicUrl } from "../constants";

const PollAccess = () => {
  const { user, isLoading } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [previousUserState, setPreviousUserState] = useState(null);

  const [pollUrl, setPollUrl] = useState('');
  const [pollData, setPollData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const extractPollId = (url) => {
    const match = url.match(/slotify\.com\/poll\/([A-Za-z0-9]{11})/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setErrorMessage('Invalid URL or Poll ID format. Please try again.');
      return;
    }

    console.log('Poll ID:', pollId);

    try {
      const response = await axios.get(`${publicUrl}/getPollAndSlots`, {
        params: { pollId: pollId },
      });

      if (response.status === 200) {
        setPollData(response.data);
      } else {
        setErrorMessage('Poll not found. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching poll data. Please try again.');
    }
  };

  const handleSlotSelect = (pollSlotId) => {
    setSelectedSlot(pollSlotId);
  };

  const handleVoteSubmit = async () => {
    if (!selectedSlot) {
      setErrorMessage('Please select a timeslot before submitting.');
      return;
    }

    try {
      const response = await axios.post(`${publicUrl}/voteOnSlot`, {
        pollSlotId: selectedSlot,
      });

      if (response.status === 200) {
        setSuccessMessage(
          `Your vote has been submitted successfully for poll "${pollData.pollName}"!`
        );
        setPollData(null); // Clear poll data after vote
      } else {
        setErrorMessage('Failed to submit vote. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error submitting your vote. Please try again.');
    }
  };

  return (
    <div className="poll-access-page">
      {user ? <NavbarMember /> : <NavbarUser />}
      <h1 className="poll-header">Vote on a Poll!</h1>
      <div className="poll-container">
        <h3>Enter the poll URL or ID</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g. slotify.com/poll/abcDEFgh123 or abcDEFgh123"
            value={pollUrl}
            onChange={(e) => setPollUrl(e.target.value)}
            className="poll-url-input"
          />
          <button type="submit" className="poll-submit-btn">
            Search
          </button>
        </form>
        {errorMessage && <p className="poll-access-error-message">{errorMessage}</p>}
        {pollData && !successMessage && (
          <div className="poll-details">
            <h2>{pollData.pollName}</h2>
            <p>{pollData.pollQuestion}</p>
            <p>
              <strong>Poll Owner:</strong> {pollData.creator}
            </p>
            <div className="poll-slots">
              {pollData.slots.map((slot) => (
                <div
                  key={slot.pollSlotId}
                  className={`poll-slot ${selectedSlot === slot.pollSlotId ? 'selected' : ''}`}
                  onClick={() => handleSlotSelect(slot.pollSlotId)}
                >
                  {slot.pollingSlotDate} | {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
            <button className="poll-submit-vote-btn" onClick={handleVoteSubmit}>
              Submit
            </button>
          </div>
        )}
        {successMessage && <p className="poll-success-message">{successMessage}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default PollAccess;
