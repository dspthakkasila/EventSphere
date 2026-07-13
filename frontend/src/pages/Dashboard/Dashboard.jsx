import "./Dashboard.css";
import { useEffect, useState } from "react";

import DashboardCard from "../../components/DashboardCard/DashboardCard";
import FeaturedEvent from "../../components/FeaturedEvent/FeaturedEvent";
import UpcomingEvents from "../../components/UpcomingEvents/UpcomingEvents";

import { getEvents } from "../../services/eventService";
import { getWishlist } from "../../services/wishlistService";
import { getBookings } from "../../services/bookingService";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [stats, setStats] = useState([
    { title: "Events", value: 0, icon: "bi-calendar-event-fill", color: "#4f46e5", increase: 0 },
    { title: "Tickets Booked", value: 0, icon: "bi-ticket-perforated-fill", color: "#0ea5e9", increase: 0 },
    { title: "Favorites", value: 0, icon: "bi-heart-fill", color: "#ef4444", increase: 0 },
    { title: "Upcoming", value: 0, icon: "bi-bell-fill", color: "#f59e0b", increase: 0 },
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [events, wishlist, bookings] = await Promise.all([
        getEvents(),
        getWishlist(),
        getBookings(),
      ]);

      const upcomingCount = events.filter((e) => e.status === "Upcoming").length;

      setStats([
        {
          title: "Events",
          value: events.length,
          icon: "bi-calendar-event-fill",
          color: "#4f46e5",
          increase: 18,
        },
        {
          title: "Tickets Booked",
          value: bookings.length,
          icon: "bi-ticket-perforated-fill",
          color: "#0ea5e9",
          increase: 23,
        },
        {
          title: "Favorites",
          value: wishlist.length,
          icon: "bi-heart-fill",
          color: "#ef4444",
          increase: 12,
        },
        {
          title: "Upcoming",
          value: upcomingCount,
          icon: "bi-bell-fill",
          color: "#f59e0b",
          increase: 5,
        },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-main">
        <div className="dashboard-body">
          <div className="welcome-section">
            <h1>Welcome Back, {user.first_name || "User"} 👋</h1>
            <p>Discover and manage amazing events.</p>
          </div>

          <div className="stats-grid">
            {stats.map((item, index) => (
              <DashboardCard key={index} {...item} />
            ))}
          </div>

          <FeaturedEvent />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
