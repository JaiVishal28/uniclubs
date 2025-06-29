import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="poster-grid">
      {events.map((event) => (
        <a
          key={event._id}
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="poster-card"
        >
          <img
            src={`http://localhost:5000${event.posterUrl}`}
            alt={event.eventName}
            className="poster-image"
          />
          <div className="poster-title">{event.eventName}</div>
        </a>
      ))}
    </div>
  );
};

export default Home;
