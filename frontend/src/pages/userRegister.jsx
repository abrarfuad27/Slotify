// Abrar Mohammad Fuad; 261083785
import React, { useState } from "react";
import "../style/userRegister.css"; // Import the CSS file
import axios from "axios";
import Modal from "react-modal"; // Import React Modal
import NavBarUser from "../components/navbarUser";
import Footer from "../components/footer";
import { publicUrl } from "../constants";

Modal.setAppElement("#root");

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // check if the input fields are filled
  const validateInputs = () => {
    const newErrors = { firstName: "", lastName: "", email: "", password: "" };
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(mcgill\.ca|mail\.mcgill\.ca)$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid McGill email address.";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error); // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateInputs()) return; // If there are errors, do not proceed

    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await axios.post(`${publicUrl}/userRegister`, userData);

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
      <div className="hero-img-register"> </div>
      <div className="register-page-without-nav">
        <div className="register-page-container">
          <h1 className="register-page-header">Create a Slotify Account</h1>
          <div className="form-div">
            <form className="form-container" onSubmit={handleSubmit}>
              <div
                style={{
                  position: "relative",
                }}
              >
                <label>First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors((prev) => ({ ...prev, firstName: "" }));
                  }}
                  style={{
                    border: errors.firstName ? "1px solid red" : undefined,
                  }}
                />
                {errors.firstName && (
                  <p
                    style={{
                      position: "absolute",
                      color: "red",
                      top: "100%",
                      fontSize: "8px",
                      height: "16px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div
                style={{
                  position: "relative",
                }}
              >
                <label>Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors((prev) => ({ ...prev, lastName: "" }));
                  }}
                  style={{
                    border: errors.lastName ? "1px solid red" : undefined,
                  }}
                />
                {errors.lastName && (
                  <p
                    style={{
                      position: "absolute",
                      color: "red",
                      top: "100%",
                      fontSize: "8px",
                      height: "16px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div
                style={{
                  position: "relative",
                }}
              >
                <label>Email:</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  style={{
                    border: errors.email ? "1px solid red" : undefined,
                  }}
                />
                {errors.email && (
                  <p
                    style={{
                      position: "absolute",
                      color: "red",
                      top: "100%",
                      fontSize: "8px",
                      height: "16px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div
                style={{
                  position: "relative",
                }}
              >
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  style={{
                    border: errors.password ? "1px solid red" : undefined,
                  }}
                />
                {errors.password && (
                  <p
                    style={{
                      position: "absolute",
                      color: "red",
                      top: "100%",
                      fontSize: "8px",
                      height: "16px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>
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
      <Footer />
    </div>
  );
}
