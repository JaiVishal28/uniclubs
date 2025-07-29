import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // selected event for preview

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handlePosterClick = (event) => {
    setSelectedEvent(event);
  };

  const closePreview = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="poster-grid">
        {events.map((event) => {
          const fullImageUrl = `http://localhost:5000${event.posterUrl}`;
          return (
            <div
              key={event._id}
              className="poster-card"
              onClick={() => handlePosterClick(event)}
            >
              <img
                src={fullImageUrl}
                alt={event.eventName}
                className="poster-image"
              />
              <div className="poster-title">{event.eventName}</div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="full-image-preview" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:5000${selectedEvent.posterUrl}`}
              alt={selectedEvent.eventName}
            />
            <br></br>
            <button
              className="visit-link"
              onClick={() => window.open(selectedEvent.registrationLink, "_blank")}
            >
            Visit Registration Link
            </button>
            <button className="close-btn" onClick={closePreview}>✖</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
