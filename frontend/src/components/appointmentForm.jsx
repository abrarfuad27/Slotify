import React, { useState, useEffect } from 'react';
import '../style/appointmentForm.css';

const AppointmentCreationForm = ({ onSubmit }) => {

  const initialFormData = {
    meeting_mode: 'one-time',
    course: '',
    topic: '',
    day: -1,
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleCancel = () => {
    console.log('Resetting form data')
    setFormData(initialFormData);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()){
      return;
    }
    console.log('Form data:', formData);

    onSubmit(formData);
  };

  const validateDates = () => {
    const { start_date, end_date, start_time, end_time } = formData;
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) { 
      alert('Start Date must be before or equal to End Date'); 
      return false; 
    }
    if (start_time && end_time && start_time >= end_time) { 
      alert('Start Time must be before End Time'); 
      return false; 
    }
    return true;
  };

  useEffect(() => {
    // Reset day and time period if meeting_mode is one-time
    if (formData.meeting_mode === 'one-time') {
      setFormData((prevData) => ({
        ...prevData,
        day: -1,
        end_date: ''
      }));
    }
  }, [formData.meeting_mode]);

  
  return (
    <form className="create-appt-form-div container-box" onSubmit={handleSubmit}>
      <div className='mode'>
        <p>Mode* :</p>
        <div className="radio-option">
          <input
            type="radio"
            id="one-time"
            name="meeting_mode"
            value="one-time"
            onChange={handleChange}
            required
            checked = {formData.meeting_mode === 'one-time'}
          />
          <label htmlFor="one-time">One-Time</label>
        </div>
        <div className="radio-option">
          <input
            type="radio"
            id="recurring"
            name="meeting_mode"
            value="recurring"
            onChange={handleChange}
            checked = {formData.meeting_mode === 'recurring'}
          />
          <label htmlFor="recurring">Recurring</label><br />
        </div>
      </div>

      {/* TODO built in formatting for course */}
      <div className='course'>
        <p>Course (optional) :</p>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
        />
      </div>

      <div className='topic'>
        <p>Topic* :</p>
        <input
          type="text"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          required
        />
      </div>

      {/* only appears when you select RECURRING*/}
      <div className='day'>
        <p>Day* :</p>
        
        <select
          name='day'
          value={formData.day}
          onChange={handleChange}
          required={formData.meeting_mode === 'recurring'}
          disabled={formData.meeting_mode === 'one-time'}
        >
          <option value={-1} disabled> choose a day </option>
         
          <option value={1}>Monday</option>
          <option value={2}>Tuesday</option>
          <option value={3}>Wednesday</option>
          <option value={4}>Thursday</option>
          <option value={5}>Friday</option>
          <option value={6}>Saturday</option>
          <option value={0}>Sunday</option>
        </select>
      </div>

      <div className='time-period'>
        <p>Time period* :</p>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <p>&ensp;to&ensp;</p>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          disabled={formData.meeting_mode === 'one-time'}
          required={formData.meeting_mode === 'recurring'}
        />
      </div>

      <div className='time-of-day'>
        <p>Start* :</p>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
        <p>End* :</p>
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
      </div>

      <div className='form-btn'>
        <button type='submit' className='confirm'>Confirm</button>
        <button type='button' className='cancel' onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AppointmentCreationForm;