// routes/events.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event");

// Configure multer storage to save files in 'uploads/' folder with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST /api/events - upload event info + poster image file
router.post("/", upload.single("posterImage"), async (req, res) => {
  const {
    eventName,
    clubName,
    venue,
    date,
    registrationLink,
    generatedPosterUrl, // received from frontend
  } = req.body;

  const posterFile = req.file;

  // ✅ Fix: Allow either uploaded file OR generatedPosterUrl
  if (!posterFile && !generatedPosterUrl) {
    return res.status(400).json({ error: "Poster image or generated URL is required" });
  }

  try {
    const posterUrl = posterFile
      ? `/uploads/${posterFile.filename}`
      : generatedPosterUrl;

    const newEvent = new Event({
      eventName,
      clubName,
      venue,
      date,
      registrationLink,
      posterUrl,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event saved!", posterUrl });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});


// GET /api/events - fetch all events sorted by date descending
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

module.exports = router;
