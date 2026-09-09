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

    try {
        const booking = new Booking({
            name,
            email,
            numberOfPeople,
            tripId,
            status: status || 'Confirmed',
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

