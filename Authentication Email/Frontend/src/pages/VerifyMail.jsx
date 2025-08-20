import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./VerifyMail.scss";
import api from "../api/axios";

const VerifyMail = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Call backend API with token
        const res = await api.get(`auth/verify?token=${token}`);
        console.log(res);

        if (res.status === 200) {
          setVerificationStatus("success");
          toast.success("Email verified successfully!");
        } else if (res.status === 201) {
          setVerificationStatus("already-verified");
          toast.info("Email is already verified!");
        } else {
          setVerificationStatus("error");
          toast.error(res.data.message || "Verification failed");
        }
      } catch (error) {
        setVerificationStatus("error");
        toast.error(error.response?.data?.message || "Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="status-message verifying">
            <div className="spinner"></div>
            <p>Verifying your email...</p>
          </div>
        );
      case "success":
        return (
          <div className="status-message success">
            <h3>Email Verified Successfully! ✅</h3>
            <p>
              Your email has been verified. You can now login to your account.
            </p>
            <Link to="/login" className="action-button">
              Go to Login
            </Link>
          </div>
        );
      case "error":
        return (
          <div className="status-message error">
            <h3>Verification Failed ❌</h3>
            <p>
              We couldn't verify your email. The verification link might be
              invalid or expired.
            </p>
            <Link to="/resend-verification" className="action-button">
              Resend Verification Email
            </Link>
          </div>
        );
      case "already-verified":
        return (
          <div className="status-message success">
            <h3>Already Verified ✅</h3>
            <p>Your email is already verified. You can proceed to login.</p>
            <Link to="/login" className="action-button">
              Go to Login
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="verify-mail-container">
      <div className="verify-mail-content">{renderContent()}</div>
    </div>
  );
};

export default VerifyMail;
