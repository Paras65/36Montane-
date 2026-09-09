const mongoose = require('mongoose');

// Flexible schema for adventure bookings
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  numberOfPeople: { type: Number, required: true, default: 1 },
  tripId: { type: mongoose.Schema.Types.Mixed }, // Supports ObjectId or string service/trip name
  serviceName: { type: String },
  travelDate: { type: String },
  totalPrice: { type: Number },
  status: { type: String, default: 'Confirmed' },
  bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
