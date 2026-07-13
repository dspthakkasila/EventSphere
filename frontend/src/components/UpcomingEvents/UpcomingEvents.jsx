import "./UpcomingEvents.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getEvents } from "../../services/eventService";
import { addWishlist } from "../../services/wishlistService";

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data.filter((e) => e.status === "Upcoming").slice(0, 3));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (eventId) => {
    try {
      await addWishlist(eventId);
      toast.success("Added to Favorites ❤️");
    } catch (error) {
      toast.error(error.response?.data?.[0] || "Already in favorites.");
    }
  };

  const getImage = (event) => {
    if (event.banner) return `http://127.0.0.1:8000${event.banner}`;
    if (event.banner_url) return event.banner_url;
    return "/images/default-event.jpg";
  };

  if (loading) {
    return (
      <section className="upcoming-events">
        <h2 style={{ color: "white" }}>Loading events...</h2>
      </section>
    );
  }

  return (
    <section className="upcoming-events">
      <ToastContainer position="top-right" />

      <div className="section-header">
        <div>
          <h2>Upcoming Events</h2>
          <p>Discover trending events happening near you.</p>
        </div>
        <button className="view-all-btn" onClick={() => navigate("/events")}>
          View All
        </button>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <h3 style={{ color: "white" }}>No Events Available</h3>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="image-box">
                <img src={getImage(event)} alt={event.title} />
                <span className="category">{event.category}</span>
                <button
                  className="favorite"
                  onClick={() => handleFavorite(event.id)}
                >
                  <i className="bi bi-heart"></i>
                </button>
              </div>

              <div className="event-content">
                <h3>{event.title}</h3>

                <div className="info">
                  <span>
                    <i className="bi bi-geo-alt-fill"></i>
                    {event.location}
                  </span>
                  <span>
                    <i className="bi bi-calendar-event-fill"></i>
                    {formatDate(event.event_date)}
                  </span>
                </div>

                <div className="bottom">
                  <span>
                    <i className="bi bi-people-fill"></i>
                    {event.available_seats} Seats
                  </span>
                  <span>₹ {event.price}</span>
                </div>

                <button
                  className="book-ticket"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  Book Ticket
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default UpcomingEvents;
