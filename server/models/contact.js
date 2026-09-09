const mongoose = require("mongoose");

// Contact Form Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  });

  
  const contact = mongoose.model('Contact', contactSchema);
  
  module.exports = contact;