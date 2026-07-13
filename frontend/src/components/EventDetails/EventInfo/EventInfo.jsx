import "./EventInfo.css";

import { motion } from "framer-motion";

function EventInfo({ event }) {
  if (!event) return null;

  return (
    <motion.section
      className="event-info-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="about-card">
        <h2>
          <i className="bi bi-info-circle-fill"></i>
          About This Event
        </h2>

        <p>{event.description}</p>

        <h3>Highlights</h3>

        <div className="highlights">
          <span>
            <i className="bi bi-check-circle-fill"></i>
            Networking
          </span>

          <span>
            <i className="bi bi-check-circle-fill"></i>
            Certificate
          </span>

          <span>
            <i className="bi bi-check-circle-fill"></i>
            Live Sessions
          </span>

          <span>
            <i className="bi bi-check-circle-fill"></i>
            Food Included
          </span>

          <span>
            <i className="bi bi-check-circle-fill"></i>
            Parking
          </span>

          <span>
            <i className="bi bi-check-circle-fill"></i>
            Expert Speakers
          </span>
        </div>
      </div>

      <div className="details-card">
        <h2>
          <i className="bi bi-calendar-event-fill"></i>
          Event Details
        </h2>

        <div className="detail-row">
          <span>Category</span>
          <strong>{event.category}</strong>
        </div>

        <div className="detail-row">
          <span>Date</span>
          <strong>{event.event_date}</strong>
        </div>

        <div className="detail-row">
          <span>Time</span>
          <strong>{event.event_time}</strong>
        </div>

        <div className="detail-row">
          <span>Venue</span>
          <strong>{event.location}</strong>
        </div>

        <div className="detail-row">
          <span>Total Seats</span>
          <strong>{event.total_seats}</strong>
        </div>

        <div className="detail-row">
          <span>Available Seats</span>
          <strong>{event.available_seats}</strong>
        </div>

        <div className="detail-row">
          <span>Ticket Price</span>
          <strong>₹ {event.price}</strong>
        </div>

        <div className="detail-row">
          <span>Status</span>
          <strong className="status">{event.status}</strong>
        </div>
      </div>
    </motion.section>
  );
}

export default EventInfo;
