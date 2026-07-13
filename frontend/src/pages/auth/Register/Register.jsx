import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { registerUser, loginUser } from "../../../services/authService";
import "./Register.css";

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        role: data.role,
        password: data.password,
      });

      toast.success("Registration Successful!");

      // Auto-login after registration
      const loginRes = await loginUser({ email: data.email, password: data.password });
      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.email?.[0] || "Registration Failed");
    }
  };

  return (
    <div className="register-page">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="register-video">
        <source src="/videos/register-bg.mp4" type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="container">
        <div className="row align-items-center min-vh-100">
          {/* Left Section */}

          <motion.div
            className="col-lg-6 text-white left-content"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>EventSphere Pro</h1>

            <h3 className="mt-4">Join The Future Of Event Management</h3>

            <p className="mt-4">
              Organize events. Book tickets. Connect with thousands of
              professionals.
            </p>

            <div className="feature-list mt-5">
              <div>
                <i className="bi bi-check-circle-fill"></i>
                <span>5000+ Events</span>
              </div>

              <div>
                <i className="bi bi-check-circle-fill"></i>
                <span>10000+ Members</span>
              </div>

              <div>
                <i className="bi bi-check-circle-fill"></i>
                <span>Premium Dashboard</span>
              </div>
            </div>
          </motion.div>

          {/* Right Section */}

          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="register-card">
              <h2>Create Account</h2>

              <p>Register to continue</p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* <div className="mb-3">
                  <label>Full Name</label>

                  <input
                    className="form-control"
                    placeholder="Enter Full Name"
                    {...register("fullname", {
                      required: "Full Name is required",
                    })}
                  />

                  <small>{errors.fullname?.message}</small>
                </div> */}

                <div className="mb-3">
                  <label>First Name</label>

                  <input
                    className="form-control"
                    placeholder="Enter First Name"
                    {...register("first_name", {
                      required: "First Name is required",
                    })}
                  />

                  <small>{errors.first_name?.message}</small>
                </div>

                <div className="mb-3">
                  <label>Last Name</label>

                  <input
                    className="form-control"
                    placeholder="Enter Last Name"
                    {...register("last_name", {
                      required: "Last Name is required",
                    })}
                  />

                  <small>{errors.last_name?.message}</small>
                </div>

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

                <div className="mb-3">
                  <label>Username</label>

                  <input
                    className="form-control"
                    placeholder="Username"
                    {...register("username")}
                  />
                </div>

                <div className="mb-3">
                  <label>Phone Number</label>

                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    {...register("phone_number")}
                  />
                </div>

                <div className="mb-3">
                  <label>Role</label>

                  <select className="form-select" {...register("role")}>
                    <option value="attendee">Attendee</option>

                    <option value="organizer">Organizer</option>
                  </select>
                </div>

                <div className="mb-3 position-relative">
                  <label>Password</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    {...register("password", {
                      required: "Password Required",
                    })}
                  />

                  <i
                    className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} eye-icon`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>

                  <small>{errors.password?.message}</small>
                </div>

                <div className="mb-4 position-relative">
                  <label>Confirm Password</label>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    {...register("confirmPassword")}
                  />

                  <i
                    className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} eye-icon`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  ></i>
                </div>

                <button className="btn btn-primary w-100 register-btn">
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                Already have an account?
                <Link className="ms-2" to="/login">
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default Register;
