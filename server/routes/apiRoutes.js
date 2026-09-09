// routes/apiRoutes.js
const express = require('express');
const router = express.Router();

const { getTripById, createTrip, getAllTrips, updateTrip, deleteTrip } = require('../controller/tripController');
const { postContact, getAllContacts, deleteContact } = require('../controller/contactController');
const { getGalleryByType, addGalleryItem, deleteGalleryItem } = require('../controller/galleryController');
const { getAllTrek, addTrek, getTrekById } = require('../controller/trekingController');
const { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle } = require('../controller/articleController');
const { getEventDetails, getAllEvents, createEvent, updateEvent, deleteEvent } = require('../controller/eventController');
const { getFilteredServices, createService, updateService, deleteService } = require('../controller/tripServiceController');
const { getAllBookings, createBooking, updateBookingStatus, deleteBooking } = require('../controller/bookingController');

// Trips
router.get('/featuredtrips', getAllTrips);
router.get('/gettrip/:id', getTripById);
router.post('/addtrip', createTrip);
router.put('/trips/:id', updateTrip);
router.delete('/trips/:id', deleteTrip);

// Services
router.get('/services', getFilteredServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Events
router.get('/event', getEventDetails);
router.get('/events', getAllEvents);
router.post('/event', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Articles / Blog
router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticleById);
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

// Gallery
router.get('/gallery/type', getGalleryByType);
router.post('/gallery/type', addGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// Contacts / Inquiries
router.post('/contact', postContact);
router.get('/contacts', getAllContacts);
router.delete('/contacts/:id', deleteContact);

// Bookings
router.get('/bookings', getAllBookings);
router.post('/booking', createBooking);
router.patch('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

// Legacy Treks endpoints (preserved for compatibility)
router.get('/treks', getAllTrek);
router.get('/trek/:id', getTrekById);
router.post('/addtrek', addTrek);

module.exports = router;
