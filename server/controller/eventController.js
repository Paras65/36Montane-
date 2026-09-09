// controllers/eventController.js
const Event = require('../models/Events'); // Import the Event model

// Controller function to handle GET request for event details
exports.getEventDetails = async (req, res) => {
  try {
    // Find event by some condition, here just taking the first one
    const event = await Event.findOne(); // You could also filter by event name or other criteria
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to create a new event (optional)
exports.createEvent = async (req, res) => {
  try {
    const { eventName, date, duration, description, location, image } = req.body;
    
    // Create new event instance using data from the request
    const newEvent = new Event({
      eventName,
      date,
      duration,
      description,
      location,
      image,
    });

    // Save to MongoDB
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events || []);
    } catch (error) {
      console.error('getAllEvents error:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('updateEvent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully', id });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};