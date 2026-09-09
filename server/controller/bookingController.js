const Booking = require('../models/Booking');

// GET all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('tripId').sort({ bookingDate: -1 });
        res.status(200).json(bookings || []);
    } catch (err) {
        console.error('getAllBookings error:', err);
        res.status(500).json({ message: 'Error fetching bookings', error: err.message });
    }
};

// CREATE a booking
const createBooking = async (req, res) => {
    const { name, email, numberOfPeople, tripId, status } = req.body;

    if (!name || !email || !numberOfPeople || !tripId) {
        return res.status(400).json({ error: "Name, email, numberOfPeople, and tripId are required" });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const peopleCount = parseInt(numberOfPeople, 10);

    if (trimmedName.length > 100) {
        return res.status(400).json({ error: "Name cannot exceed 100 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: "Invalid email address format" });
    }

    if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 100) {
        return res.status(400).json({ error: "Number of people must be a valid number between 1 and 100" });
    }

    const allowedStatuses = ['Confirmed', 'Pending', 'Cancelled'];
    const bookingStatus = allowedStatuses.includes(status) ? status : 'Confirmed';

    try {
        const booking = new Booking({
            name: trimmedName,
            email: trimmedEmail,
            numberOfPeople: peopleCount,
            tripId,
            status: bookingStatus,
            bookingDate: new Date()
        });

        await booking.save();
        res.status(201).json({
            message: "Booking confirmed successfully",
            booking
        });
    } catch (err) {
        console.error('createBooking error:', err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// UPDATE booking status
const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking status updated', booking });
    } catch (err) {
        console.error('updateBookingStatus error:', err);
        res.status(500).json({ message: 'Error updating booking status' });
    }
};

// DELETE a booking
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Booking.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully', id });
    } catch (err) {
        console.error('deleteBooking error:', err);
        res.status(500).json({ message: 'Error deleting booking' });
    }
};

module.exports = {
    getAllBookings,
    createBooking,
    updateBookingStatus,
    deleteBooking
};

