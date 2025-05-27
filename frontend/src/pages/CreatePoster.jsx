import React, { useState } from "react";
import axios from "axios";
import "./CreatePoster.css"; // Link the CSS file

function UploadForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    clubName: "",
    venue: "",
    date: "",
    registrationLink: "",
    posterImage: null,
  });
  const [posterUrl, setPosterUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  // Step 1: Generate the poster via Bannerbear
  const bannerbearPayload = {
    template: "wvgMNmDoppqGbyARK0", // your template UID
    modifications: [
      { name: "event_name", text: formData.eventName },
      { name: "club_name", text: formData.clubName },
      { name: "venue", text: formData.venue },
      { name: "date", text: formData.date },
      { name: "regr_link", text: formData.registrationLink },
    ]
  };

  try {
    const response = await axios.post("https://api.bannerbear.com/v2/images", bannerbearPayload, {
      headers: {
        Authorization: `Bearer bb_pr_037205d05254099e5435e92d17d415`, // use 'Bearer' prefix
        "Content-Type": "application/json"
      }
    });

    const imageUrl = response.data.image_url;
    setPosterUrl(imageUrl);

    // Step 2: Send to your backend with poster URL
    const backendPayload = {
      ...formData,
      generatedPosterUrl: imageUrl, // include the generated poster URL
    };

    // Optional: if you're using FormData because you're uploading images manually
    const data = new FormData();
    Object.entries(backendPayload).forEach(([key, value]) => {
      data.append(key, value);
    });

    await axios.post("http://localhost:5000/api/events", data); // ✅ update your backend URL here
    alert("Event uploaded and poster generated!");

  } catch (error) {
  console.error("Bannerbear Error:", error.response?.data || error.message);
  alert("Poster generation failed.");
}
};

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Create Poster</h2>

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

      {/* <div className="form-row">
        <label htmlFor="posterImage">Poster Image</label>
        <input type="file" name="posterImage" id="posterImage" accept="image/*" required onChange={handleChange} />
      </div> */}

      <div className="form-row button-row">
        <button type="submit" className="coolBeans">Submit</button>
      </div>
      {posterUrl && (
      <div className="poster-preview">
        <h3>Poster Preview</h3>
        <img src={posterUrl} alt="Generated Poster" className="preview-image" />
        <a href={posterUrl} download className="download-link">Download Poster</a>
      </div>
    )}
    </form>
    
  );
}

export default UploadForm;
