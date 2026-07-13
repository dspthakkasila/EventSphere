import "./OrganizerCard.css";

import { motion } from "framer-motion";

function OrganizerCard({ event }) {
  if (!event) return null;

  return (
    <motion.section
      className="organizer-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2>
        <i className="bi bi-person-badge-fill"></i>
        Event Organizer
      </h2>

      <div className="organizer-content">
        <div className="organizer-avatar">
          {event.organizer?.first_name
            ? event.organizer.first_name.charAt(0).toUpperCase()
            : "O"}
        </div>

        <div className="organizer-info">
          <h3>
            {event.organizer?.first_name} {event.organizer?.last_name}
          </h3>

          <span className="role">Professional Event Organizer</span>

          <div className="organizer-details">
            <p>
              <i className="bi bi-envelope-fill"></i>
              {event.organizer?.email}
            </p>

            <p>
              <i className="bi bi-calendar-check-fill"></i>
              25+ Events Conducted
            </p>

            <p>
              <i className="bi bi-star-fill"></i>
              4.9 Average Rating
            </p>
          </div>

          <div className="organizer-buttons">
            <button className="contact-btn">
              <i className="bi bi-chat-dots-fill"></i>
              Contact
            </button>

            <button className="follow-btn">
              <i className="bi bi-person-plus-fill"></i>
              Follow
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default OrganizerCard;
