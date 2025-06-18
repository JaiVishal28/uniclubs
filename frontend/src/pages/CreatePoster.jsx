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

  const bannerbearPayload = {
    template: formData.template || "wvgMNmDoppqGbyARK0", // Default to Template 1 if not specified

    modifications: [
      { name: "event_name", text: formData.eventName },
      { name: "club_name", text: formData.clubName },
      { name: "venue", text: formData.venue },
      { name: "date", text: formData.date },
      { name: "regr_link", text: formData.registrationLink },
    ]
  };

  try {
    // Step 1: Request image generation
    const response = await axios.post("https://api.bannerbear.com/v2/images", bannerbearPayload, {
      headers: {
        Authorization: `Bearer bb_pr_037205d05254099e5435e92d17d415`,
        "Content-Type": "application/json"
      }
    });

    const imageUid = response.data.uid;
    console.log("Image UID:", imageUid);

    // Step 2: Poll Bannerbear for the generated image
    let imageUrl = null;
    for (let i = 0; i < 10; i++) {
      const statusResp = await axios.get(`https://api.bannerbear.com/v2/images/${imageUid}`, {
        headers: {
          Authorization: `Bearer bb_pr_037205d05254099e5435e92d17d415`,
        }
      });

      if (statusResp.data.image_url) {
        imageUrl = statusResp.data.image_url;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
    }

    if (!imageUrl) {
      alert("Image generation timed out.");
      return;
    }

    setPosterUrl(imageUrl);
    console.log("Poster URL:", imageUrl); // ✅ You should now see a real URL

    // Step 3: Send to backend
    const backendPayload = {
      ...formData,
      generatedPosterUrl: imageUrl,
    };

    const data = new FormData();
    Object.entries(backendPayload).forEach(([key, value]) => {
      data.append(key, value);
    });

    await axios.post("http://localhost:5000/api/events", data);
    alert("Event uploaded and poster generated!");
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
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
        <input type="text" name="registrationLink" id="registrationLink" required onChange={handleChange} />
      </div>
      <div className="form-row">
        <label htmlFor="template">Template</label>
        <select name="template" id="template" onChange={handleChange}>
          <option value="wvgMNmDoppqGbyARK0">Template 1</option>
          <option value="wXmzGBDakB2qZLN7gj">Template 2</option>
        </select>
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

    <button
      type="button"
      className="download-link"
      onClick={async () => {
        try {
          const response = await fetch(posterUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${formData.eventName}_poster.jpg`; // desired file name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (err) {
          alert("Failed to download image.");
          console.error(err);
        }
      }}
    >
      Download Poster
    </button>
  </div>
)}
    </form>
    
  );
}

export default UploadForm;
