const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST route to generate poster
app.post("/api/events", upload.none(), async (req, res) => {
  const { eventName, clubName, venue, date, registrationLink } = req.body;

  try {
    const response = await axios.post(
      "https://api.bannerbear.com/v2/images",
      {
        template: "wvgMNmDoppqGbyARK0", // Replace with your Bannerbear template UID
        modifications: [
          { name: "event_name", text: eventName },
          { name: "club_name", text: clubName },
          { name: "venue", text: venue },
          { name: "date", text: date },
          { name: "registration_link", text: registrationLink },
        ],
      },
      {
        headers: {
          Authorization: `Bearer bb_pr_037205d05254099e5435e92d17d415`, // Replace with your Bannerbear API key
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data.image_url;
    res.status(200).json({ message: "Poster generated", posterUrl: imageUrl });
  } catch (error) {
    console.error("Poster generation failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Poster generation failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
