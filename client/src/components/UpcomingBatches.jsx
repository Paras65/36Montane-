import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerWhatsAppNumber } from '../utils/whatsapp';

// Helper to compute dynamic upcoming weekend dates so batches are never in the past
function getUpcomingWeekendDates(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay();
  // Find upcoming Saturday (day 6)
  let daysUntilSaturday = (6 - day + 7) % 7;
  if (daysUntilSaturday === 0 && now.getHours() >= 14) {
    // If it's already Saturday afternoon, move to next Saturday
    daysUntilSaturday = 7;
  }
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday + (offsetWeeks * 7));

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  const satFormatted = saturday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const sunFormatted = sunday.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    label: `${satFormatted} - ${sunFormatted}`,
    saturdayISO: saturday.toISOString().split('T')[0],
    isThisWeekend: offsetWeeks === 0,
    isNextWeekend: offsetWeeks === 1
  };
}

const UpcomingBatches = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const ownerWhatsApp = getOwnerWhatsAppNumber();

  // Dynamic upcoming batches generated with live calendar dates
  const batches = useMemo(() => {
    const datesW0 = getUpcomingWeekendDates(0);
    const datesW1 = getUpcomingWeekendDates(1);
    const datesW2 = getUpcomingWeekendDates(2);
    const datesW3 = getUpcomingWeekendDates(3);
    const datesW4 = getUpcomingWeekendDates(4);

    return [
      {
        id: 'batch-saroda-1',
        title: 'Saroda Dadar Sunset & Stargazing Camp',
        destination: 'Saroda Dadar Plateau',
        district: 'Kawardha',
        dates: datesW0.label,
        dateISO: datesW0.saturdayISO,
        isThisWeekend: datesW0.isThisWeekend,
        isNextWeekend: false,
        duration: '2 Days / 1 Night',
        category: 'Camping',
        price: 2499,
        totalSlots: 12,
        bookedSlots: 9,
        availableSlots: 3,
        urgencyBadge: '⚡ Only 3 Tents Left!',
        urgencyLevel: 'high',
        difficulty: 'Easy-Moderate',
        altitude: '850m',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        highlights: ['High-altitude tent camping', 'Baiga indigenous campfire dinner', 'Sunset ridge hiking', 'Night stargazing']
      },
      {
        id: 'batch-chitrakote-2',
        title: 'Chitrakote Indravati Gorge & Canyon Trek',
        destination: 'Chitrakote Falls',
        district: 'Bastar',
        dates: datesW1.label,
        dateISO: datesW1.saturdayISO,
        isThisWeekend: false,
        isNextWeekend: datesW1.isNextWeekend,
        duration: '2 Days / 1 Night',
        category: 'Trekking',
        price: 3200,
        totalSlots: 15,
        bookedSlots: 10,
        availableSlots: 5,
        urgencyBadge: '🔥 Filling Fast',
        urgencyLevel: 'medium',
        difficulty: 'Moderate',
        altitude: '580m',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        highlights: ['Gorge boat safari', 'Indravati canyon rim hike', 'Bastar tribal handicrafts', 'Riverside camp']
      },
      {
        id: 'batch-kanger-3',
        title: 'Kanger Valley Cave & Rainforest Expedition',
        destination: 'Kanger Valley Biosphere',
        district: 'Jagdalpur',
        dates: datesW2.label,
        dateISO: datesW2.saturdayISO,
        isThisWeekend: false,
        isNextWeekend: false,
        duration: '3 Days / 2 Nights',
        category: 'Trekking',
        price: 4800,
        totalSlots: 10,
        bookedSlots: 6,
        availableSlots: 4,
        urgencyBadge: '🌿 Limited Group (Max 10)',
        urgencyLevel: 'high',
        difficulty: 'Challenging',
        altitude: '630m',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        highlights: ['Kotumsar subterranean cave explore', 'Deep Sal forest canopy trek', 'Certified cave guides', 'Expedition tents']
      },
      {
        id: 'batch-mainpat-4',
        title: 'Mainpat Highlands & Bouncing Lawn Escape',
        destination: 'Mainpat Highlands',
        district: 'Surguja',
        dates: datesW3.label,
        dateISO: datesW3.saturdayISO,
        isThisWeekend: false,
        isNextWeekend: false,
        duration: '2 Days / 1 Night',
        category: 'Camping',
        price: 3600,
        totalSlots: 14,
        bookedSlots: 8,
        availableSlots: 6,
        urgencyBadge: '🏔️ Highland Special',
        urgencyLevel: 'low',
        difficulty: 'Moderate',
        altitude: '1,100m',
        image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
        highlights: ['Oscillating Jaljali bouncing wetland', 'Tiger Point waterfall trail', 'Tibetan temple circuit', 'Cold plateau night']
      },
      {
        id: 'batch-bhoramdev-5',
        title: 'Bhoramdev Valley Ancient Temple & Foothill Camp',
        destination: 'Bhoramdev Foothills',
        district: 'Kawardha',
        dates: datesW4.label,
        dateISO: datesW4.saturdayISO,
        isThisWeekend: false,
        isNextWeekend: false,
        duration: '2 Days / 1 Night',
        category: 'Camping',
        price: 2800,
        totalSlots: 16,
        bookedSlots: 9,
        availableSlots: 7,
        urgencyBadge: '✨ Open For Booking',
        urgencyLevel: 'low',
        difficulty: 'Easy',
        altitude: '720m',
        image: 'https://images.unsplash.com/photo-1600100397608-f010f4439c27?auto=format&fit=crop&w=800&q=80',
        highlights: ['11th-century carved temple tour', 'Lotus reservoir walking trail', 'Family & solo-female friendly', 'Acoustic campfire']
      }
    ];
  }, []);

  const filteredBatches = useMemo(() => {
    switch (selectedFilter) {
      case 'This Weekend':
        return batches.filter(b => b.isThisWeekend);
      case 'Next Weekend':
        return batches.filter(b => b.isNextWeekend);
      case 'Camping':
        return batches.filter(b => b.category === 'Camping');
      case 'Trekking':
        return batches.filter(b => b.category === 'Trekking');
      default:
        return batches;
    }
  }, [batches, selectedFilter]);

  const handleClaimSlot = (batch) => {
    navigate('/Detail', {
      state: {
        title: batch.title,
        price: batch.price,
        location: `${batch.destination}, ${batch.district}`,
        difficulty: batch.difficulty,
        duration: 2,
        maxGroupSize: batch.totalSlots,
        headerImage: batch.image,
        details: batch.highlights.join('. ') + '.',
        date: batch.dateISO
      }
    });
  };

  return (
    <section id="upcoming-batches" className="py-20 bg-gradient-to-b from-[#11261D] via-[#0E2219] to-[#0A1A13] text-white relative overflow-hidden border-y border-[#2D6A4F]/60">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#C84B31]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C84B31]/20 border border-[#E9C46A]/40 text-[#E9C46A] text-xs uppercase tracking-widest font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            <span>📅 LIVE EXPEDITION CALENDAR • SCHEDULED WEEKEND DEPARTURES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white">
            Upcoming Weekend Batches & Fixed Departures
          </h2>

          <p className="text-sm sm:text-base text-amber-100/80 mt-3 leading-relaxed">
            Join confirmed small group expeditions led by indigenous Baiga & Gond trailmasters. Lock your slot with just a ₹500 token advance.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {['All', 'This Weekend', 'Next Weekend', 'Camping', 'Trekking'].map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                  selectedFilter === filter
                    ? 'bg-[#C84B31] text-white border-[#E9C46A]/60 shadow-lg shadow-black/40 scale-105'
                    : 'bg-[#1B4332]/60 text-amber-100/80 border-[#2D6A4F] hover:bg-[#1B4332] hover:text-white'
                }`}
              >
                {filter === 'All' ? `All Upcoming (${batches.length})` : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredBatches.map(batch => {
            const percentBooked = Math.round((batch.bookedSlots / batch.totalSlots) * 100);

            const whatsappUrl = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(
              `Jai Johar! 🙏 I want to check availability and reserve slots for the upcoming batch:\n\n🏔️ *${batch.title}*\n📅 *Dates:* ${batch.dates}\n📍 *Destination:* ${batch.destination}\n💰 *Price:* ₹${batch.price}/person\n\nHow many slots are currently open?`
            )}`;

            return (
              <div
                key={batch.id}
                className="bg-[#142E23]/90 rounded-3xl overflow-hidden border border-[#2D6A4F]/80 shadow-2xl hover:shadow-black/60 hover:border-[#D4A373]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={batch.image}
                      alt={batch.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142E23] via-transparent to-black/40" />

                    {/* Urgency Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md border ${
                        batch.urgencyLevel === 'high'
                          ? 'bg-[#C84B31] text-white border-amber-300 animate-pulse'
                          : batch.urgencyLevel === 'medium'
                          ? 'bg-amber-600 text-white border-amber-300'
                          : 'bg-[#1B4332] text-amber-200 border-amber-400/40'
                      }`}>
                        {batch.urgencyBadge}
                      </span>
                    </div>

                    {/* Price Pill */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30 text-amber-300 font-extrabold text-sm">
                      ₹{batch.price}
                      <span className="text-[10px] text-stone-300 font-normal"> / person</span>
                    </div>

                    {/* Destination & Altitude Marker */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-amber-100">
                      <span className="font-semibold flex items-center gap-1 bg-black/50 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                        📍 {batch.destination}
                      </span>
                      <span className="font-mono text-emerald-300 bg-black/50 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                        ⛰️ {batch.altitude}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Departure Date Banner */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1B4332]/80 border border-[#2D6A4F] text-amber-200 text-xs font-bold mb-3">
                      <span className="text-base">📅</span>
                      <span>Departure: {batch.dates}</span>
                      <span className="ml-auto text-[10px] font-normal px-2 py-0.5 rounded bg-black/40 text-emerald-300">
                        {batch.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-white mb-3 group-hover:text-[#E9C46A] transition">
                      {batch.title}
                    </h3>

                    {/* Highlights */}
                    <ul className="space-y-1.5 text-xs text-stone-300 mb-5">
                      {batch.highlights.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#C84B31] font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Live Slot Counter Bar */}
                    <div className="bg-[#0D2119] p-3 rounded-2xl border border-[#2D6A4F]/60 mb-2">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-stone-300">
                          Remaining Slots: <strong className="text-white font-bold">{batch.availableSlots}</strong> of {batch.totalSlots}
                        </span>
                        <span className="font-mono font-bold text-amber-300">
                          {percentBooked}% Full
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentBooked >= 75 ? 'bg-gradient-to-r from-amber-500 to-[#C84B31]' : 'bg-gradient-to-r from-emerald-500 to-amber-400'
                          }`}
                          style={{ width: `${percentBooked}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleClaimSlot(batch)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#C84B31] to-[#9E321C] hover:from-[#D95338] hover:to-[#B8391B] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-black/40 transition hover:scale-[1.02] border border-amber-400/30 flex items-center justify-center gap-2"
                  >
                    <span>⚡</span>
                    <span>Claim Slot with ₹500 Token Advance</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#1B4332] hover:bg-[#25D366] hover:text-white text-amber-100 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-emerald-500/20"
                  >
                    <span>💬</span>
                    <span>Inquire Group Availability on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Group Departure Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#142E23] border border-[#D4A373]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C84B31]/20 text-[#E9C46A] flex items-center justify-center text-2xl shrink-0 border border-[#D4A373]/30">
              ⛺
            </div>
            <div>
              <h4 className="text-lg font-bold font-serif text-white">
                Planning a Private Corporate or Family Batch?
              </h4>
              <p className="text-xs text-stone-300 mt-1">
                We organize customized private expeditions on any weekday or weekend with exclusive camping gear, private Baiga trail leaders, and traditional camp catering.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(
              "Jai Johar! I am interested in organizing a customized private expedition with 36 Montane. Can we discuss dates and group pricing?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl text-xs shadow-md transition hover:scale-105 flex items-center gap-2"
          >
            <span>💬</span>
            <span>Request Custom Batch</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default UpcomingBatches;
