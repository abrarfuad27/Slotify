import React, { useState } from "react";
import "../style/userLogin.css"; // Import the CSS file
import NavBarUser from "../components/navbarUser";
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

Modal.setAppElement("#root"); // Set the root element for accessibility

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { login } = useAuth(); // Access login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!email || !password) {
      setModalMessage("All fields are required.");
      setIsSuccess(false);
      setModalIsOpen(true); // Open the modal with the error
      return;
    }

    try {
      // Call the login function from AuthContext
      await login(email, password);

      setModalMessage("Login successful! Redirecting to dashboard...");
      setIsSuccess(true);
    } catch (error) {
      // Handle error response from the login attempt
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An unknown error occurred";
      setModalMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setModalIsOpen(true); // Open the modal
    }
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal
  };

  return (
    <>
      <NavBarUser />
      <div className="login-page-without-nav">
        <div className="login-page-container">
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
                  navigate("/memberDashboard"); // Redirect to the root page if login is successful
                } else {
                  closeModal(); // Close the modal if there's an error
                }
              }}
            >
              {isSuccess ? "Proceed to Dashboard" : "OK"}
            </button>
          </Modal>
        </div>
      </div>
    </>
  );
}
