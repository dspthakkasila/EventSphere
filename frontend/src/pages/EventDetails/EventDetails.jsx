import "./EventDetails.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEventById } from "../../services/eventService";

import EventHero from "../../components/EventDetails/EventHero/EventHero";
import EventInfo from "../../components/EventDetails/EventInfo/EventInfo";
import TicketCard from "../../components/EventDetails/TicketCard/TicketCard";
import OrganizerCard from "../../components/EventDetails/OrganizerCard/OrganizerCard";
import LocationMap from "../../components/EventDetails/LocationMap/LocationMap";
import RelatedEvents from "../../components/EventDetails/RelatedEvents/RelatedEvents";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);

      setEvent(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!event) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  return (
    <div className="event-details-page">
      <EventHero event={event} />

      <div className="event-details-content">
        <div>
          <EventInfo event={event} />

          <OrganizerCard event={event} />

          <LocationMap event={event} />
        </div>

        <TicketCard event={event} />
      </div>

      <RelatedEvents event={event} />
    </div>
  );
}

export default EventDetails;
