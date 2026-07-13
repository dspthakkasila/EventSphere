import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function Sidebar() {
  const menus = [
    {
      title: "Dashboard",
      icon: "bi-grid-fill",
      path: "/dashboard",
    },

    {
      title: "Create Event",
      icon: "bi-calendar2-plus-fill",
      path: "/create-event",
    },

    {
      title: "Events",
      icon: "bi-calendar-event-fill",
      path: "/events",
    },

    {
      title: "My Tickets",
      icon: "bi-ticket-perforated-fill",
      path: "/tickets",
    },

    {
      title: "Favorites",
      icon: "bi-heart-fill",
      path: "/favorites",
    },

    {
      title: "Analytics",
      icon: "bi-bar-chart-fill",
      path: "/analytics",
    },

    {
      title: "Messages",
      icon: "bi-chat-dots-fill",
      path: "/messages",
    },

    {
      title: "Settings",
      icon: "bi-gear-fill",
      path: "/settings",
    },
  ];

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -120 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="sidebar-logo">
        <i className="bi bi-stars"></i>

        <h2>ESP</h2>
      </div>

      <ul>
        {menus.map((menu) => (
          <li key={menu.title}>
            <NavLink
              to={menu.path}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <i className={`bi ${menu.icon}`}></i>

              <span>{menu.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <h5>Upcoming Event</h5>

        <p>React Summit 2026</p>

        <small>12 Days Left</small>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
