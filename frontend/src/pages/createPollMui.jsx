/* Name: Samuel Lin */

import React, { useState } from 'react';
import NavbarMember from '../components/navbarMember';
import Footer from '../components/footer';
import '../style/createPoll.css';
import dayjs from 'dayjs';
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { publicUrl } from "../constants";

const CreatePoll = () => {

  const { user } = useAuth();
  const email = user.email;

  const [pollOptions, setPollOptions] = useState([]);
  const [pollName, setPollName] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'));
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [pollLink, setPollLink] = useState('');

  const generateRandomId = (length = 11) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const handleAddOption = () => {

    setErrorMessage('');

    if (pollOptions.length >= 4) {
      showError('You can only add up to 4 options.');
      return;
    }

    if (!date || !startTime || !endTime) {
      showError('Please fill in all date and time fields.');
      return;
    }

    if (endTime.isBefore(startTime)) {
      showError('End time cannot be earlier than start time.');
      return;
    }

    const now = dayjs();
    const selectedDateTime = date.hour(startTime.hour()).minute(startTime.minute());
    if (selectedDateTime.diff(now, 'minute') < 2) {
      showError('The selected date and time must be at least 1 minute from the current time.');
      return;
    }

    const day = date.date();
    const month = date.format('MMM');
    const year = date.format('YYYY');
    const formattedDate = `${month} ${day}${getOrdinal(day)}, ${year}`;
  
    // Format start and end times in 12-hour format with AM/PM
    const formattedStartTime = startTime.format('h:mm A');
    const formattedEndTime = endTime.format('h:mm A');
  
    // Check if the new option conflicts with an existing option
    const newOption = `Date: ${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
    const isDuplicate = pollOptions.some(option => {
      const [existingDate, existingTimes] = option.split(' | ');
      const [existingStartTime, existingEndTime] = existingTimes.split(' - ');
  
      return (
        existingDate === `Date: ${formattedDate}` &&
        existingStartTime === formattedStartTime &&
        existingEndTime === formattedEndTime
      );
    });
  
    if (isDuplicate) {
      showError('This date and time range already exists in your options.');
      return;
    }

    setPollOptions([...pollOptions, newOption]);
    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  const showError = (message) => {
    setErrorMessage(message);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    const errors = [];

    if (!pollName.trim()) {
      errors.push("Poll name is required.");
    }

    if (!pollQuestion.trim()) {
      errors.push("Poll question is required.");
    }

    if (pollOptions.length === 0 || pollOptions.length === 1) {
      errors.push("At least two timeslot options are required.");
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
      return;
    }
  
    const pollId = generateRandomId();
    const pollUrl = `slotify.com/poll/${pollId}`;
    const creator = email;
  
    const slots = pollOptions.map((option) => {
      const [datePart, timePart] = option.split(' | ');
      const [start, end] = timePart.split(' - ');

      // Extract and clean the date from the datePart to revert back to YYYY-MM-DD format
      const dateRegex = /(\w{3}) (\d+)(?:st|nd|rd|th), (\d{4})/;
      const match = datePart.match(dateRegex);

      let pollingSlotDate = '';
      if (match) {
        const [, month, day, year] = match;
        pollingSlotDate = dayjs(`${month} ${day}, ${year}`, 'MMM D, YYYY').format('YYYY-MM-DD');
      } else {
        console.error("Invalid date format:", datePart);
      }
      const formattedStartTime = dayjs(start, 'h:mm A').format('HH:mm');
      const formattedEndTime = dayjs(end, 'h:mm A').format('HH:mm');
  
      return {
        pollSlotId: generateRandomId(),
        startTime: formattedStartTime.trim(),
        endTime: formattedEndTime.trim(),
        pollingSlotDate: pollingSlotDate.trim(),
      };
    });
  
    const requestData = {
      pollData: {
        pollId,
        pollName,
        pollQuestion,
        creator,
        isActive: true,
        pollUrl,
      },
      slots,
    };
  
    try {
      const response = await axios.post(
        `${publicUrl}/createPollAndSlots`,
        requestData,
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        setPollLink(pollUrl);
        setShowPopup(true);
      } else {
        showError('Error creating poll. Please try again.');
      }
    } catch (error) {
      console.error(error);
      showError('Error creating poll. Please try again.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setPollName('');
    setPollQuestion('');
    setPollOptions([]);
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setErrorMessage('');
    setShowPopup(false);
  }

  return (
    <div className="poll-page">
      <NavbarMember />
      <h1 className="poll-header">Create a Poll</h1>
      <div className="poll-container">
        <form>
        {errorMessage && <p className="poll-error-message">{errorMessage}</p>}
          <label>
            Poll name: <span style={{ color: 'red' }}>*</span>
            <input
              className="poll-name-input"
              type="text"
              value={pollName}
              onChange={(e) => setPollName(e.target.value)}
              required
            />
          </label>
          <label>
            Poll question: <span style={{ color: 'red' }}>*</span>
            <textarea
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
            />
          </label>
          <div className="poll-options">
            <h3>Add options (maximum 4):</h3>
            <div className="poll-options-row">
              <label>
                Date:
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker value={date} onChange={setDate} disablePast/>
                </LocalizationProvider>
              </label>
              <label>
                Start Time:
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker value={startTime} onChange={setStartTime} />
                </LocalizationProvider>
              </label>
              <label>
                End Time:
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker value={endTime} onChange={setEndTime} />
                </LocalizationProvider>
              </label>
            </div>
            <div className="poll-options-actions">
            <button 
              type="button" 
              onClick={handleAddOption} 
              disabled={pollOptions.length >= 4} 
              style={{ backgroundColor: pollOptions.length >= 4 ? '#cccccc' : '#085a77', cursor: pollOptions.length >= 4 ? 'not-allowed' : 'pointer' }}
            >
              Add
            </button>
            </div>
          </div>
          <div className="options-list">
            {pollOptions.map((option, index) => (
              <div key={index} className="option-item">
                <span>{option}</span>
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <div className="poll-create">
            <button type="button" onClick={handleSubmit}>
              Create Poll
            </button>
          </div>
        </form>
      </div>
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Poll Created Successfully!</div>
            <div className="modal-message">
              Your poll has been created. Click the link below to view your poll:
            </div>
            <div className="modal-link-container">
              <a
                href={pollLink}
                className="modal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {pollLink}
              </a>
              <button
                className="copy-icon-btn"
                onClick={() => copyToClipboard(pollLink)}
              >
                📋
              </button>
            </div>
            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() =>
                  (window.location.href = `/memberDashboard`)
                }
              >
                Return To Dashboard
              </button>
              <button className="close-btn" onClick={() => resetForm()}>
                Create Another Poll
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CreatePoll;
