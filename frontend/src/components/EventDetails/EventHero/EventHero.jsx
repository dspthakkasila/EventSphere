import "./EventHero.css";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addWishlist } from "../../../services/wishlistService";

function EventHero({ event }) {
  const navigate = useNavigate();

  if (!event) return null;

  const bannerImage = event.banner
    ? `http://127.0.0.1:8000${event.banner}`
    : event.banner_url || "/images/default-event.jpg";

  const handleFavorite = async () => {
    try {
      await addWishlist(event.id);
      toast.success("Added to Favorites ❤️");
    } catch (error) {
      toast.error(error.response?.data?.[0] || "Already in favorites.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info("Link copied to clipboard!");
  };

  return (
    <motion.section
      className="event-hero"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ToastContainer position="top-right" />

      <div className="hero-banner">
        <img src={bannerImage} alt={event.title} />

        <div className="banner-overlay">
          <span className="category-badge">{event.category}</span>

          <h1>{event.title}</h1>

          <p>{event.description?.slice(0, 200)}...</p>

          <div className="hero-info">
            <span>
              <i className="bi bi-geo-alt-fill"></i>
              {event.location}
            </span>
            <span>
              <i className="bi bi-calendar-event-fill"></i>
              {event.event_date}
            </span>
            <span>
              <i className="bi bi-clock-fill"></i>
              {event.event_time}
            </span>
            <span>⭐ {event.rating}</span>
          </div>

          <div className="hero-buttons">
            <button
              className="book-btn"
              onClick={() =>
                document
                  .querySelector(".ticket-card")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <i className="bi bi-ticket-perforated-fill"></i>
              Book Ticket
            </button>

            <button className="favorite-btn" onClick={handleFavorite}>
              <i className="bi bi-heart"></i>
              Favorite
            </button>

            <button className="share-btn" onClick={handleShare}>
              <i className="bi bi-share-fill"></i>
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default EventHero;
