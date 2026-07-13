import "./Navbar.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <motion.nav
      className="navbar-custom"
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}

      <div className="logo">
        <i className="bi bi-calendar2-event-fill"></i>

        <div>
          <h3>EventSphere</h3>
          <span>Professional Event Platform</span>
        </div>
      </div>

      {/* Search */}

      <div className="search-box">
        <i className="bi bi-search"></i>

        <input type="text" placeholder="Search events..." />
      </div>

      {/* Right Side */}

      <div className="nav-right">
        <button className="icon-btn">
          <i className="bi bi-calendar-week"></i>
        </button>

        <button className="icon-btn notification-btn">
          <i className="bi bi-bell-fill"></i>

          <span>3</span>
        </button>

        <div className="profile">
          <div className="avatar">
            {user?.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h6>
              {user?.first_name} {user?.last_name}
            </h6>

            <small>{user?.role}</small>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
