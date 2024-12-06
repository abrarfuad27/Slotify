import React, { useState } from 'react';
import NavbarMember from '../components/navbarMember';
import Footer from '../components/footer';
import '../style/memberPollVote.css';
import axios from 'axios';

const PollAccess = () => {
  const [pollUrl, setPollUrl] = useState('');
  const [pollData, setPollData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pollUrl.trim()) {
      setErrorMessage('Please enter a poll URL.');
      return;
    }

    try {
        const response = await axios.get('http://localhost:4000/pollAndSlots', {
          params: { url: pollUrl },
        });
      
        if (response.status === 200) {
          setPollData(response.data);
        } else {
          setErrorMessage('Invalid poll URL. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching poll data. Please try again.');
      }      
  };

  return (
    <div className="poll-access-page">
      <NavbarMember />
      <h1 className="poll-header">Vote on a Poll!</h1>
      <div className="poll-container">
        <h3>Enter the poll URL or ID</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="e.g. slotify.com/1234567890A or 1234567890A"
            value={pollUrl}
            onChange={(e) => setPollUrl(e.target.value)}
            className="poll-url-input"
          />
          <button type="submit" className="poll-submit-btn">
            Search
          </button>
        </form>
        {errorMessage && <p className="poll-access-error-message">{errorMessage}</p>}
        {pollData && (
          <div className="poll-details">
            <h2>{pollData.pollName}</h2>
            <p>{pollData.pollQuestion}</p>
            <p><strong>Poll Owner:</strong> {pollData.creator}</p>
            <div className="poll-slots">
              {pollData.slots.map((slot, index) => (
                <div key={index} className="poll-slot">
                  {slot.pollingSlotDate} | {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
            <button className="poll-submit-vote-btn">Submit</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PollAccess;
