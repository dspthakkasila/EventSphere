import "./TicketCard.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../../services/bookingService";
import { addWishlist } from "../../../services/wishlistService";

function TicketCard({ event }) {
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  if (!event) return null;

  const increase = () => {
    if (quantity < event.available_seats) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const total = quantity * Number(event.price);

  const handleBook = async () => {
    if (event.available_seats === 0) {
      toast.error("No seats available.");
      return;
    }
    setBooking(true);
    try {
      await createBooking(event.id, quantity);
      toast.success(`🎉 Booked ${quantity} ticket${quantity > 1 ? "s" : ""}!`);
      setTimeout(() => navigate("/tickets"), 1500);
    } catch (error) {
      const msg = error.response?.data?.[0] || error.response?.data?.detail || "Booking failed.";
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await addWishlist(event.id);
      toast.success("Added to Favorites ❤️");
    } catch (error) {
      toast.error(error.response?.data?.[0] || "Already in favorites.");
    }
  };

  return (
    <motion.div
      className="ticket-card"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <ToastContainer position="top-right" />

      <h2>
        <i className="bi bi-ticket-perforated-fill"></i>
        Book Tickets
      </h2>

      <div className="ticket-price">
        <span>Ticket Price</span>
        <h1>₹ {event.price}</h1>
      </div>

      <div className="ticket-info">
        <div>
          <span>Available Seats</span>
          <strong>{event.available_seats}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong className="status">{event.status}</strong>
        </div>
      </div>

      <div className="quantity-box">
        <h4>Select Quantity</h4>
        <div className="counter">
          <button onClick={decrease}>
            <i className="bi bi-dash"></i>
          </button>
          <span>{quantity}</span>
          <button onClick={increase}>
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>

      <div className="total-price">
        <span>Total</span>
        <h2>₹ {total}</h2>
      </div>

      <button
        className="book-btn-full"
        onClick={handleBook}
        disabled={booking || event.available_seats === 0}
      >
        <i className="bi bi-credit-card-fill"></i>
        {booking ? "Booking..." : event.available_seats === 0 ? "Sold Out" : "Book Now"}
      </button>

      <button className="wishlist-btn" onClick={handleWishlist}>
        <i className="bi bi-heart"></i>
        Add to Wishlist
      </button>
    </motion.div>
  );
}

export default TicketCard;
