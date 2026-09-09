const mongoose = require('mongoose');

// Define the schema for Booking
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true }, // Reference to the Trip model
  status: { type: String, default: 'Confirmed' },
  bookingDate: { type: Date, default: Date.now }
});

// Create a model for the Booking schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
