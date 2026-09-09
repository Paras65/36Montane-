// models/Trekking.js
const mongoose = require('mongoose');

const trekkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableSlots: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  participants: {
    type: [String],  // List of participant names
    default: []
  }
});

const Trekking = mongoose.model('Trekking', trekkingSchema);

module.exports = Trekking;
