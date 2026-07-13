import "./CreateEvent.css";

import { useState } from "react";
import { createEvent } from "../../../services/eventService";

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",

    description: "",

    category: "Technology",

    location: "",

    google_map_link: "",

    event_date: "",

    event_time: "",

    total_seats: "",

    available_seats: "",

    price: "",

    rating: 5,

    is_featured: false,

    status: "Upcoming",

    banner: null,

    promo_video: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser) {
        alert("Please login first.");
        return;
      }

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("organizer", loggedInUser.id);

      await createEvent(data);

      alert("🎉 Event Created Successfully!");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Failed to create event.");
      }
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <h1>
          <i className="bi bi-calendar2-plus-fill"></i>
          Create New Event
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Remaining fields in next step */}
          <div className="form-group">
            <label>
              <i className="bi bi-card-heading"></i>
              Event Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter Event Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-tags-fill"></i>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Technology</option>
              <option>Business</option>
              <option>Workshop</option>
              <option>Music</option>
              <option>Sports</option>
              <option>Education</option>
              <option>AI</option>
              <option>Startup</option>
              <option>Health</option>
              <option>Gaming</option>
              <option>Food</option>
              <option>Design</option>
              <option>Networking</option>
              <option>Finance</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-geo-alt-fill"></i>
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Hyderabad"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-map-fill"></i>
              Google Map Link
            </label>

            <input
              type="url"
              name="google_map_link"
              placeholder="https://maps.google.com/..."
              value={formData.google_map_link}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-calendar-event-fill"></i>
              Event Date
            </label>

            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-clock-fill"></i>
              Event Time
            </label>

            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-currency-rupee"></i>
              Ticket Price
            </label>

            <input
              type="number"
              name="price"
              placeholder="500"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-people-fill"></i>
              Total Seats
            </label>

            <input
              type="number"
              name="total_seats"
              placeholder="500"
              value={formData.total_seats}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-chair-fill"></i>
              Available Seats
            </label>

            <input
              type="number"
              name="available_seats"
              placeholder="500"
              value={formData.available_seats}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>
              <i className="bi bi-text-paragraph"></i>
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe your event..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-image-fill"></i>
              Banner Image
            </label>

            <input
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleFile}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-camera-video-fill"></i>
              Promo Video
            </label>

            <input
              type="file"
              name="promo_video"
              accept="video/*"
              onChange={handleFile}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              Featured Event
            </label>
          </div>

          <div className="full-width">
            <button type="submit" className="submit-btn">
              <i className="bi bi-check-circle-fill"></i>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
