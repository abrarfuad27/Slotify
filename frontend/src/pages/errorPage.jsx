import React from "react";
import "../style/errorPage.css"; // Import the CSS file

export default function Error404() {
  return (
    <div className="error-404-container">
      <h1 className="error-title">404</h1>
      <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
}
