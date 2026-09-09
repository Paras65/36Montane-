import { useState, useEffect } from 'react';
import { generateInquiryWhatsAppUrl } from '../utils/whatsapp';
import { mockReviews } from '../data/mockData';
import { safeFetchJson, safeParseJson } from '../utils/safeFetch';

const PRESET_PHOTOS = [
  {
    label: '🌌 Campfire & Stars',
    url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '🌊 Secret Waterfall',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '⛰️ Summit Sunrise',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '🏕️ Forest Valley Camp',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: '🤝 Corporate Team Tribe',
    url: 'https://images.unsplash.com/photo-1523906834658-6e2b32c950cb?auto=format&fit=crop&w=800&q=80',
  },
];

const TRAIL_OPTIONS = [
  'Saroda Dadar Forest Trail & Camp',
  'Bastar Secret Waterfalls Expedition',
  'Maikal Hills Ridge Expedition',
  'Bhoramdev Valley Trek & Heritage',
  'Kanger Valley Caves & Wildlife Trail',
  'Corporate Team Offsite & Plateau Camp',
];

const TrekkerStories = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 4.9, distribution: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [only5Stars, setOnly5Stars] = useState(false);

  // Modal & submission state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState(null);

  // Liked items tracking
  const [likedIds, setLikedIds] = useState(new Set());

  // Review Form
  const [form, setForm] = useState({
    name: '',
    location: '',
    tripTitle: TRAIL_OPTIONS[0],
    rating: 5,
    comment: '',
    photoUrl: PRESET_PHOTOS[0].url,
    travelDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  });
  const [hoverRating, setHoverRating] = useState(0);

  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  const fetchReviews = async () => {
    try {
      const data = await safeFetchJson(`${baseUrl}/api/reviews`, {}, null);
      if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
        setReviews(data.reviews);
        if (data.stats) setStats(data.stats);
      } else {
        setReviews(mockReviews);
        setStats({ totalReviews: mockReviews.length, averageRating: 4.9, distribution: { 5: mockReviews.length } });
      }
    } catch (err) {
      console.warn('Error fetching trekker stories, using fallback:', err);
      setReviews(mockReviews);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    if (likedIds.has(id)) return; // Already liked in this session

    // Optimistic UI update
    setLikedIds((prev) => new Set(prev).add(id));
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );

    try {
      await fetch(`${baseUrl}/api/reviews/${id}/like`, { method: 'POST' }).catch(() => null);
    } catch (err) {
      console.error('Failed to register like:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.name.trim() || !form.comment.trim()) {
      setErrorMessage('Please fill in your name and review story.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const parsed = await safeParseJson(res, null);
      if (!res.ok || !parsed) {
        throw new Error(parsed?.message || 'Failed to submit review');
      }

      setReviews((prev) => [parsed, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setForm({
          name: '',
          location: '',
          tripTitle: TRAIL_OPTIONS[0],
          rating: 5,
          comment: '',
          photoUrl: PRESET_PHOTOS[0].url,
          travelDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        });
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const categories = [
    'All',
    'Saroda Dadar',
    'Bastar',
    'Maikal',
    'Bhoramdev',
    'Corporate',
  ];

  const filteredReviews = reviews.filter((r) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (r.tripTitle || '').toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesStars = !only5Stars || (r.rating || 5) >= 5;
    return matchesCategory && matchesStars;
  });

  const ratingDescriptions = {
    1: 'Disappointing',
    2: 'Below Average',
    3: 'Good Experience',
    4: 'Great Adventure!',
    5: 'Unforgettable! (Pure Magic)',
  };

  return (
    <section id="trekker-stories" className="py-20 bg-[#FAF6F0] relative overflow-hidden">
      {/* Subtle tribal pattern accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#11261D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C84B31]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#11261D]/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11261D]/10 border border-[#11261D]/20 text-xs font-bold uppercase tracking-wider text-[#11261D] mb-3">
              <span>🌟</span>
              <span>Raw Memories & Social Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-[#11261D] tracking-tight">
              Trekker Stories & Community Wall
            </h2>
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl mt-2 font-sans">
              Real voices and unedited photos from wanderers who walked the remote forests, waterfalls, and high plateaus of Chhattisgarh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-[#C84B31] hover:bg-[#b03d25] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            >
              <span>✍️</span>
              <span>Share Your Story</span>
            </button>
          </div>
        </div>

        {/* Community Trust Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-[#11261D]/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl font-black text-amber-600">
              ★
            </div>
            <div>
              <div className="text-2xl font-black text-[#11261D]">{stats.averageRating || '4.9'} / 5.0</div>
              <div className="text-xs text-gray-500 font-medium">From {stats.totalReviews || reviews.length}+ Verified Trekkers</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#11261D]/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl">
              🛡️
            </div>
            <div>
              <div className="text-sm font-bold text-[#11261D]">100% Certified</div>
              <div className="text-xs text-gray-500">Local Indigenous Wilderness Guides</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#11261D]/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl">
              🌿
            </div>
            <div>
              <div className="text-sm font-bold text-[#11261D]">Zero Footprint</div>
              <div className="text-xs text-gray-500">Strict Leave-No-Trace Policy</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#11261D]/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <div className="text-sm font-bold text-[#11261D]">Authentic Culture</div>
              <div className="text-xs text-gray-500">Hot Angakar Roti & Campfires</div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-3.5 rounded-2xl border border-[#11261D]/10 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#11261D] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'All' ? '🌲 All Trails' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnly5Stars(!only5Stars)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                only5Stars
                  ? 'bg-amber-100 border-amber-400 text-amber-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>★</span>
              <span>5-Star Only</span>
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredReviews.length} stories
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-[#11261D] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-600">Gathering trail memories...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#11261D]/10 p-8">
            <span className="text-4xl block mb-2">🏕️</span>
            <h3 className="text-lg font-bold text-[#11261D]">No stories found in this category</h3>
            <p className="text-sm text-gray-500 mt-1">Be the first explorer to share your review for this expedition!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-5 py-2.5 bg-[#C84B31] text-white text-sm font-bold rounded-xl shadow hover:bg-[#b03d25]"
            >
              Share Your Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => {
              const isLiked = likedIds.has(rev._id);
              const initials = (rev.name || 'T')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={rev._id}
                  className="bg-white rounded-2xl border border-[#11261D]/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header */}
                  <div>
                    {/* Optional Photo Header */}
                    {rev.photoUrl && (
                      <div
                        className="relative h-48 w-full overflow-hidden cursor-pointer bg-slate-900"
                        onClick={() => setLightboxImage(rev.photoUrl)}
                      >
                        <img
                          src={rev.photoUrl}
                          alt={rev.tripTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <span className="absolute bottom-3 left-3 text-xs text-white/90 font-medium flex items-center gap-1">
                          <span>🔍</span> Click to zoom photo
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-[11px] font-semibold text-white">
                          📸 Trail Snap
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Author & Badge Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#11261D] to-[#1B4332] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#11261D] leading-tight">
                              {rev.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {rev.location || 'Chhattisgarh'}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                          <span>✓</span>
                          <span>{rev.badge || 'Verified'}</span>
                        </span>
                      </div>

                      {/* Stars & Trail Badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex text-amber-500 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < (rev.rating || 5) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-gray-400">·</span>
                        <span className="text-[11px] font-semibold text-[#C84B31] bg-[#C84B31]/10 px-2 py-0.5 rounded-md line-clamp-1">
                          {rev.tripTitle}
                        </span>
                      </div>

                      {/* Comment Quote */}
                      <p className="text-sm text-gray-700 font-serif italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>{rev.travelDate || 'Recent Trek'}</span>

                    <button
                      onClick={(e) => handleLike(rev._id, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'bg-white text-gray-600 hover:text-rose-500 hover:bg-rose-50 border border-gray-200'
                      }`}
                      title="Mark review as helpful"
                    >
                      <span className={isLiked ? 'text-rose-500' : 'text-gray-400'}>
                        {isLiked ? '❤️' : '🤍'}
                      </span>
                      <span>{rev.likes || 0} Helpful</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WhatsApp Alumni & Guide Direct Connect Banner */}
        <div className="mt-16 bg-[#11261D] rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-[#D4A373]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4A373]">
              HAVE QUESTIONS ABOUT TRAIL CONDITIONS?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
              Talk to Our Certified Trail Leads
            </h3>
            <p className="text-sm text-gray-300 mt-2">
              Want to speak with a previous batch participant or get an exact packing breakdown for your upcoming weekend? Reach out directly.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href={generateInquiryWhatsAppUrl('Trekker Stories & Questions')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            >
              <span>💬</span>
              <span>WhatsApp Trail Lead (+91 96693 24552)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl font-bold"
            >
              ✕
            </button>
            <img
              src={lightboxImage}
              alt="Trekker Story Preview"
              className="rounded-2xl max-w-full max-h-[85vh] object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Share Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#11261D]/10 relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            >
              ✕
            </button>

            {submitSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#11261D]">
                  Thank You, Explorer!
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your story has been submitted and published to the 36 Montane community wall.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C84B31]">
                    COMMUNITY FEEDBACK
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#11261D] mt-1">
                    Share Your Trail Experience
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Help future travelers choose their expedition by sharing honest feedback and raw trail memories.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Your Trail Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex text-2xl text-amber-400 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setForm({ ...form, rating: star })}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-none transition-transform hover:scale-125"
                          >
                            {star <= (hoverRating || form.rating) ? '★' : '☆'}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {ratingDescriptions[hoverRating || form.rating]}
                      </span>
                    </div>
                  </div>

                  {/* Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#11261D] focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        City & State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Raipur, CG"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#11261D] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Trail & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Expedition Attended *
                      </label>
                      <select
                        value={form.tripTitle}
                        onChange={(e) => setForm({ ...form, tripTitle: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#11261D] focus:border-transparent outline-none bg-white"
                      >
                        {TRAIL_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Trek Month / Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sep 2026"
                        value={form.travelDate}
                        onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#11261D] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Story Comment */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Your Trail Story & Feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How was the camp? How were the local guides, food, and views? Share your honest experience..."
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#11261D] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Trail Photo Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Attach Trail Photo (Choose Preset or Custom URL)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                      {PRESET_PHOTOS.map((p) => (
                        <button
                          type="button"
                          key={p.label}
                          onClick={() => setForm({ ...form, photoUrl: p.url })}
                          className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                            form.photoUrl === p.url
                              ? 'border-[#C84B31] ring-2 ring-[#C84B31]/30 scale-95'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white text-center px-1">
                            {p.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <input
                      type="url"
                      placeholder="Or paste an image URL (optional)"
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 focus:ring-2 focus:ring-[#11261D] outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#11261D] hover:bg-[#1B4332] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Publishing Story...</span>
                        </>
                      ) : (
                        <>
                          <span>🏕️</span>
                          <span>Publish Trail Story</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrekkerStories;

