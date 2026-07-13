import "./Events.css";

import { useEffect, useMemo, useState } from "react";

import SearchBar from "../../../components/Events/SearchBar/SearchBar";
import FilterBar from "../../../components/Events/FilterBar/FilterBar";
import EventCard from "../../../components/Events/EventCard/EventCard";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../../services/eventService";
import { addWishlist } from "../../../services/wishlistService";
import { toast, ToastContainer } from "react-toastify";

function Events() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.log(error);
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

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (search.trim()) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category) {
      filtered = filtered.filter((event) => event.category === category);
    }

    switch (sortBy) {
      case "latest":
        filtered.sort(
          (a, b) => new Date(b.event_date) - new Date(a.event_date),
        );
        break;

      case "price_low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "price_high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "rating":
        filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;

      default:
        break;
    }

    return filtered;
  }, [events, search, category, sortBy]);

  if (loading) {
    return (
      <div className="events-page">
        <h2>Loading Events...</h2>
      </div>
    );
  }

  return (
    <div className="events-page">
      <ToastContainer position="top-right" />

      <div className="events-header">
        <h1>Explore Events</h1>

        <p>Discover amazing events happening around you.</p>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <FilterBar
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <h2 className="no-events">No Events Found</h2>
        )}
      </div>
    </div>
  );
}

export default Events;
