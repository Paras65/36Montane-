const mongoose = require('mongoose');

const trekkingServiceSchema = new mongoose.Schema({
  title: String,
  description: String,
  detailLink: String,
});

module.exports = mongoose.model('TrekkingService', trekkingServiceSchema);
