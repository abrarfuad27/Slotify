import React, {useState} from 'react';
import '../style/appointmentCreation.css';
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import FormComponent from '../components/appointmentForm';
import NavBarMember from '../components/navbarMember';
import Footer from "../components/footer";
import icon from "../assets/create_appt_icon.png";
import { publicUrl } from "../constants";
import Modal from "react-modal"; 
import copy_icon from "../assets/copy_icon.png";

const AppointmentCreation = () => {
  const { user } = useAuth();
  const email = user.email;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [apptLink, setApptLink] = useState('');



  const openModal = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const createRequestData = (formData) => {
    if (formData.meeting_mode === 'one-time') {
      formData.end_date = formData.start_date;
    }

    let requestData = {};
    // const timeslot_dates = createTimeslotDates(formData);
    const timeslotIds = [];
    for (let i = 0; i < formData.timeslot_dates.length; i++) { 
      timeslotIds.push('time' + generateUniqueString(11)); 
    }
    requestData = {
      ...formData,
      'creator': email,
      'appointmentId' : 'appt'+ generateUniqueString(11),
      'appointmentURL': generateUniqueString(11),
      'timeslotIds' : timeslotIds,
    }
    // requestData.appointment_data = {
    //   ...formData,
    //   'creator': email,
    //   'appointmentId' : 'appt'+ generateUniqueString(11),
    //   'appointmentURL': generateUniqueString(11)
    // };
    // requestData.timeslot_data = {
    //   'timeslotIds' : timeslotIds,
    //   'timeslot_dates' : formData.timeslot_dates
    // }

    return requestData;
  };


  // // warning : ensure that times are set in correct timezone
  // const createTimeslotDates = (formData) => {
  //   if (formData.meeting_mode === 'one-time'){
  //     return [new Date(formData.start_date)];
  //   }
  //   const result = [];
    
  //   const startDateParts = formData.start_date.split('-');
  //   const endDateParts = formData.end_date.split('-');

  //   let curr_date = new Date(
  //     startDateParts[0],
  //     startDateParts[1] - 1,
  //     startDateParts[2]
  //   );

  //   const end_date = new Date(
  //     endDateParts[0],
  //     endDateParts[1] - 1,
  //     endDateParts[2]
  //   )
  //   let timeslot = '';
  //   while (curr_date <= end_date){
  //     if (curr_date.getDay() === Number(formData.day)){
  //       timeslot = curr_date.toISOString().slice(0, 10);
  //       result.push(timeslot);
  //     }
  //     curr_date.setDate(curr_date.getDate() + 1);
  //   }
  //   const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday']
  //   if (!result.length){
  //     alert(`Invalid start/end date range. The time window is too narrow, and no ${days[formData.day]} falls within the specified period for a recurring meeting.`);
  //   }
  //   return result;
  // };

  //TODO : extract as function
  const generateUniqueString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  const handleSubmit = async (formData) => {
    if (!formData){
      // alert("NO BUENO");
      return;
    }
    console.log('HEREREE:', formData);
    const requestData = createRequestData(formData);
    console.log('Request data', requestData);

    const response = await axios.post(
      `${publicUrl}/createAppointments`,
      {...requestData},
      {
        withCredentials: true,
      }
    );
    // console.log(requestData.appointment_data.appointmentURL);
    if (response.data.status === "success") {
      setApptLink(requestData.appointmentURL);
      openModal("Appointment created! Save the appointment token: "+requestData.appointmentURL, true);
    } else {
      openModal("There was an error :", false);
    }
    // alert("Appointment created! Save the URL :" +  requestData.appointmentURL);
    // alert("Server Response:", response.data); 
    // console.log("Server Response:", response.data.message);
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div className='appt-creation'>
      <NavBarMember/>
      <div className='create-appt-content'>
        <div className='create-appt-header'>
          <h1>Create an Appointment&nbsp;</h1><img className='create-appt-icon' src={icon}/>
        </div>

        <FormComponent onSubmit={handleSubmit}/>
      </div>
      <Footer/>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Appointment Creation Status"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{isSuccess ? "Success" : "Error"}</h2>
        <p>{modalMessage}</p>
        <button
          className="copy-icon-btn"
          onClick={() => copyToClipboard(apptLink)}
        >
          <img src={copy_icon}/>
        </button>
        <button
          onClick={() => {
            if (isSuccess) {
              window.location.reload(); // Refresh the page
            } else {
              closeModal(); // Close the modal if not successful
            }
          }}
        >
        OK
        </button>

      </Modal>
    </div>
    );
};

export default AppointmentCreation;

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