import React, { useState, useEffect } from 'react';
import '../style/memberAppointmentCreation.css';
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const MemberAppointmentCreation = () => {
  const { user } = useAuth();
  const email = user.email;
  // ARGS for APPT table :
      // appointmentId PK
      // mode
      // creator
      // startDate
      // endDate
      // topic
      // appointmentURL UNIQUE

  // ARGS for timeslot table : 
      // timeslotId
      // appointmentId (foreign key of the APPT table)
      // startTime 
      // endTime
      // timeslotDate
      // appointee == null
      // isRequest == False
      // requestStatus == null

  const initialFormData = {
    meeting_mode: 'one-time', // Set default value here
    course: '',
    topic: '',
    day: -1,
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: ''
  };
  const requestData = {
    'appointment_data' : {},
    'timeslot_data' : {}
  }
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
    requestData['appointment_data'] = {...formData};
    requestData['appointment_data']['email'] = email;
    console.log('Appointment:', requestData);

    // const response = await axios.post(
    //   "http://localhost:4000/createAppointments",
    //   formData
    // );
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
        start_date: '',
        end_date: ''
      }));
    }
  }, [formData.meeting_mode]);

  const processData = (data) => {
  };
  return (
    <form className="create-appt-form-div container-box create-appt-form-container" onSubmit={handleSubmit}>
      <div className='mode'>
        <p>Mode*:</p>
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

      <div className='course'>
        <p>Course (optional):</p>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
        />
      </div>

      <div className='topic'>
        <p>Topic*:</p>
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
        <p>Day*:</p>
        
        <select
          name='day'
          value={formData.day}
          onChange={handleChange}
          required={formData.meeting_mode === 'recurring'}
          disabled={formData.meeting_mode === 'one-time'}
        >
          <option selected value={-1} disabled> -- choose a day -- </option>
         
          <option value='1' >Monday</option>
          <option value='2'>Tuesday</option>
          <option value='3'>Wednesday</option>
          <option value='4'>Thursday</option>
          <option value='5'>Friday</option>
          <option value='6'>Saturday</option>
          <option value='0'>Sunday</option>
        </select>
      </div>

      <div className='time-period'>
        <p>Time period*:</p>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <p>to</p>
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
        <p>Start*:</p>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
        <p>End*:</p>
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

export default MemberAppointmentCreation;

// import React, { useState } from "react";
// import NavBarMember from '../components/navbarMember';
// import '../style/createAppointments.css';
// import icon from '../assets/create_appt_icon.png';
// import axios from "axios";
// import DatePickerForm from "../components/datePicker";
// import BasicTimePicker from "../components/timeOfDayPicker";
// const CreateAppointments = () => {
//     const [topic, setTopic] = useState("");

//     // form data
//     const [data, setData] = useState({ 
//                 mode: null, 
//                 course: null,
//                 topic : null,
//                 day : null,
//                 startDate : null,
//                 endDate : null,
//                 startTime : null,
//                 endTime : null
//             });

//     const handleSubmit = async (e) => {
        
//     };
//     // TODO : after correct submission tell them to check/delete their appointment through the History tab
//     return (
//        <div className='create-appt bg'>
//             <NavBarMember />
//             <div className='create-appt-content'>
//                 <div className='create-appt-header'>
//                     <h1>Create an Appointment&nbsp;</h1><img className='create-appt-icon' src={icon}/>
//                 </div>

//                 <div className="create-appt-form-div container-box">
//                     <form className="create-appt-form-container" onSubmit={handleSubmit}>                     
                    
//                         <div className='mode'>
//                             {/* put red star for required using css */}
//                             <p>Mode*:</p>
//                             <div class="radio-option">
//                                 <input type="radio" id="one-time" name="meeting_mode" value="one-time" required/>
//                                 <label for="one-time">One-Time</label>
//                             </div>
//                             <div class="radio-option">
//                                 <input type="radio" id="recurring" name="meeting_mode" value="recurring"/>
//                                 <label for="recurring">Recurring</label><br/>
//                             </div>
//                         </div>

//                         <div className='course'>
//                             {/* not required */}
//                             <p>Course (optional):</p>
//                             <input
//                             type="text"
//                             value={topic}
//                             onChange={(e) => setTopic(e.target.value)}
//                             required
//                             />
//                         </div>

//                         <div className='topic'>
//                             {/* put red star */}
//                             <p>Topic*:</p>
//                             <input
//                             type="text"
//                             value={topic}
//                             onChange={(e) => setTopic(e.target.value)}
//                             required
//                             />
//                         </div>

//                         {/* only appears when you select RECURRING*/}
//                         <div className='day'>
//                             <p>Day*:</p>
//                             <select name='day' required>
//                                 <option disabled selected value> -- choose a day </option>
//                                 <option>Monday</option> 
//                                 <option>Tuesday</option> 
//                                 <option>Wednesday</option> 
//                                 <option>Thursday</option> 
//                                 <option>Friday</option> 
//                                 <option>Saturday</option> 
//                                 <option>Sunday</option> 
//                             </select>
//                         </div>


//                         <div className='time-period'>
//                             <p>Time period*:</p>
//                             <input type="date" required/>
//                             <p>to</p>
//                             {/* dynamically change to required and enforce start <= end if recurrent */}
//                             <input type="date"/>
//                         </div>

//                         <div className='time-of-day'>
//                             <p>Start*:</p>
//                                 <input type="time" required/>
//                             <p>End*:</p>
//                             {/* enforce start time < end time */}
//                                 <input type="time" required/>
//                         </div>

//                         <div className='form-btn'>
//                             <button type='submit' className='confirm'>Confirm</button>
//                             <button type='submit' className='cancel'>Cancel</button>
//                         </div>
                        
//                     </form>
//                 </div>
//             </div>
//        </div>
//     );
// };

// export default CreateAppointments;