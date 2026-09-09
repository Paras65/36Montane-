const Booking = require('../models/Booking');

// GET all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookingDate: -1 });
        res.status(200).json(bookings || []);
    } catch (err) {
        console.error('getAllBookings error:', err);
        res.status(500).json({ message: 'Error fetching bookings', error: err.message });
    }
};

// CREATE a booking
const createBooking = async (req, res) => {
    const { name, email, numberOfPeople, groupSize, tripId, service, serviceName, phone, travelDate, date, totalPrice, status } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPhone = phone ? String(phone).trim() : '';
    const resolvedTravelDate = travelDate || date || '';
    const resolvedServiceName = serviceName || service || '';
    const isValidHexId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    const resolvedTripId = isValidHexId(tripId) ? tripId : '675c9a8391b1dffb0e46bdf3';

    // Parse group size
    let peopleCount = parseInt(numberOfPeople || groupSize, 10);
    if (isNaN(peopleCount) || peopleCount < 1) {
        peopleCount = 1;
    }

    if (trimmedName.length > 100) {
        return res.status(400).json({ error: "Name cannot exceed 100 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: "Invalid email address format" });
    }

    const allowedStatuses = ['Confirmed', 'Pending', 'Cancelled'];
    const bookingStatus = allowedStatuses.includes(status) ? status : 'Confirmed';

    try {
        const booking = new Booking({
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            numberOfPeople: peopleCount,
            tripId: resolvedTripId,
            serviceName: resolvedServiceName,
            travelDate: resolvedTravelDate,
            totalPrice: Number(totalPrice) || 0,
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

