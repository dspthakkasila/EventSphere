import "./EventCard.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { addWishlist } from "../../../services/wishlistService";

function EventCard({ event }) {
  const navigate = useNavigate();

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await addWishlist(event.id);
      toast.success("Added to Favorites ❤️");
    } catch (error) {
      toast.error(error.response?.data?.[0] || "Already in favorites.");
    }
  };

  const getImage = () => {
    if (event.banner) return `http://127.0.0.1:8000${event.banner}`;
    if (event.banner_url) return event.banner_url;
    return "/images/default-event.jpg";
  };

  return (
    <div className="event-card">
      <ToastContainer position="top-right" />

      <div className="event-image">
        <img src={getImage()} alt={event.title} />
        <span className="category">{event.category}</span>
        <button className="favorite fav-btn" onClick={handleFavorite}>
          <i className="bi bi-heart"></i>
        </button>
      </div>

      <div className="event-body">
        <h3>{event.title}</h3>

        <div className="eventDetails">
          <p>
            <i className="bi bi-geo-alt-fill"></i>
            {event.location}
          </p>
          <p>
            <i className="bi bi-calendar-event-fill"></i>
            {event.event_date}
          </p>
        </div>

        <div className="price-row">
          <span>⭐ {event.rating}</span>
          <span>₹ {event.price}</span>
        </div>

        <div className="btn-row">
          <button
            className="details-btn"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            View Details
          </button>
          <button
            className="book-btn"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
