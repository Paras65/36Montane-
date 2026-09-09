const mongoose = require('mongoose');

// Define the trip schema
const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'photo'],
    required: true,
  },
  platform: {
    type: String,
    enum: ['youtube', 'instagram'],
  },
});

// Export the trip model
module.exports = mongoose.model('Gallery', TripSchema);
