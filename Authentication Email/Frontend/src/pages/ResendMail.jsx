import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Resendmail.scss";

const ResendMail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // TODO: Implement resend verification API call
      toast.success("Verification email sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to send verification email");
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
