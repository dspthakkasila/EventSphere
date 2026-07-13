import "./Favorites.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

import { getWishlist, removeWishlist } from "../../services/wishlistService";

function Favorites() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeWishlist(itemId);
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Removed from favorites.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove.");
    }
  };

  const getImage = (event) => {
    if (event.banner) return `http://127.0.0.1:8000${event.banner}`;
    if (event.banner_url) return event.banner_url;
    return "/images/default-event.jpg";
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <h2 className="loading-text">Loading favorites...</h2>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <ToastContainer position="top-right" />

      <div className="favorites-header">
        <h1>
          <i className="bi bi-heart-fill"></i> My Favorites
        </h1>
        <p>{wishlist.length} saved event{wishlist.length !== 1 ? "s" : ""}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-heart"></i>
          <h3>No favorites yet.</h3>
          <p>Browse events and click the heart to save them here.</p>
          <button className="browse-btn" onClick={() => navigate("/events")}>
            Browse Events
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {wishlist.map((item) => {
            const event = item.event_detail;
            if (!event) return null;

            return (
              <motion.div
                className="favorite-card"
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="fav-image">
                  <img src={getImage(event)} alt={event.title} />
                  <span className="fav-category">{event.category}</span>
                </div>

                <div className="fav-body">
                  <h3>{event.title}</h3>

                  <div className="fav-meta">
                    <span>
                      <i className="bi bi-geo-alt-fill"></i>
                      {event.location}
                    </span>
                    <span>
                      <i className="bi bi-calendar-event-fill"></i>
                      {event.event_date}
                    </span>
                    <span>
                      <i className="bi bi-people-fill"></i>
                      {event.available_seats} seats
                    </span>
                  </div>

                  <div className="fav-bottom">
                    <span className="fav-price">₹ {event.price}</span>
                    <span className="fav-rating">⭐ {event.rating}</span>
                  </div>

                  <div className="fav-actions">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <i className="bi bi-eye-fill"></i> View
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="bi bi-heart-break-fill"></i> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;
