// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');

const { getTripById, createTrip, getAllTrips, updateTrip, deleteTrip } = require('../controller/tripController');
const { postContact, getAllContacts, deleteContact } = require('../controller/contactController');
const { getGalleryByType, addGalleryItem, deleteGalleryItem } = require('../controller/galleryController');
const { getAllTrek, addTrek, getTrekById } = require('../controller/trekingController');
const { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle } = require('../controller/articleController');
const { getEventDetails, getAllEvents, createEvent, updateEvent, deleteEvent } = require('../controller/eventController');
const { getFilteredServices, createService, updateService, deleteService } = require('../controller/tripServiceController');
const { getAllBookings, createBooking, updateBookingStatus, deleteBooking } = require('../controller/bookingController');

// Trips (Public Reads, Admin Writes)
router.get('/featuredtrips', getAllTrips);
router.get('/gettrip/:id', getTripById);
router.post('/addtrip', authMiddleware, createTrip);
router.put('/trips/:id', authMiddleware, updateTrip);
router.delete('/trips/:id', authMiddleware, deleteTrip);

// Services (Public Reads, Admin Writes)
router.get('/services', getFilteredServices);
router.post('/services', authMiddleware, createService);
router.put('/services/:id', authMiddleware, updateService);
router.delete('/services/:id', authMiddleware, deleteService);

// Events (Public Reads, Admin Writes)
router.get('/event', getEventDetails);
router.get('/events', getAllEvents);
router.post('/event', authMiddleware, createEvent);
router.put('/events/:id', authMiddleware, updateEvent);
router.delete('/events/:id', authMiddleware, deleteEvent);

// Articles / Blog (Public Reads, Admin Writes)
router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticleById);
router.post('/articles', authMiddleware, createArticle);
router.put('/articles/:id', authMiddleware, updateArticle);
router.delete('/articles/:id', authMiddleware, deleteArticle);

// Gallery (Public Reads, Admin Writes)
router.get('/gallery/type', getGalleryByType);
router.post('/gallery/type', authMiddleware, addGalleryItem);
router.delete('/gallery/:id', authMiddleware, deleteGalleryItem);

// Contacts / Inquiries (Public Submission, Admin Reads & Deletes)
router.post('/contact', postContact);
router.get('/contacts', authMiddleware, getAllContacts);
router.delete('/contacts/:id', authMiddleware, deleteContact);

// Bookings (Public Booking Creation, Admin Management)
router.get('/bookings', authMiddleware, getAllBookings);
router.post('/booking', createBooking);
router.patch('/bookings/:id/status', authMiddleware, updateBookingStatus);
router.delete('/bookings/:id', authMiddleware, deleteBooking);

// Legacy Treks endpoints (preserved for compatibility)
router.get('/treks', getAllTrek);
router.get('/trek/:id', getTrekById);
router.post('/addtrek', authMiddleware, addTrek);

module.exports = router;
