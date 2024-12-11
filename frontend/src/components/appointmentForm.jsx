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

  //===================================================================================================

  // call upon form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()){
      onSubmit(null);
      return;
    }
    const timeslot_dates = createTimeslotDates();
    console.log("YO TIMESLOTS : ", timeslot_dates);
    if (timeslot_dates.length === 0){
      onSubmit(null);
      return;
    }
    formData.timeslot_dates = timeslot_dates;
    console.log('Form data:', formData);
    
    onSubmit({...formData});
  };

  // warning : ensure that times are set in correct timezone
  const createTimeslotDates = () => {
    if (formData.meeting_mode === 'one-time'){
      return [new Date(formData.start_date)];
    }
    const result = [];
    
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
    while (curr_date <= end_date){
      if (curr_date.getDay() === Number(formData.day)){
        //TODO change to locale time?
        timeslot = curr_date.toISOString().slice(0, 10);
        result.push(timeslot);
        console.log('TIMESLOT', timeslot);
      }
      curr_date.setDate(curr_date.getDate() + 1);
    }
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
    if (!result.length){
      setErrorMsg(`Invalid start/end date range. The time window is too narrow, and no ${days[formData.day]} falls within the specified period for a recurring meeting.`);
    }
    return result;
  };

  const validateDates = () => {
    const { start_date, end_date, start_time, end_time } = formData;
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) { 
      setErrorMsg('Start Date must be before or equal to End Date'); 
      return false; 
    }
    if (start_time && end_time && start_time >= end_time) { 
      setErrorMsg('Start Time must be before End Time'); 
      return false;
    }
    setErrorMsg(errorMsg);
    return true;
  };

  //===================================================================================================
  // run at page render
  useEffect(() => {
    // set the value of the "min" attribute to the form calendar
    const curDate = new Date().toLocaleDateString('en-CA');
    setCurDate(curDate);
  },[]);

  // run when user togglets to 'one-time' mode
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

  // reset form data
  const handleReset = () => {
    console.log('Resetting form data');
    setFormData(initialFormData);
  };

  // dynamically store form data
  const handleChange = (e) => {
    //TODO trim data?
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  return (
    <form className="create-appt-form-div container-box" onSubmit={handleSubmit}>
      <div className='error-msg'>{errorMsg}</div>
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
          pattern="^[A-Za-z0-9]+$" title="Letters and numbers only - no space" placeholder="COMP307"
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
          min={curDate}
          required
        />
        <p>&ensp;to&ensp;</p>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          disabled={formData.meeting_mode === 'one-time'}
          min={curDate}
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
        <button type='button' className='cancel' onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
};

export default AppointmentCreationForm;