const mongoose = require('mongoose');

// Define the schema for Trip
const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  difficulty: { type: String, required: true },
  maxGroupSize: { type: Number, required: true },
  inclusions: [String], // Array of strings for inclusions
  headerImage: { type: String, required: true },
  price: { type: Number, required: true }
});

// Create a model for the Trip schema
const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
