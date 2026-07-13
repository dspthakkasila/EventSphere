import "./Analytics.css";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { getEvents } from "../../services/eventService";
import { getBookings } from "../../services/bookingService";
import { getWishlist } from "../../services/wishlistService";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
}

function Analytics() {
  const [stats, setStats] = useState({ events: 0, bookings: 0, favorites: 0, revenue: 0 });
  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [events, bookings, wishlist] = await Promise.all([
        getEvents(),
        getBookings(),
        getWishlist(),
      ]);

      const revenue = bookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

      const monthly = new Array(12).fill(0);
      bookings.forEach((b) => {
        const month = new Date(b.booked_at).getMonth();
        monthly[month]++;
      });

      setStats({ events: events.length, bookings: bookings.length, favorites: wishlist.length, revenue });
      setMonthlyData(monthly);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const maxVal = Math.max(...monthlyData, 1);

  const cards = [
    { label: "Total Events", value: stats.events, icon: "bi-calendar-event-fill", color: "#4f46e5" },
    { label: "My Bookings", value: stats.bookings, icon: "bi-ticket-perforated-fill", color: "#0ea5e9" },
    { label: "Favorites", value: stats.favorites, icon: "bi-heart-fill", color: "#ef4444" },
    { label: "Total Spent (₹)", value: stats.revenue, icon: "bi-currency-rupee", color: "#f59e0b" },
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1><i className="bi bi-bar-chart-fill"></i> Analytics</h1>
        <p>Your activity at a glance.</p>
      </div>

      <div className="analytics-grid">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="analytics-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <i className={`bi ${card.icon} a-icon`} style={{ color: card.color }}></i>
            <h4>{card.label}</h4>
            <h2>
              {loading ? "—" : <AnimatedNumber value={card.value} />}
            </h2>
            <span>Live data</span>
          </motion.div>
        ))}
      </div>

      <div className="chart-placeholder">
        <h3><i className="bi bi-bar-chart-line-fill"></i> Monthly Bookings</h3>
        <div className="bar-chart">
          {monthlyData.map((val, i) => (
            <div className="bar-wrap" key={i}>
              <motion.div
                className="bar"
                initial={{ height: 0 }}
                animate={{ height: `${(val / maxVal) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />
              <span>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
