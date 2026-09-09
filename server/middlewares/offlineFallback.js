// offlineFallback.js - Responsive mock data layer when MongoDB is not connected
const jwt = require('jsonwebtoken');
const { getIsConnected } = require('../config/db');
const { trips, services, events, galleryItems, articles, bookings, contacts, reviews } = require('../data/seedData');

const getJwtSecret = () => process.env.JWT_SECRET || '36montane_super_secret_jwt_key_2026';

// In-memory data store for offline development
let inMemoryTrips = trips.map(t => ({ ...t }));
let inMemoryServices = services.map(s => ({ ...s }));
let inMemoryEvents = events.map(e => ({ ...e }));
let inMemoryGallery = galleryItems.map(g => ({ ...g }));
let inMemoryArticles = articles.map(a => ({ ...a }));
let inMemoryBookings = bookings.map(b => ({ ...b }));
let inMemoryContacts = contacts.map(c => ({ ...c }));
let inMemoryReviews = (reviews || []).map(r => ({ ...r }));

const verifyAuth = (req) => {
  let token = req.header('Authorization');
  if (!token) return false;
  if (token.startsWith('Bearer ')) token = token.slice(7).trim();
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return false;
  }
};

const offlineFallback = (req, res, next) => {
  // If MongoDB is connected, pass through to actual Mongoose controllers
  if (getIsConnected()) {
    return next();
  }

  const { method, path, query, body } = req;

  // Protected administrative route check
  const isProtectedAdminRoute =
    (method === 'GET' && (path === '/contacts' || path === '/bookings' || path === '/reviews/all')) ||
    (method === 'POST' && ['/addtrip', '/services', '/event', '/articles', '/gallery/type', '/addtrek'].includes(path)) ||
    (method === 'PUT' && (path.startsWith('/trips/') || path.startsWith('/services/') || path.startsWith('/events/') || path.startsWith('/articles/'))) ||
    (method === 'PATCH' && (path.startsWith('/bookings/') || path.startsWith('/reviews/'))) ||
    (method === 'DELETE' && (path.startsWith('/trips/') || path.startsWith('/services/') || path.startsWith('/events/') || path.startsWith('/articles/') || path.startsWith('/gallery/') || path.startsWith('/contacts/') || path.startsWith('/bookings/') || path.startsWith('/reviews/')));

  if (isProtectedAdminRoute && !verifyAuth(req)) {
    return res.status(401).json({ message: 'Authentication required for administrative actions' });
  }

  // --- AUTH FALLBACK ---
  if (path === '/auth/login' && method === 'POST') {
    const { username, email, password } = body;
    const id = username || email;
    if (id === 'admin' && password === 'admin123') {
      const dummyUser = { id: 'admin-001', username: 'admin', email: 'admin@36montane.com', role: 'admin', name: 'Administrator' };
      const token = jwt.sign(dummyUser, getJwtSecret(), { expiresIn: '24h' });
      return res.status(200).json({ token, user: dummyUser });
    }
    return res.status(400).json({ message: 'Invalid credentials. Use admin / admin123' });
  }

  if (path === '/auth/me' && method === 'GET') {
    return res.status(200).json({
      user: { id: 'admin-001', username: 'admin', email: 'admin@36montane.com', role: 'admin', name: 'Administrator' }
    });
  }

  // --- TRIPS ---
  // GET /featuredtrips
  if (method === 'GET' && path === '/featuredtrips') {
    return res.status(200).json(inMemoryTrips);
  }

  // GET /gettrip/:id
  if (method === 'GET' && path.startsWith('/gettrip/')) {
    const id = path.replace('/gettrip/', '');
    const trip = inMemoryTrips.find(t => t._id === id) || inMemoryTrips[0];
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    return res.status(200).json(trip);
  }

  // POST /addtrip
  if (method === 'POST' && path === '/addtrip') {
    const newTrip = { _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`, ...body };
    inMemoryTrips.unshift(newTrip);
    return res.status(201).json(newTrip);
  }

  // PUT /trips/:id
  if (method === 'PUT' && path.startsWith('/trips/')) {
    const id = path.replace('/trips/', '');
    const index = inMemoryTrips.findIndex(t => t._id === id);
    if (index === -1) return res.status(404).json({ message: 'Trip not found' });
    inMemoryTrips[index] = { ...inMemoryTrips[index], ...body };
    return res.status(200).json(inMemoryTrips[index]);
  }

  // DELETE /trips/:id
  if (method === 'DELETE' && path.startsWith('/trips/')) {
    const id = path.replace('/trips/', '');
    inMemoryTrips = inMemoryTrips.filter(t => t._id !== id);
    return res.status(200).json({ message: 'Trip deleted successfully', id });
  }

  // --- SERVICES ---
  // GET /services
  if (method === 'GET' && path === '/services') {
    let result = [...inMemoryServices];
    if (query.category && query.category !== 'All') {
      result = result.filter(s => s.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(s => 
        (s.title && s.title.toLowerCase().includes(q)) || 
        (s.description && s.description.toLowerCase().includes(q))
      );
    }
    return res.status(200).json(result);
  }

  // POST /services
  if (method === 'POST' && path === '/services') {
    const newService = { _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`, ...body };
    inMemoryServices.unshift(newService);
    return res.status(201).json(newService);
  }

  // PUT /services/:id
  if (method === 'PUT' && path.startsWith('/services/')) {
    const id = path.replace('/services/', '');
    const index = inMemoryServices.findIndex(s => s._id === id);
    if (index === -1) return res.status(404).json({ message: 'Service not found' });
    inMemoryServices[index] = { ...inMemoryServices[index], ...body };
    return res.status(200).json(inMemoryServices[index]);
  }

  // DELETE /services/:id
  if (method === 'DELETE' && path.startsWith('/services/')) {
    const id = path.replace('/services/', '');
    inMemoryServices = inMemoryServices.filter(s => s._id !== id);
    return res.status(200).json({ message: 'Service deleted successfully', id });
  }

  // --- EVENTS ---
  // GET /events
  if (method === 'GET' && path === '/events') {
    return res.status(200).json(inMemoryEvents);
  }

  // GET /event
  if (method === 'GET' && path === '/event') {
    return res.status(200).json(inMemoryEvents[0] || {});
  }

  // POST /event
  if (method === 'POST' && path === '/event') {
    const newEvent = { _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`, ...body };
    inMemoryEvents.unshift(newEvent);
    return res.status(201).json(newEvent);
  }

  // PUT /events/:id
  if (method === 'PUT' && path.startsWith('/events/')) {
    const id = path.replace('/events/', '');
    const index = inMemoryEvents.findIndex(e => e._id === id);
    if (index === -1) return res.status(404).json({ message: 'Event not found' });
    inMemoryEvents[index] = { ...inMemoryEvents[index], ...body };
    return res.status(200).json(inMemoryEvents[index]);
  }

  // DELETE /events/:id
  if (method === 'DELETE' && path.startsWith('/events/')) {
    const id = path.replace('/events/', '');
    inMemoryEvents = inMemoryEvents.filter(e => e._id !== id);
    return res.status(200).json({ message: 'Event deleted successfully', id });
  }

  // --- GALLERY ---
  // GET /gallery/type
  if (method === 'GET' && path === '/gallery/type') {
    let result = [...inMemoryGallery];
    if (query.type && ['photo', 'video'].includes(query.type)) {
      result = result.filter(item => item.type === query.type);
    }
    return res.status(200).json(result);
  }

  // POST /gallery/type
  if (method === 'POST' && path === '/gallery/type') {
    const newItem = { _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`, ...body };
    inMemoryGallery.unshift(newItem);
    return res.status(201).json(newItem);
  }

  // DELETE /gallery/:id
  if (method === 'DELETE' && path.startsWith('/gallery/')) {
    const id = path.replace('/gallery/', '');
    inMemoryGallery = inMemoryGallery.filter(g => g._id !== id);
    return res.status(200).json({ message: 'Gallery item deleted successfully', id });
  }

  // --- ARTICLES ---
  // GET /articles
  if (method === 'GET' && path === '/articles') {
    return res.status(200).json(inMemoryArticles);
  }

  // GET /articles/:id
  if (method === 'GET' && path.startsWith('/articles/')) {
    const id = path.replace('/articles/', '');
    const article = inMemoryArticles.find(a => a._id === id) || inMemoryArticles[0];
    if (!article) return res.status(404).json({ message: 'Article not found' });
    return res.status(200).json(article);
  }

  // POST /articles
  if (method === 'POST' && path === '/articles') {
    const newArticle = { _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`, ...body, date: new Date() };
    inMemoryArticles.unshift(newArticle);
    return res.status(201).json({ message: 'Article created successfully!', article: newArticle });
  }

  // PUT /articles/:id
  if (method === 'PUT' && path.startsWith('/articles/')) {
    const id = path.replace('/articles/', '');
    const index = inMemoryArticles.findIndex(a => a._id === id);
    if (index === -1) return res.status(404).json({ message: 'Article not found' });
    inMemoryArticles[index] = { ...inMemoryArticles[index], ...body };
    return res.status(200).json(inMemoryArticles[index]);
  }

  // DELETE /articles/:id
  if (method === 'DELETE' && path.startsWith('/articles/')) {
    const id = path.replace('/articles/', '');
    inMemoryArticles = inMemoryArticles.filter(a => a._id !== id);
    return res.status(200).json({ message: 'Article deleted successfully', id });
  }

  // --- CONTACTS ---
  // GET /contacts
  if (method === 'GET' && path === '/contacts') {
    return res.status(200).json(inMemoryContacts);
  }

  // POST /contact
  if (method === 'POST' && path === '/contact') {
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }
    const contact = { _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`, ...body, createdAt: new Date() };
    inMemoryContacts.unshift(contact);
    return res.status(200).json({ message: 'Your message has been saved successfully!' });
  }

  // DELETE /contacts/:id
  if (method === 'DELETE' && path.startsWith('/contacts/')) {
    const id = path.replace('/contacts/', '');
    inMemoryContacts = inMemoryContacts.filter(c => c._id !== id);
    return res.status(200).json({ message: 'Inquiry deleted successfully', id });
  }

  // --- BOOKINGS ---
  // GET /bookings
  if (method === 'GET' && path === '/bookings') {
    return res.status(200).json(inMemoryBookings);
  }

  // POST /booking
  if (method === 'POST' && path === '/booking') {
    const { name, email, numberOfPeople, groupSize, tripId, service, serviceName, phone, travelDate, date, totalPrice, status } = body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }
    let peopleCount = parseInt(numberOfPeople || groupSize, 10);
    if (isNaN(peopleCount) || peopleCount < 1) peopleCount = 1;

    const booking = {
      _id: `6581f1b2c45e12345678${Date.now().toString().slice(-4)}`,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      numberOfPeople: peopleCount,
      tripId: tripId || serviceName || service || '36-montane-adventure',
      serviceName: serviceName || service || '',
      travelDate: travelDate || date || '',
      totalPrice: Number(totalPrice) || 0,
      status: status || 'Confirmed',
      bookingDate: new Date(),
    };
    inMemoryBookings.unshift(booking);
    return res.status(201).json({ message: 'Booking confirmed', booking });
  }

  // PATCH /bookings/:id/status
  if (method === 'PATCH' && path.startsWith('/bookings/') && path.endsWith('/status')) {
    const id = path.replace('/bookings/', '').replace('/status', '');
    const booking = inMemoryBookings.find(b => b._id === id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = body.status || 'Confirmed';
    return res.status(200).json({ message: 'Booking status updated', booking });
  }

  // DELETE /bookings/:id
  if (method === 'DELETE' && path.startsWith('/bookings/')) {
    const id = path.replace('/bookings/', '');
    inMemoryBookings = inMemoryBookings.filter(b => b._id !== id);
    return res.status(200).json({ message: 'Booking deleted successfully', id });
  }

  // --- REVIEWS / STORIES ---
  // GET /reviews (Public approved reviews with stats)
  if (method === 'GET' && path === '/reviews') {
    const approved = inMemoryReviews.filter(r => r.isApproved !== false);
    const totalReviews = approved.length;
    let averageRating = 5.0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = approved.reduce((acc, r) => {
        const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
        distribution[star] = (distribution[star] || 0) + 1;
        return acc + (r.rating || 5);
      }, 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
    }

    return res.status(200).json({
      reviews: approved,
      stats: {
        totalReviews,
        averageRating,
        distribution,
      },
    });
  }

  // GET /reviews/all (Admin all reviews)
  if (method === 'GET' && path === '/reviews/all') {
    return res.status(200).json(inMemoryReviews);
  }

  // POST /reviews (Submit new review)
  if (method === 'POST' && path === '/reviews') {
    const { name, location, tripTitle, rating, comment, photoUrl, travelDate } = body;
    if (!name || !tripTitle || !comment) {
      return res.status(400).json({ message: 'Name, expedition title, and feedback are required.' });
    }
    const newRev = {
      _id: `6581f1b2c45e1234567890${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      location: location ? location.trim() : 'Chhattisgarh',
      tripTitle: tripTitle.trim(),
      rating: Number(rating) || 5,
      comment: comment.trim(),
      photoUrl: photoUrl || '',
      travelDate: travelDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      badge: 'Verified Trekker',
      isApproved: true,
      likes: 0,
      createdAt: new Date(),
    };
    inMemoryReviews.unshift(newRev);
    return res.status(201).json(newRev);
  }

  // POST /reviews/:id/like (Increment like)
  if (method === 'POST' && path.startsWith('/reviews/') && path.endsWith('/like')) {
    const id = path.replace('/reviews/', '').replace('/like', '');
    const rev = inMemoryReviews.find(r => r._id === id);
    if (!rev) return res.status(404).json({ message: 'Review not found' });
    rev.likes = (rev.likes || 0) + 1;
    return res.status(200).json({ id: rev._id, likes: rev.likes });
  }

  // PATCH /reviews/:id/status (Toggle approval)
  if (method === 'PATCH' && path.startsWith('/reviews/') && path.endsWith('/status')) {
    const id = path.replace('/reviews/', '').replace('/status', '');
    const rev = inMemoryReviews.find(r => r._id === id);
    if (!rev) return res.status(404).json({ message: 'Review not found' });
    if (typeof body.isApproved === 'boolean') {
      rev.isApproved = body.isApproved;
    } else {
      rev.isApproved = !rev.isApproved;
    }
    return res.status(200).json(rev);
  }

  // DELETE /reviews/:id (Delete review)
  if (method === 'DELETE' && path.startsWith('/reviews/')) {
    const id = path.replace('/reviews/', '');
    inMemoryReviews = inMemoryReviews.filter(r => r._id !== id);
    return res.status(200).json({ message: 'Review deleted successfully', id });
  }

  // Pass any unhandled requests to next router
  next();
};

module.exports = offlineFallback;
