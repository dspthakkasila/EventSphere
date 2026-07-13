import "./LocationMap.css";

import { motion } from "framer-motion";

function LocationMap({ event }) {
  if (!event) return null;

  const mapUrl = event.google_map_link;

  return (
    <motion.section
      className="location-map"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2>
        <i className="bi bi-geo-alt-fill"></i>
        Event Location
      </h2>

      <div className="location-container">
        <div className="location-details">
          <h3>{event.location}</h3>

          <p>
            Attend this amazing event at the venue mentioned below. Click the
            button to get directions instantly.
          </p>

          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="direction-btn"
          >
            <i className="bi bi-map-fill"></i>
            Open in Google Maps
          </a>
        </div>

        <div className="map-frame">
          {mapUrl ? (
            <iframe
              src={mapUrl.replace("/?q=", "/maps?q=")}
              title="Google Map"
              loading="lazy"
            ></iframe>
          ) : (
            <div className="no-map">
              <i className="bi bi-map"></i>

              <p>Map Not Available</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

export default LocationMap;
