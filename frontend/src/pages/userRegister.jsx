import React, { useState } from "react";
import "../style/userRegister.css"; // Import the CSS file
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import NavBarUser from "../components/navbarUser";

Modal.setAppElement("#root");

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic field validation
    if (!firstName || !lastName || !email || !password) {
      setModalMessage("All fields are required.");
      setIsSuccess(false);
      setModalIsOpen(true); // Open the modal with the error
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(mcgill\.ca|mail\.mcgill\.ca)$/;
    if (!emailRegex.test(email)) {
      setModalMessage("Please enter a valid McGill email address.");
      setIsSuccess(false);
      setModalIsOpen(true); // Open the modal with the error
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/userRegister",
        userData
      );
      console.log("Server Response:", response.data); // Display the server response

      setModalMessage(response.data.message); // Set success message from server
      setIsSuccess(true); // Mark as a success response
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false); // Close the modal
  };

  return (
    <div className="register-page">
      <NavBarUser />
      <div className="register-page-without-nav">
        <div className="register-page-container">
          <h1 className="register-page-header">Create a Slotify Account</h1>
          <div className="form-div">
            <form className="form-container" onSubmit={handleSubmit}>
              <label>
                First name :
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Last name :
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
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
              <button type="submit">Register now</button>
            </form>
            <p>
              Already a member? <a href="/userLogin">Log in</a>
            </p>
          </div>
          {/* Modal Component */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Registration Status"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <h2>{isSuccess ? "Success" : "Error"}</h2>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                if (isSuccess) {
                  window.location.href = "/userLogin"; // Redirect to login page
                } else {
                  closeModal(); // Close the modal
                }
              }}
            >
              {isSuccess ? "Login" : "OK"}
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
}
