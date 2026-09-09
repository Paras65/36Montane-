const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    sparse: true,
    unique: true,
  },
  name: {
    type: String,
    default: 'Admin User',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
