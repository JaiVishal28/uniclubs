import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css"; // Link the CSS file

function UploadForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    clubName: "",
    venue: "",
    date: "",
    registrationLink: "",
    posterImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
  });

  try {
    await axios.post("http://localhost:5000/api/events", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Event uploaded!");
  } catch (err) {
    console.error(err);
    alert("Upload failed.");
  }
};

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload Event</h2>

      <div className="form-row">
        <label htmlFor="eventName">Event Name</label>
        <input type="text" name="eventName" id="eventName" required onChange={handleChange} />
      </div>

      <div className="form-row">
        <label htmlFor="clubName">Club Name</label>
        <input type="text" name="clubName" id="clubName" required onChange={handleChange} />
      </div>

      <div className="form-row">
        <label htmlFor="venue">Venue</label>
        <input type="text" name="venue" id="venue" required onChange={handleChange} />
      </div>

      <div className="form-row">
        <label htmlFor="date">Date</label>
        <input type="date" name="date" id="date" required onChange={handleChange} />
      </div>

      <div className="form-row">
        <label htmlFor="registrationLink">Registration Link</label>
        <input type="text" name="registrationLink" id="registrationLink" onChange={handleChange} />
      </div>

      <div className="form-row">
        <label htmlFor="posterImage">Poster Image</label>
        <input type="file" name="posterImage" id="posterImage" accept="image/*" required onChange={handleChange} />
      </div>

      <div className="form-row button-row">
        <button type="submit" className="coolBeans">Submit</button>
      </div>
    </form>
    
  );
}

export default UploadForm;
