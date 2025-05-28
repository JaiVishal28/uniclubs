// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
eventName: String,
clubName: String,
venue: String,
date: String,
registrationLink: String,
posterUrl: String,
});

module.exports = mongoose.model("Event", EventSchema);