import "./RelatedEvents.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getEvents } from "../../../services/eventService";

function RelatedEvents({ event }) {
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    loadRelatedEvents();
  }, [event]);

  const loadRelatedEvents = async () => {
    try {
      const data = await getEvents();

      const filtered = data
        .filter(
          (item) => item.category === event.category && item.id !== event.id,
        )
        .slice(0, 3);

      setRelatedEvents(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  if (relatedEvents.length === 0) return null;

  return (
    <section className="related-events">
      <h2>
        <i className="bi bi-stars"></i>
        You May Also Like
      </h2>

      <div className="related-grid">
        {relatedEvents.map((item) => (
          <div className="related-card" key={item.id}>
            <img
              src={
                item.banner
                  ? `http://127.0.0.1:8000${item.banner}`
                  : item.banner_url
              }
              alt={item.title}
            />

            <div className="related-content">
              <span className="category">{item.category}</span>

              <h3>{item.title}</h3>

              <p>
                <i className="bi bi-geo-alt-fill"></i>
                {item.location}
              </p>

              <p>
                <i className="bi bi-calendar-event-fill"></i>
                {item.event_date}
              </p>

              <Link to={`/events/${item.id}`} className="details-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedEvents;
