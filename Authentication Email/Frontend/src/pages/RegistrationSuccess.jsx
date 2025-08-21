import React from "react";
import { Link } from "react-router-dom";
import "./RegistrationSuccess.scss";

const RegistrationSuccess = () => {
  return (
    <div className="registration-success">
      <div className="content">
        <h2 className="message">
          Registered Successfully, check your mail to verify
        </h2>
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="gmail-link"
        >
          Open Gmail
        </a>
      </div>
      <Link to="/login" className="login-link">
        Back to Login
      </Link>
    </div>
  );
};

export default RegistrationSuccess;
