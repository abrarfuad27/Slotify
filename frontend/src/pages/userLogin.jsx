import React, { useState } from "react";
import "../style/userLogin.css"; // Import the CSS file
import NavBarUser from "../components/navbarUser";
import Footer from "../components/footer";
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
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize useNavigate
  const { login } = useAuth(); // Access login function from AuthContext

  // check if all input fields are filled
  const validateInputs = () => {
    const newErrors = { email: "", password: "" };
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateInputs()) return; // Stop submission if inputs are invalid

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
    <div className="login-page">
      <NavBarUser />
      <div className="hero-img-login"> </div>
      <div className="login-page-without-nav">
        <div className="login-page-container">
          <h1 className="login-page-header">Already a Member? Log In</h1>
          <div className="form-div">
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-group" style={{ position: "relative" }}>
                <label>Email:</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" })); // Clear error on input change
                  }}
                  style={{
                    border: errors.email ? "1px solid red" : undefined, // Apply red border if error exists
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
                className="form-group"
                style={{ position: "relative", marginBottom: "20px" }}
              >
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" })); // Clear error on input change
                  }}
                  style={{
                    border: errors.password ? "1px solid red" : undefined, // Apply red border if error exists
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
                  navigate("/memberDashboard"); // Redirect to the dashboard page if login is successful
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
      <div className="login-page-footer-div">
        <Footer />
      </div>
    </div>
  );
}
