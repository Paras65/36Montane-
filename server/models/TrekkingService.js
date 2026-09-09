const mongoose = require('mongoose');

const trekkingServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // Icon (store as URL or CSS class name)
  image: { type: String, required: true }, // Image URL
  link: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true }
});

const TrekkingService = mongoose.model('AllService', trekkingServiceSchema);

module.exports = TrekkingService;
