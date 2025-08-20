import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // TODO: Implement login API call
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back</h2>
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

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <div className="links">
          <Link to="/register">Don't have an account? Register</Link>
          <Link to="/resend-verification">Resend verification email</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
