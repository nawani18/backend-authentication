import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Resgister.scss";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);

      if (res.status === 200) {
        toast.success("Registration successful! Please check your email.");
        navigate("/register-success");
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.info("Email already exists");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Registration failed"
        );
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              {...register("fullName", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <span className="error">{errors.name.message}</span>
            )}
          </div>

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

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        <div className="links">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
