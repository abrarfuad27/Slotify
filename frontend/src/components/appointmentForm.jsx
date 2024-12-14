// Christina Chen
import React, { useState, useEffect } from 'react';
import '../style/appointmentForm.css';

const AppointmentCreationForm = ({ onSubmit }) => {

  const [curDate, setCurDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const initialFormData = {
    meeting_mode: 'one-time',
    course: '',
    topic: '',
    day: -1,
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    timeslot_dates: []
  };
  const [formData, setFormData] = useState(initialFormData);

  // Disable past dates in form calendar  
  useEffect(() => {
    const curDate = new Date().toLocaleDateString('en-CA');
    setCurDate(curDate);
  },[]);

  // Reset 'day' and 'time period' when user toggles form to 'one-time' mode
  useEffect(() => {
    if (formData.meeting_mode === 'one-time') {
      setFormData((prevData) => ({
        ...prevData,
        day: -1,
        end_date: ''
      }));
    }
  }, [formData.meeting_mode]);

  // Form submission method
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.topic = formData.topic.trim();
    // Prevent form submission when topic entered is an empty string
    if (!formData.topic){
      setErrorMsg('Topic is required.');
      return;
    }
    // Prevent form submission when dates are invalid
    if (!validateDates()){
      return;
    }
    // Create meeting timeslots
    const timeslot_dates = createTimeslotDates();

    // Prevent form submission when there are no timeslots generated
    if (timeslot_dates.length === 0){
      return;
    }

    // Set timeslot in form data
    formData.timeslot_dates = timeslot_dates;
    console.log('Form data:', formData);
    
    // Submit form
    onSubmit({...formData});
  };

  // Method to create meeting timeslots
  const createTimeslotDates = () => {
    let result = [];

    // Create only 1 timeslot for 'one-time' meetings
    if (formData.meeting_mode === 'one-time'){
      result = [formData.start_date];
    }
    // Create multiple timeslots for 'recurring' meetings
    else {
      const startDateParts = formData.start_date.split('-');
      const endDateParts = formData.end_date.split('-');

      let curr_date = new Date(
        startDateParts[0],
        startDateParts[1] - 1,
        startDateParts[2]
      );

      const end_date = new Date(
        endDateParts[0],
        endDateParts[1] - 1,
        endDateParts[2]
      )
      let timeslot = [];

      // Look for timeslot dates within the selected timeframe
      while (curr_date <= end_date){
        if (curr_date.getDay() === Number(formData.day)){
          timeslot = curr_date.toISOString().slice(0, 10);
          result.push(timeslot);
        }
        curr_date.setDate(curr_date.getDate() + 1);
      }

      // Error handling - when no dates fall within the specified timeframe
      const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
      if (!result.length){
        setErrorMsg(`Invalid start/end date range. No ${days[formData.day]} falls within the specified period.`);
      } 
    }
    
    // Error handling - invalid start time
    if (result.length === 1){
      const today = new Date().toLocaleDateString('en-CA');
      const curr_time = new Date().toLocaleTimeString('en-CA', 
                                                      { hour: '2-digit', 
                                                      minute: '2-digit', 
                                                      hour12: false  });
      if (formData.start_date === today && formData.start_time < curr_time){
        setErrorMsg('Invalid start time. Start time must be now or later.');
        result = [];
      }
    }
    return result;
  };

  // Method to validate input dates
  const validateDates = () => {
    const { start_date, end_date, start_time, end_time } = formData;
    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) { 
      setErrorMsg('Start date must be earlier than end date.'); 
      return false; 
    }
    if (start_time && end_time && start_time >= end_time) { 
      setErrorMsg('Start time must be earlier than end time.'); 
      return false;
    }
    // Set error message for Modal
    setErrorMsg(errorMsg);
    return true;
  };

  // Reset form data
  const handleReset = () => {
    setFormData(initialFormData);
  };

  // Dynamically update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  return (
    <form className="create-appt-form-div" onSubmit={handleSubmit}>
      {/* Error message */}
      <div className='error-msg'>{errorMsg}</div>

      {/* Form fields */}
      <div className='mode'>
        {/* Meeting mode */}
        <p>Mode: <span style={{ color: 'red' }}>*</span>
        </p>
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

      {/* Course field */}
      <div className='course'>
        <p>Course (optional):</p>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          pattern="^[A-Za-z0-9]+$" title="Letters and numbers only - no space" placeholder="COMP307"
        />
      </div>

      {/* Topic field */}
      <div className='topic'>
        <p>Topic: <span style={{ color: 'red' }}>*</span>

        </p>
        <input
          type="text"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          required
        />
      </div>

      {/* Time period field */}
      <div className='time-period'>
        <label>
          <p>Start Date: <span style={{ color: 'red' }}>*</span></p>
          <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          min={curDate}
          required
          />
        </label>
        
        <label>
          <p>End Date: <span style={{ color: 'red' }}>*</span></p>
          <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          disabled={formData.meeting_mode === 'one-time'}
          min={curDate}
          required={formData.meeting_mode === 'recurring'}
          />
        </label>
        
      </div>

      {/* Day field - only appears when you select 'recurring' meetings*/}
      <div className='day'>
        <p>Day: <span style={{ color: 'red' }}>*</span>
        </p>
        
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

      {/* Time of day field */}
      <div className='time-of-day'>
        <label><p>Start Time: <span style={{ color: 'red' }}>*</span></p>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </label>
        
        <label><p>End Time: <span style={{ color: 'red' }}>*</span></p>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </label>
        
      </div>

      {/* Form buttons */}
      <div className='form-btn'>
        <button type='submit' className='confirm'>Confirm</button>
        <button type='button' className='cancel' onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
};

export default AppointmentCreationForm;