import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authService";

import "./Login.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      localStorage.setItem("access", response.data.access);

      localStorage.setItem("refresh", response.data.refresh);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login Successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid email or password");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="login-page">
      <video autoPlay muted loop playsInline className="login-video">
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="container">
        <div className="row align-items-center min-vh-100">
          <motion.div
            className="col-lg-6 text-white"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>Welcome Back</h1>

            <h3 className="mt-4">Continue Your Event Journey</h3>

            <p className="mt-4">
              Login to manage events, bookings, notifications, dashboard and
              much more.
            </p>
          </motion.div>

          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="login-card">
              <h2>Login</h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label>Email</label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />

                  <small>{errors.email?.message}</small>
                </div>

                <div className="mb-4 position-relative">
                  <label>Password</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <i
                    className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} eye-icon`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>

                  <small>{errors.password?.message}</small>
                </div>

                <button className="btn btn-primary w-100 login-btn">
                  Login
                </button>
              </form>

              <div className="text-center mt-4">
                Don't have an account?
                <Link to="/register" className="ms-2">
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
