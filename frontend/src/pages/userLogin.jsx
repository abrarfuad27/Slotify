import React, { useState } from "react";
import "../style/userLogin.css"; // Import the CSS file
import NavBarUser from "../components/navbarUser";
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission for now
    const userData = {
      email,
      password,
    };
    try {
      // Send the data to the backend using Axios
      const response = await axios.post(
        "http://localhost:5000/userLogin",
        userData
      );

      setModalMessage(response.data.message); // Set success message from server
      setIsSuccess(true); // Mark as a success response

      // Redirect to the root page if the login is successful
      setTimeout(() => {
        navigate("/"); // Use navigate() to redirect to the home page
      }, 1500); // Wait for 1.5 seconds before redirecting
    } catch (error) {
      // Handle error response from the server
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An unknown error occurred";
      setModalMessage(errorMessage); // Set error message
      setIsSuccess(false); // Mark as an error response
    } finally {
      // Open the modal
      setModalIsOpen(true);

      // Optionally clear the form fields after submission
      setEmail("");
      setPassword("");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal
  };

  return (
    <div className="login-page-container">
      <NavBarUser/>
      <h1 className="login-page-header">Already a Member? Log In</h1>
      <div className="form-div">
        <form className="form-container" onSubmit={handleSubmit}>
          <label>
            Email :
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password :
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Log In</button>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Status"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{isSuccess ? "Success" : "Error"}</h2>
        <p>{modalMessage}</p>
        <button
          onClick={() => {
            if (isSuccess) {
              navigate("/"); // Redirect to the root page if login is successful
            } else {
              closeModal(); // Close the modal if there's an error
            }
          }}
        >
          {isSuccess ? "Proceed to Dashboard" : "OK"}
        </button>
      </Modal>
    </div>
  );
}
