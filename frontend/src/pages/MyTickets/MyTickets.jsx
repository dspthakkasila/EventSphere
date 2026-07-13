import "./MyTickets.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { getBookings, cancelBooking } from "../../services/bookingService";

function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled.");
    } catch (error) {
      toast.error("Failed to cancel booking.");
    }
  };

  const getImage = (event) => {
    if (event?.banner) return `http://127.0.0.1:8000${event.banner}`;
    if (event?.banner_url) return event.banner_url;
    return "/images/default-event.jpg";
  };

  const statusColor = {
    confirmed: "#22c55e",
    cancelled: "#ef4444",
    pending: "#f59e0b",
  };

  if (loading) {
    return (
      <div className="tickets-page">
        <h2 className="loading-text">Loading tickets...</h2>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <ToastContainer position="top-right" />

      <div className="tickets-header">
        <h1>
          <i className="bi bi-ticket-perforated-fill"></i> My Tickets
        </h1>
        <p>{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-ticket-perforated"></i>
          <h3>No bookings yet.</h3>
          <p>Browse events and book a ticket to see it here.</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {bookings.map((booking) => {
            const event = booking.event_detail;
            return (
              <motion.div
                key={booking.id}
                className="ticket-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="ticket-image">
                  <img src={getImage(event)} alt={event?.title} />
                </div>

                <div className="ticket-body">
                  <div className="ticket-top">
                    <h3>{event?.title}</h3>
                    <span
                      className="ticket-status"
                      style={{ color: statusColor[booking.status] }}
                    >
                      ● {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="ticket-meta">
                    <span>
                      <i className="bi bi-geo-alt-fill"></i>
                      {event?.location}
                    </span>
                    <span>
                      <i className="bi bi-calendar-event-fill"></i>
                      {event?.event_date}
                    </span>
                    <span>
                      <i className="bi bi-person-fill"></i>
                      {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="ticket-footer">
                    <span className="ticket-price">₹ {booking.total_price}</span>
                    {booking.status === "confirmed" && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <i className="bi bi-x-circle-fill"></i> Cancel
                      </button>
                    )}
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

export default MyTickets;
