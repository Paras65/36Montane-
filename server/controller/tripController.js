const Trip = require('../models/Trip');
const mongoose = require('mongoose');

// Get trip by ID
const getTripById = async (req, res) => {
    const tripId = req.params.id; // Access the id from the URL

    // Validate if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
        return res.status(400).json({ message: 'Invalid trip ID format.' });
    }

    try {
        const trip = await Trip.findById(tripId); // Fetch the trip by ID
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip); // Respond with the found trip
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create new trip
const createTrip = async (req, res) => {
    try {
        const newTrip = new Trip({ ...req.body });
        const savedTrip = await newTrip.save();
        res.json(savedTrip);
    } catch (err) {
        res.status(400).send('Bad Request');
    }
};

const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.json(trips || []);
    } catch (error) {
        console.error('getAllTrips error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update existing trip
const updateTrip = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await Trip.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error('updateTrip error:', err);
        res.status(500).json({ message: 'Failed to update trip' });
    }
};

// Delete a trip
const deleteTrip = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Trip.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json({ message: 'Trip deleted successfully', id });
    } catch (err) {
        console.error('deleteTrip error:', err);
        res.status(500).json({ message: 'Failed to delete trip' });
    }
};

module.exports = { getTripById, createTrip, getAllTrips, updateTrip, deleteTrip };
