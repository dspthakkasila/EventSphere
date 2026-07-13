import "./FeaturedEvent.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../services/eventService";

function FeaturedEvent() {
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const data = await getEvents();
      const featured = data.find((e) => e.is_featured) || data[0] || null;
      setEvent(featured);
    } catch (error) {
      console.error("Failed to load featured event:", error);
    }
  };

  if (!event) return null;

  const bannerStyle = {
    backgroundImage: event.banner
      ? `url(http://127.0.0.1:8000${event.banner})`
      : event.banner_url
      ? `url(${event.banner_url})`
      : "linear-gradient(135deg, #4f46e5, #7c3aed)",
  };

  return (
    <div className="featured-event" style={bannerStyle}>
      <div className="featured-overlay">
        <div className="featured-content">
          <span className="featured-tag">🔥 Featured Event</span>

          <h1>{event.title}</h1>

          <p>{event.description?.slice(0, 160)}...</p>

          <div className="event-info">
            <span>
              <i className="bi bi-geo-alt-fill"></i>
              {event.location}
            </span>
            <span>
              <i className="bi bi-calendar-event-fill"></i>
              {new Date(event.event_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>
              <i className="bi bi-people-fill"></i>
              {event.available_seats} Seats
            </span>
            <span>⭐ {event.rating}</span>
          </div>

          <button
            className="book-btn"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <i className="bi bi-ticket-perforated-fill"></i>
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedEvent;
