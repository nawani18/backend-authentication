import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Resendmail.scss";
import api from "../api/axios";
import { useState } from "react";

const ResendMail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    // Prevent multiple submissions
    if (isLoading) return;

    // Basic validation
    if (!data.email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/resend-verification", data);
      toast.success(res.data.message || "Verification email sent successfully");
    } catch (error) {
      console.error("Resend verification error:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 400:
            toast.error(message || "Email is required");
            break;
          case 404:
            toast.error(message || "User not found");
            break;
          case 409:
            toast.info(message || "User already verified");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(message || "Something went wrong");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resend-mail-container">
      <div className="resend-mail-form">
        <h2>Resend Verification Email</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Resend Verification
          </button>
        </form>

        <div className="links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResendMail;
