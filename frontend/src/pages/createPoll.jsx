import React, { useState, useEffect } from "react";
import NavbarMember from "../components/navbarMember";
import Footer from "../components/footer";
import "../style/createPoll.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { publicUrl } from "../constants";
import copy_icon from "../assets/copy-icon.png";

const CreatePoll = () => {
  const { user } = useAuth();
  const email = user.email;

  const [pollOptions, setPollOptions] = useState([]);
  const [pollName, setPollName] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [date, setDate] = useState("");
  const [curDate, setCurDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pollLink, setPollLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateRandomId = (length = 11) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  useEffect(() => {
    const curDate = new Date().toISOString().split("T")[0];
    setCurDate(curDate);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    .then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    })
    .catch(() => {
      console.error('Failed to copy text');
    });
  };

  const handleAddOption = () => {
    setErrorMessage("");

    if (pollOptions.length >= 4) {
      setErrorMessage("You can only add up to 4 options.");
      return;
    }

    if (!date || !startTime || !endTime) {
      setErrorMessage("Please fill in all date and time fields.");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      setErrorMessage("The start time must be in the future.");
      return;
    }

    if (endDateTime <= startDateTime) {
      setErrorMessage("End time must be later than start time.");
      return;
    }

    const day = startDateTime.getDate();
    const month = startDateTime.toLocaleString("default", { month: "short" });
    const year = startDateTime.getFullYear();
    const formattedDate = `${month} ${day}${getOrdinal(day)}, ${year}`;
    const formattedStartTime = startDateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const formattedEndTime = endDateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newOption = `Date: ${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;

    if (pollOptions.includes(newOption)) {
      setErrorMessage("This date and time range already exists in your options.");
      return;
    }

    setPollOptions([...pollOptions, newOption]);
    setDate("");
    setStartTime("");
    setEndTime("");
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
  
    if (pollOptions.length < 2) {
      errors.push("At least two timeslot options are required.");
    }
  
    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      return;
    }
  
    const pollId = generateRandomId();
    const pollUrl = `http://slotify.com/poll/${pollId}`;
    const creator = email;
  
    const slots = pollOptions.map((option) => {
      const [datePart, timePart] = option.split(" | ");
      const [start, end] = timePart.split(" - ");
  
      const startTime = start.trim();
      const endTime = end.trim();

      function convertToMilitaryTime(timeString) {
        // Regex to match time in "HH:MM AM/PM" format
        const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
      
        // Perform regex match
        const match = timeRegex.exec(timeString);
        if (!match) {
          throw new Error("Invalid time format. Expected 'HH:MM AM/PM'.");
        }
      
        // Extract parts
        let [, hours, minutes, period] = match;
      
        // Convert hour to 24-hour format if it's PM
        hours = parseInt(hours, 10);
        if (period.toUpperCase() === 'PM' && hours !== 12) {
          hours += 12; // add 12 hours to PM times except for 12 PM itself
        } else if (period.toUpperCase() === 'AM' && hours === 12) {
          hours = 0; // 12 AM is midnight in 24-hour time
        }
      
        // Format the military time string
        const militaryTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        return militaryTime;
      }

      const formattedStartTime = convertToMilitaryTime(startTime);
      const formattedEndTime = convertToMilitaryTime(endTime);
  
      // Parse the date part correctly
      const dateRegex = /\b(\w{3} \d{1,2}(?:st|nd|rd|th)?, \d{4})\b/;
      const dateMatch = datePart.match(dateRegex);
      let dateStr = dateMatch ? dateMatch[1] : "";
  
      // Convert date string to a standard format
      dateStr = dateStr.replace(/(\d{1,2})(st|nd|rd|th),/, "$1,");
      const pollingSlotDate = new Date(dateStr).toISOString().split("T")[0];
  
      return {
        pollSlotId: generateRandomId(),
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        pollingSlotDate,
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
      const response = await axios.post(`${publicUrl}/createPollAndSlots`, requestData, { withCredentials: true });
      if (response.status === 201) {
        setPollLink(pollUrl);
        setShowPopup(true);
      } else {
        setErrorMessage("Error creating poll. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error creating poll. Please try again.");
    }
  };

  const resetForm = () => {
    setPollName("");
    setPollQuestion("");
    setPollOptions([]);
    setDate("");
    setStartTime("");
    setEndTime("");
    setErrorMessage("");
    setShowPopup(false);
  };

  return (
    <div className="poll-page">
      <NavbarMember />
      <h1 className="poll-header">Create a Poll</h1>
      <div className="poll-container">
        <form>
          {errorMessage && <p className="poll-error-message">{errorMessage}</p>}
          <label>
            Poll name: <span style={{ color: "red" }}>*</span>
            <input
              className="poll-name-input"
              type="text"
              value={pollName}
              onChange={(e) => setPollName(e.target.value)}
              required
            />
          </label>
          <label>
            Poll question: <span style={{ color: "red" }}>*</span>
            <textarea value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
          </label>
          <div className="poll-options">
            <h3>Add options (maximum 4):</h3>
            <div className="poll-options-row-std">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={curDate}
                required
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <button type="button" onClick={handleAddOption} disabled={pollOptions.length >= 4}>
              Add
            </button>
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
          <button type="button" onClick={handleSubmit}>
            Create Poll
          </button>
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
                {pollLink}&nbsp; &nbsp; 
              </a>
              <button
                className="copy-icon-btn"
                onClick={() => copyToClipboard(pollLink)}
              >
                <img src={copy_icon} className="copy-icon-img" alt="Copy Icon" />
              </button>
            </div>
            {copied && <label className="copy-confirmation">Link Copied!</label>}
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
