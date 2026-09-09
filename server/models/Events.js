// models/event.js

const mongoose = require('mongoose');

// Define the schema for the Mountain Hiking event
const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to the event image
    required: true,
  },
});

// Create a model from the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
