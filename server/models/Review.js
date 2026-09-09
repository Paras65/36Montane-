const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, default: 'Chhattisgarh' },
  tripTitle: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  comment: { type: String, required: true, trim: true },
  photoUrl: { type: String, default: '' },
  avatar: { type: String, default: '' },
  badge: { type: String, default: 'Verified Trekker' },
  travelDate: { type: String, default: '' },
  isApproved: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
