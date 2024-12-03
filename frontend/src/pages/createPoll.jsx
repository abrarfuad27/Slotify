import React, { useState } from 'react';
import NavbarMember from '../components/navbarMember';
import Footer from '../components/footer';
import '../style/createPoll.css';

const CreatePoll = () => {
  const [pollOptions, setPollOptions] = useState([]);
  const [pollName, setPollName] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleAddOption = () => {
    if (pollOptions.length < 4 && date && startTime && endTime) {
      const newOption = `${date} | ${startTime} - ${endTime}`;
      setPollOptions([...pollOptions, newOption]);
      setDate('');
      setStartTime('');
      setEndTime('');
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updatedOptions);
  };

  const handleCreatePoll = () => {
    alert('Poll created successfully!');
  };

  return (
    <div className="poll-page">
      <NavbarMember />
      <div className="poll-container">
        <form>
        <h1>Create a Poll</h1>
          <label>
            Poll name:
            <input
              type="text"
              value={pollName}
              onChange={(e) => setPollName(e.target.value)}
            />
          </label>
          <label>
            Poll question:
            <textarea
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
            />
          </label>
          <div className="poll-options">
            <h3>Add options (max 4):</h3>
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Start:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>
            <label>
              End:
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>
            <button type="button" onClick={handleAddOption}>
              Add
            </button>
            <button type="reset" onClick={() => {
              setDate('');
              setStartTime('');
              setEndTime('');
            }}>
              Reset
            </button>
          </div>
          <div className="options-list">
            {pollOptions.map((option, index) => (
              <div key={index} className="option-item">
                <span>{option}</span>
                <button onClick={() => handleRemoveOption(index)}>🗑️</button>
              </div>
            ))}
          </div>
          <div className="poll-actions">
            <button type="button" onClick={handleCreatePoll}>
              Create
            </button>
            <button type="button" onClick={() => alert('Poll creation cancelled.')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePoll;
