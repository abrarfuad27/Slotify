import React, { useState } from "react";
import NavBarMember from '../components/navbarMember';
import '../style/createAppointments.css';
import icon from '../assets/create_appt_icon.png';
import axios from "axios";
import DatePickerForm from "../components/datePicker";
import BasicTimePicker from "../components/timeOfDayPicker";
const CreateAppointments = () => {
    const [topic, setTopic] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        // e.preventDefault(); // Prevent default form submission for now
        // const userData = {
        //   email,
        //   password,
        // };
        // try {
        //   // Send the data to the backend using Axios
        //   const response = await axios.post(
        //     // "http://localhost:5000/userLogin",
        //     "http://localhost:4000/userLogin",
        //     userData
        //   );
    
        //   setModalMessage(response.data.message); // Set success message from server
        //   setIsSuccess(true); // Mark as a success response
    
        //   // Redirect to the root page if the login is successful
        //   setTimeout(() => {
        //     navigate("/"); // Use navigate() to redirect to the home page
        //   }, 1500); // Wait for 1.5 seconds before redirecting
        // } catch (error) {
        //   // Handle error response from the server
        //   const errorMessage =
        //     error.response && error.response.data && error.response.data.message
        //       ? error.response.data.message
        //       : "An unknown error occurred";
        //   setModalMessage(errorMessage); // Set error message
        //   setIsSuccess(false); // Mark as an error response
        // } finally {
        //   // Open the modal
        //   setModalIsOpen(true);
    
        //   // Optionally clear the form fields after submission
        //   setTopic("");
        //   setPassword("");
        // }
      };

    return (
       <div className='create-appt bg'>
            <NavBarMember />
            <div className='create-appt-content'>
                <div className='create-appt-header'>
                    <h1>Create an Appointment&nbsp;</h1><img className='create-appt-icon' src={icon}/>
                </div>

                <div className="create-appt-form-div container-box">
                    <form className="create-appt-form-container" onSubmit={handleSubmit}>                     
                    
                        <div className='mode'>
                            <p>Mode :</p>
                            <div class="radio-option">
                                <input type="radio" id="one-time" name="meeting_mode" value="one-time"/>
                                <label for="one-time">One-Time</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" id="recurring" name="meeting_mode" value="recurring"/>
                                <label for="recurring">Recurring</label><br/>
                            </div>
                        </div>

                        <div className='topic'>
                            <p>Topic:</p>
                            <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        {/* only appears when you select RECURRING*/}
                        <div className='day'>
                            <p>Day:</p>
                            <select name='day' class='required'>
                                <option>Monday</option> 
                                <option>Tuesday</option> 
                                <option>Wednesday</option> 
                                <option>Thursday</option> 
                                <option>Friday</option> 
                                <option>Saturday</option> 
                                <option>Sunday</option> 
                            </select>
                        </div>


                        <div className='time-period'>
                            <p>Time period:</p>
                            <DatePickerForm/>
                            <p>to</p>
                            <DatePickerForm/>
                        </div>

                        <div className='time-of-day'>
                            <p>Start:</p>
                                <BasicTimePicker/>
                            <p>End:</p>
                                <BasicTimePicker/>
                        </div>

                        <div className='form-btn'>
                            <button type='submit' className='confirm'>Confirm</button>
                            <button type='submit' className='cancel'>Cancel</button>
                        </div>
                        
                    </form>
                </div>
            </div>

       </div>
    );
};

export default CreateAppointments;