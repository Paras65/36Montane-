const mongoose = require('mongoose');

// Define the article schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullContent: {
    type: String,
    required: true
  }
});

// Create the model from the schema
const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
