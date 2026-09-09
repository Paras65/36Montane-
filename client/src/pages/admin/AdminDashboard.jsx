import { useState, useEffect } from 'react';
import {
  generateCustomerWhatsAppUrl,
  generateContactReplyWhatsAppUrl,
} from '../../utils/whatsapp';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Data states
  const [trips, setTrips] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [articles, setArticles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [health, setHealth] = useState(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [tripForm, setTripForm] = useState({
    title: '',
    description: '',
    details: '',
    duration: 3,
    location: '',
    difficulty: 'Moderate',
    maxGroupSize: 12,
    inclusions: 'Tents & Sleeping Bags, Meals, Guide',
    headerImage: '',
    price: 3500,
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: 'Camping',
    location: '',
    duration: '2 Days / 1 Night',
    price: '₹2,500',
    rating: 4.8,
    image: '',
    icon: 'tent',
  });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    eventName: '',
    date: new Date().toISOString().split('T')[0],
    duration: 360,
    description: '',
    location: '',
    image: '',
  });

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    author: '36 Montane Team',
    shortDescription: '',
    fullContent: '',
  });

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    type: 'photo',
    mediaUrl: '',
    thumbnail: '',
    platform: 'instagram',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const exportBookingsToCSV = () => {
    if (!bookings || bookings.length === 0) {
      showNotification('No bookings to export', 'error');
      return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Email', 'Phone', 'Service / Trip', 'Group Size', 'Status', 'Travel Date', 'Price (INR)', 'Booking Date'];
    const rows = bookings.map(b => [
      `"${b._id || ''}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.email || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.serviceName || b.tripTitle || b.service || '').replace(/"/g, '""')}"`,
      b.numberOfPeople || 1,
      `"${b.status || 'Confirmed'}"`,
      `"${b.travelDate || (b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '')}"`,
      b.totalPrice || 0,
      `"${b.bookingDate ? new Date(b.bookingDate).toISOString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `36montane_bookings_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Bookings exported to CSV successfully!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showNotification('New password must be at least 6 characters long', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await authFetch(`${baseUrl}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      showNotification('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Secure authenticated fetch helper: attaches JWT token and auto-redirects on expiry
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      ...(options.headers || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      showNotification('Session expired. Redirecting to login...', 'error');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1200);
    }
    return response;
  };

  // Fetch all administrative data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        tripsRes,
        servicesRes,
        bookingsRes,
        eventsRes,
        articlesRes,
        galleryRes,
        contactsRes,
        reviewsRes,
        healthRes,
      ] = await Promise.all([
        authFetch(`${baseUrl}/api/featuredtrips`).catch(() => null),
        authFetch(`${baseUrl}/api/services`).catch(() => null),
        authFetch(`${baseUrl}/api/bookings`).catch(() => null),
        authFetch(`${baseUrl}/api/events`).catch(() => null),
        authFetch(`${baseUrl}/api/articles`).catch(() => null),
        authFetch(`${baseUrl}/api/gallery/type`).catch(() => null),
        authFetch(`${baseUrl}/api/contacts`).catch(() => null),
        authFetch(`${baseUrl}/api/reviews/all`).catch(() => null),
        authFetch(`${baseUrl}/api/health`).catch(() => null),
      ]);

      if (tripsRes?.ok) setTrips(await tripsRes.json());
      if (servicesRes?.ok) setServices(await servicesRes.json());
      if (bookingsRes?.ok) setBookings(await bookingsRes.json());
      if (eventsRes?.ok) setEvents(await eventsRes.json());
      if (articlesRes?.ok) setArticles(await articlesRes.json());
      if (galleryRes?.ok) setGallery(await galleryRes.json());
      if (contactsRes?.ok) setContacts(await contactsRes.json());
      if (reviewsRes?.ok) {
        const revData = await reviewsRes.json();
        setReviews(Array.isArray(revData) ? revData : revData.reviews || []);
      }
      if (healthRes?.ok) setHealth(await healthRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showNotification('Failed to fetch latest data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- TRIPS ACTIONS ---
  const handleSaveTrip = async (e) => {
    e.preventDefault();
    const payload = {
      ...tripForm,
      duration: Number(tripForm.duration),
      maxGroupSize: Number(tripForm.maxGroupSize),
      price: Number(tripForm.price),
      inclusions: Array.isArray(tripForm.inclusions)
        ? tripForm.inclusions
        : tripForm.inclusions.split(',').map((s) => s.trim()),
    };

    try {
      if (editingTrip) {
        const res = await authFetch(`${baseUrl}/api/trips/${editingTrip._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update trip');
        const updated = await res.json();
        setTrips(trips.map((t) => (t._id === updated._id ? updated : t)));
        showNotification('Trip updated successfully!');
      } else {
        const res = await authFetch(`${baseUrl}/api/addtrip`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to add trip');
        const created = await res.json();
        setTrips([created, ...trips]);
        showNotification('New trip created successfully!');
      }
      setIsTripModalOpen(false);
      setEditingTrip(null);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/trips/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete trip');
      setTrips(trips.filter((t) => t._id !== id));
      showNotification('Trip deleted successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const openTripModal = (trip = null) => {
    if (trip) {
      setEditingTrip(trip);
      setTripForm({
        title: trip.title || '',
        description: trip.description || '',
        details: trip.details || '',
        duration: trip.duration || 3,
        location: trip.location || '',
        difficulty: trip.difficulty || 'Moderate',
        maxGroupSize: trip.maxGroupSize || 12,
        inclusions: Array.isArray(trip.inclusions) ? trip.inclusions.join(', ') : '',
        headerImage: trip.headerImage || '',
        price: trip.price || 3500,
      });
    } else {
      setEditingTrip(null);
      setTripForm({
        title: '',
        description: '',
        details: '',
        duration: 3,
        location: '',
        difficulty: 'Moderate',
        maxGroupSize: 12,
        inclusions: 'Tents & Sleeping Bags, Meals & Snacks, Mountain Guide, First Aid Kit',
        headerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        price: 3500,
      });
    }
    setIsTripModalOpen(true);
  };

  // --- SERVICES ACTIONS ---
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        const res = await authFetch(`${baseUrl}/api/services/${editingService._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceForm),
        });
        if (!res.ok) throw new Error('Failed to update service');
        const updated = await res.json();
        setServices(services.map((s) => (s._id === updated._id ? updated : s)));
        showNotification('Service updated successfully!');
      } else {
        const res = await authFetch(`${baseUrl}/api/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceForm),
        });
        if (!res.ok) throw new Error('Failed to create service');
        const created = await res.json();
        setServices([created, ...services]);
        showNotification('New service added successfully!');
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices(services.filter((s) => s._id !== id));
      showNotification('Service deleted successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        title: service.title || '',
        description: service.description || '',
        category: service.category || 'Camping',
        location: service.location || '',
        duration: service.duration || '2 Days / 1 Night',
        price: service.price || '₹2,500',
        rating: service.rating || 4.8,
        image: service.image || '',
        icon: service.icon || 'tent',
      });
    } else {
      setEditingService(null);
      setServiceForm({
        title: '',
        description: '',
        category: 'Camping',
        location: 'Kawardha, CG',
        duration: '2 Days / 1 Night',
        price: '₹2,499',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        icon: 'tent',
      });
    }
    setIsServiceModalOpen(true);
  };

  // --- BOOKINGS ACTIONS ---
  const handleToggleBookingStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Confirmed' ? 'Pending' : 'Confirmed';
    try {
      const res = await authFetch(`${baseUrl}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: nextStatus } : b))
      );
      showNotification(`Booking updated to ${nextStatus}`);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete booking');
      setBookings(bookings.filter((b) => b._id !== id));
      showNotification('Booking deleted');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // --- EVENTS ACTIONS ---
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${baseUrl}/api/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventForm,
          duration: Number(eventForm.duration),
        }),
      });
      if (!res.ok) throw new Error('Failed to create event');
      const created = await res.json();
      setEvents([created, ...events]);
      setIsEventModalOpen(false);
      showNotification('Event created successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      setEvents(events.filter((e) => e._id !== id));
      showNotification('Event deleted successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // --- ARTICLES ACTIONS ---
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${baseUrl}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm),
      });
      if (!res.ok) throw new Error('Failed to create article');
      const created = await res.json();
      setArticles([created.article || created, ...articles]);
      setIsArticleModalOpen(false);
      showNotification('Article published successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete article');
      setArticles(articles.filter((a) => a._id !== id));
      showNotification('Article deleted');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // --- GALLERY ACTIONS ---
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${baseUrl}/api/gallery/type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm),
      });
      if (!res.ok) throw new Error('Failed to add media');
      const created = await res.json();
      setGallery([created, ...gallery]);
      setIsGalleryModalOpen(false);
      showNotification('Media item added to gallery!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete media item');
      setGallery(gallery.filter((g) => g._id !== id));
      showNotification('Media deleted successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // --- CONTACTS ACTIONS ---
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inquiry');
      setContacts(contacts.filter((c) => c._id !== id));
      showNotification('Inquiry deleted');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // --- REVIEWS / STORIES ACTIONS ---
  const handleToggleReviewStatus = async (id, currentStatus) => {
    try {
      const res = await authFetch(`${baseUrl}/api/reviews/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update review status');
      const updated = await res.json();
      setReviews(reviews.map((r) => (r._id === id ? { ...r, isApproved: updated.isApproved } : r)));
      showNotification(`Review marked as ${updated.isApproved ? 'Approved & Visible' : 'Hidden'}`);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this trekker review?')) return;
    try {
      const res = await authFetch(`${baseUrl}/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter((r) => r._id !== id));
      showNotification('Review deleted successfully');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊', count: null },
    { id: 'trips', label: 'Trips', icon: '🏔️', count: trips.length },
    { id: 'services', label: 'Services', icon: '⛺', count: services.length },
    { id: 'bookings', label: 'Bookings', icon: '🎫', count: bookings.length },
    { id: 'events', label: 'Events', icon: '📅', count: events.length },
    { id: 'articles', label: 'Articles', icon: '📝', count: articles.length },
    { id: 'gallery', label: 'Gallery', icon: '📸', count: gallery.length },
    { id: 'inquiries', label: 'Inquiries', icon: '📬', count: contacts.length },
    { id: 'reviews', label: 'Reviews', icon: '⭐', count: reviews.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-2 animate-bounce ${
            notification.type === 'error'
              ? 'bg-red-500/90 border-red-400 text-white'
              : 'bg-emerald-600/90 border-emerald-400 text-white'
          }`}
        >
          <span>{notification.type === 'error' ? '❌' : '✅'}</span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header & Quick Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard Control Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your expeditions, services, bookings, events & visitor inquiries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                health?.dbConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-slate-300">
              {health?.dbConnected ? 'MongoDB Live' : 'Offline Mock Mode'}
            </span>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            title="Change Admin Password"
          >
            <span>🔑</span>
            <span className="hidden sm:inline">Password</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin/login';
              }
            }}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition flex items-center gap-1.5"
            title="Log Out of Dashboard"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-4 border-b border-slate-800/80 scrollbar-none">
        {navItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div
                onClick={() => setActiveTab('trips')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏔️</span>
                  <span className="text-xs font-semibold text-emerald-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{trips.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Featured Trips</p>
              </div>

              <div
                onClick={() => setActiveTab('services')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⛺</span>
                  <span className="text-xs font-semibold text-blue-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{services.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Active Services</p>
              </div>

              <div
                onClick={() => setActiveTab('bookings')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🎫</span>
                  <span className="text-xs font-semibold text-purple-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{bookings.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Reservations</p>
              </div>

              <div
                onClick={() => setActiveTab('events')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📅</span>
                  <span className="text-xs font-semibold text-amber-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{events.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Upcoming Events</p>
              </div>

              <div
                onClick={() => setActiveTab('articles')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📝</span>
                  <span className="text-xs font-semibold text-rose-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{articles.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Published Articles</p>
              </div>

              <div
                onClick={() => setActiveTab('inquiries')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📬</span>
                  <span className="text-xs font-semibold text-cyan-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{contacts.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Inquiries</p>
              </div>

              <div
                onClick={() => setActiveTab('reviews')}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xs font-semibold text-amber-400">View</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{reviews.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Stories & Reviews</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-4">Quick Creation Shortcuts</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openTripModal()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Add New Expedition</span>
                </button>
                <button
                  onClick={() => openServiceModal()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Add Service</span>
                </button>
                <button
                  onClick={() => setIsEventModalOpen(true)}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Post Event</span>
                </button>
                <button
                  onClick={() => setIsArticleModalOpen(true)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Write Article</span>
                </button>
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Upload Media</span>
                </button>
              </div>
            </div>

            {/* Recent Bookings & Inquiries Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm">Recent Customer Bookings</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    View All →
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No bookings recorded yet</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 4).map((b) => (
                      <div
                        key={b._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{b.name}</p>
                          <p className="text-slate-400">{b.email} • {b.numberOfPeople} people</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Inquiries */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm">Recent Contact Form Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    View All →
                  </button>
                </div>
                {contacts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No inquiries received yet</p>
                ) : (
                  <div className="space-y-3">
                    {contacts.slice(0, 4).map((c) => (
                      <div
                        key={c._id}
                        className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.phone || c.email}</span>
                        </div>
                        <p className="text-slate-300 line-clamp-2">{c.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. TRIPS TAB ==================== */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trips by title or location..."
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-72"
              />
              <button
                onClick={() => openTripModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 self-start"
              >
                <span>+</span>
                <span>Add Expedition</span>
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Trip</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Duration</th>
                      <th className="p-3.5">Difficulty</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {trips
                      .filter(
                        (t) =>
                          t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.location?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((trip) => (
                        <tr key={trip._id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={trip.headerImage || 'https://via.placeholder.com/80'}
                              alt=""
                              className="w-12 h-10 rounded-lg object-cover bg-slate-800"
                            />
                            <div>
                              <p className="font-semibold text-white">{trip.title}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                                {trip.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-300">{trip.location}</td>
                          <td className="p-3.5 text-slate-300">{trip.duration} Days</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                              {trip.difficulty}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-emerald-400">₹{trip.price}</td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openTripModal(trip)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(trip._id)}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. SERVICES TAB ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Manage Camping, Trekking & Adventure services displayed across the portal
              </p>
              <button
                onClick={() => openServiceModal()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition"
              >
                + Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={service.image || 'https://via.placeholder.com/400'}
                      alt=""
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {service.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">{service.price}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{service.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                        {service.description}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        📍 {service.location} • ⏱️ {service.duration} • ⭐ {service.rating}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2 justify-end border-t border-slate-800/60 mt-2">
                    <button
                      onClick={() => openServiceModal(service)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. BOOKINGS TAB ==================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Adventure Reservations Manifest</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    {bookings.length} Total
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage reservations, send 1-click WhatsApp confirmations, or download passenger manifests
                </p>
              </div>
              <button
                onClick={exportBookingsToCSV}
                className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950"
              >
                <span>📥</span>
                <span>Export to CSV</span>
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Contact / Phone</th>
                      <th className="p-3.5">Service / Trip</th>
                      <th className="p-3.5">Group</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-semibold text-white">{booking.name}</td>
                        <td className="p-3.5 text-slate-300">
                          <div>{booking.email}</div>
                          {booking.phone && (
                            <span className="text-[11px] text-emerald-400 font-mono">{booking.phone}</span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <span className="font-medium text-white">{booking.serviceName || booking.tripTitle || booking.service || 'Adventure Trip'}</span>
                          {booking.totalPrice ? <div className="text-[11px] text-emerald-400 font-semibold">₹{booking.totalPrice}</div> : null}
                        </td>
                        <td className="p-3.5 text-slate-300">{booking.numberOfPeople} Persons</td>
                        <td className="p-3.5">
                          <button
                            onClick={() =>
                              handleToggleBookingStatus(booking._id, booking.status)
                            }
                            title="Click to toggle status"
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition ${
                              booking.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                          >
                            {booking.status} ⇄
                          </button>
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {booking.travelDate || (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A')}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.phone && (
                              <a
                                href={generateCustomerWhatsAppUrl(booking)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Send booking confirmation to customer via WhatsApp"
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <span>💬</span>
                                <span>WhatsApp</span>
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. EVENTS TAB ==================== */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">Upcoming treks and mountain hiking events</p>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition"
              >
                + Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex gap-4 items-start"
                >
                  <img
                    src={event.image || 'https://via.placeholder.com/120'}
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm mb-1">{event.eventName}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                      {event.description}
                    </p>
                    <p className="text-[11px] text-amber-400 mb-2">
                      📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}
                    </p>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition"
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 6. ARTICLES TAB ==================== */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">Travel stories, guides, and packing tips</p>
              <button
                onClick={() => setIsArticleModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition"
              >
                + Write Article
              </button>
            </div>

            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art._id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{art.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{art.shortDescription}</p>
                    <p className="text-[10px] text-slate-500 mt-2">By {art.author || '36 Montane'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteArticle(art._id)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-xl transition flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 7. GALLERY TAB ==================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">Visual photography and video stories</p>
              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition"
              >
                + Add Media
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video"
                >
                  <img
                    src={item.thumbnail || item.mediaUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
                    <span className="self-start px-2 py-0.5 rounded-full text-[9px] bg-slate-800 text-white uppercase font-bold">
                      {item.type}
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white font-medium line-clamp-1">{item.title}</p>
                      <button
                        onClick={() => handleDeleteGallery(item._id)}
                        className="p-1 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 8. INQUIRIES TAB ==================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center">No contact inquiries received yet</p>
            ) : (
              contacts.map((c) => (
                <div
                  key={c._id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <span className="text-xs text-emerald-400">{c.email}</span>
                      {c.phone && <span className="text-xs text-slate-400">• {c.phone}</span>}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{c.message}</p>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Received: {new Date(c.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {c.phone && (
                      <a
                        href={generateContactReplyWhatsAppUrl(c)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Reply to inquiry on WhatsApp"
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                      >
                        <span>💬</span>
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteContact(c._id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== 9. REVIEWS & STORIES TAB ==================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>⭐</span>
                  <span>Trekker Stories & Reviews Moderation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage traveler testimonials, toggle public visibility, or remove outdated reviews.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl">
                  {reviews.filter((r) => r.isApproved !== false).length} Approved & Live
                </span>
                <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-xl">
                  {reviews.filter((r) => r.isApproved === false).length} Hidden
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center">No trekker reviews or stories found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => {
                  const isApproved = rev.isApproved !== false;
                  return (
                    <div
                      key={rev._id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isApproved
                          ? 'bg-slate-900/80 border-slate-800'
                          : 'bg-slate-950/70 border-amber-500/30'
                      }`}
                    >
                      <div>
                        {/* Header info */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold text-sm flex items-center justify-center">
                              {(rev.name || 'T')[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                              <p className="text-xs text-slate-400">
                                {rev.location || 'Chhattisgarh'} • {rev.travelDate || 'Recent'}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isApproved
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {isApproved ? '✓ Live on Site' : 'Hidden'}
                          </span>
                        </div>

                        {/* Expedition & Stars */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-amber-400 text-sm">
                            {'★'.repeat(rev.rating || 5)}{'☆'.repeat(Math.max(0, 5 - (rev.rating || 5)))}
                          </span>
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                            {rev.tripTitle}
                          </span>
                        </div>

                        {/* Comment text */}
                        <p className="text-xs sm:text-sm text-slate-300 italic mb-3 leading-relaxed">
                          "{rev.comment}"
                        </p>

                        {/* Attached Photo Thumbnail */}
                        {rev.photoUrl && (
                          <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                            <img
                              src={rev.photoUrl}
                              alt="Review trail photo"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-white font-medium">
                              📸 Trail Photo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <span>❤️</span>
                          <span>{rev.likes || 0} Helpful Votes</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleReviewStatus(rev._id, isApproved)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                              isApproved
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isApproved ? 'Hide from Public' : 'Approve & Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-xl transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. Trip Modal */}
      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 my-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingTrip ? 'Edit Expedition Trip' : 'Add New Expedition Trip'}
            </h3>
            <form onSubmit={handleSaveTrip} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={tripForm.title}
                  onChange={(e) => setTripForm({ ...tripForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={tripForm.description}
                  onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Details</label>
                <textarea
                  rows={3}
                  value={tripForm.details}
                  onChange={(e) => setTripForm({ ...tripForm, details: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={tripForm.location}
                    onChange={(e) => setTripForm({ ...tripForm, location: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Difficulty</label>
                  <select
                    value={tripForm.difficulty}
                    onChange={(e) => setTripForm({ ...tripForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Easy to Moderate">Easy to Moderate</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={tripForm.duration}
                    onChange={(e) => setTripForm({ ...tripForm, duration: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Group</label>
                  <input
                    type="number"
                    value={tripForm.maxGroupSize}
                    onChange={(e) => setTripForm({ ...tripForm, maxGroupSize: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={tripForm.price}
                    onChange={(e) => setTripForm({ ...tripForm, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Header Image URL</label>
                <input
                  type="url"
                  value={tripForm.headerImage}
                  onChange={(e) => setTripForm({ ...tripForm, headerImage: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Inclusions (comma separated)</label>
                <input
                  type="text"
                  value={tripForm.inclusions}
                  onChange={(e) => setTripForm({ ...tripForm, inclusions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTripModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                >
                  Save Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Camping">Camping</option>
                    <option value="Trekking">Trekking</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price</label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={serviceForm.location}
                    onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Post New Event</h3>
            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Name</label>
                <input
                  type="text"
                  value={eventForm.eventName}
                  onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={eventForm.duration}
                    onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Publish Article</h3>
            <form onSubmit={handleSaveArticle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Author</label>
                <input
                  type="text"
                  value={articleForm.author}
                  onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={articleForm.shortDescription}
                  onChange={(e) => setArticleForm({ ...articleForm, shortDescription: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Content</label>
                <textarea
                  rows={4}
                  value={articleForm.fullContent}
                  onChange={(e) => setArticleForm({ ...articleForm, fullContent: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Gallery Item</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={galleryForm.type}
                    onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Platform</label>
                  <select
                    value={galleryForm.platform}
                    onChange={(e) => setGalleryForm({ ...galleryForm, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Media URL</label>
                <input
                  type="url"
                  value={galleryForm.mediaUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, mediaUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={galleryForm.thumbnail}
                  onChange={(e) => setGalleryForm({ ...galleryForm, thumbnail: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl"
                >
                  Add Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>🔑</span>
              <span>Change Admin Password</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update your administrative login credentials to maintain portal security.
            </p>
            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className={`px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition ${
                    isChangingPassword ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

