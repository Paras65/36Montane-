import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getOwnerWhatsAppNumber } from '../utils/whatsapp';

export const CORPORATE_PACKAGES = [
  {
    id: 'corp-1day',
    tier: 'Day Outing',
    name: '1-Day Leadership Reboot & Jungle Survival',
    tagline: 'Ideal for quick quarter-end celebrate & team bonding without overnight stay',
    basePrice: 1499,
    duration: 'Full Day (8:00 AM - 7:30 PM)',
    location: 'Bhoramdev Valley / Saroda Dadar Foothills',
    maxCapacity: '150+ Employees',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular for Single-Day Offsites',
    inclusions: [
      'Welcome Chhattisgarhi herbal tea & breakfast',
      'Team building games (Blindfold Trail, Bamboo Bridge Challenge)',
      'Traditional Chana Dal Pitha & forest feast lunch',
      'Baiga indigenous archery & fire-making workshop',
      'Sunset tea & acoustic campfire wrap-up',
      'Dedicated event coordinator & first aid responder'
    ]
  },
  {
    id: 'corp-2day',
    tier: 'Overnight Camp',
    name: '2D/1N Plateau Glamping & Stargazing Retreat',
    tagline: 'Our flagship executive retreat — strategy townhalls by day, bonfires under the stars by night',
    basePrice: 2999,
    duration: '2 Days / 1 Night (Weekend or Weekday)',
    location: 'Saroda Dadar Plateau Ridge (850m)',
    maxCapacity: '80 Employees',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    badge: '⭐ Most Popular for Tech & Corporate Teams',
    isPopular: true,
    inclusions: [
      'Exclusive private campsite buyout (zero outside tourists)',
      'Twin-sharing luxury safari dome tents with mattresses & blankets',
      'Outdoor projector & sound setup for townhalls / keynote decks',
      '4 buffet meals + live barbecue & roasted corn campfire',
      'Guided sunrise plateau ridge hike & yoga/mindfulness session',
      'High-speed Wi-Fi hotspot at basecamp for emergency comms',
      'Bastar Dokra cultural memento for each team member'
    ]
  },
  {
    id: 'corp-3day',
    tier: 'Executive Expedition',
    name: '3D/2N Bastar Wilderness Leadership Expedition',
    tagline: 'Immersive deep-forest exploration for leadership teams, founders, and department summits',
    basePrice: 5499,
    duration: '3 Days / 2 Nights',
    location: 'Chitrakote Gorge & Kanger Valley Biosphere',
    maxCapacity: '40 Leaders',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    badge: 'Executive & Senior Leadership',
    inclusions: [
      'Executive AC tempo traveller transit from Raipur / Jagdalpur',
      'Canyon boat navigation challenge beneath Chitrakote falls',
      'Kotumsar limestone subterranean cave team expedition',
      'Riverside luxury tents + local Bastar tribal cuisine banquets',
      'Tribal leadership storytelling session with Baiga elders',
      'Dedicated corporate drone videography & high-res group photos',
      'Comprehensive travel & adventure medical insurance'
    ]
  }
];

const CorporateOffsite = () => {
  const ownerWhatsApp = getOwnerWhatsAppNumber();
  const [selectedPkgId, setSelectedPkgId] = useState('corp-2day');
  const [teamSize, setTeamSize] = useState(25);
  const [companyName, setCompanyName] = useState('');
  const [tentativeMonth, setTentativeMonth] = useState('Next Month');

  const selectedPkg = useMemo(() => {
    return CORPORATE_PACKAGES.find(p => p.id === selectedPkgId) || CORPORATE_PACKAGES[1];
  }, [selectedPkgId]);

  // Tiered Corporate Group Discounts
  const discountPercent = useMemo(() => {
    if (teamSize >= 50) return 20;
    if (teamSize >= 30) return 15;
    if (teamSize >= 15) return 10;
    return 0;
  }, [teamSize]);

  const rawTotal = selectedPkg.basePrice * teamSize;
  const discountAmount = Math.round(rawTotal * (discountPercent / 100));
  const finalTotal = rawTotal - discountAmount;
  const effectivePerPerson = Math.round(finalTotal / teamSize);

  const corporateWhatsAppUrl = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(
    `🏢 *Corporate Retreat Inquiry - 36 Montane*\n━━━━━━━━━━━━━━━━━━━━\n👤 *Company / Team:* ${companyName.trim() || 'Our Company'}\n📦 *Selected Package:* ${selectedPkg.name}\n👥 *Team Size:* ${teamSize} Employees\n📅 *Preferred Month:* ${tentativeMonth}\n💰 *Estimated Budget:* ₹${finalTotal.toLocaleString('en-IN')} (₹${effectivePerPerson}/person after ${discountPercent}% group savings)\n📍 *Location:* ${selectedPkg.location}\n━━━━━━━━━━━━━━━━━━━━\nJai Johar 36 Montane team! Please share your official corporate deck, GST invoice terms, and available dates.`
  )}`;

  return (
    <div className="bg-[#FAF6F0] text-stone-900 min-h-screen">
      
      {/* ==================== 1. HERO BANNER ==================== */}
      <section className="relative bg-[#11261D] text-white py-20 sm:py-28 overflow-hidden border-b border-[#2D6A4F]/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,75,49,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,106,79,0.3),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C84B31]/20 border border-[#E9C46A]/40 text-[#E9C46A] text-xs uppercase tracking-widest font-semibold mb-6">
            <span>💼 UNPLUG & BOND • CORPORATE OFFSITES IN CHHATTISGARH</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-serif tracking-tight leading-tight mb-6">
            Wilderness Offsites & Leadership Retreats
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-amber-100/90 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            Trade fluorescent office lights and endless Zoom meetings for mist-veiled Sal canopies, campfire strategy circles, and team-building adventures in India's greenest heartland.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-amber-200">
            <span className="flex items-center gap-1.5 bg-[#1B4332]/80 px-4 py-2 rounded-full border border-amber-400/20">
              <span>✅</span> 100% Private Campsite Buyout
            </span>
            <span className="flex items-center gap-1.5 bg-[#1B4332]/80 px-4 py-2 rounded-full border border-amber-400/20">
              <span>✅</span> GST Invoicing & Vendor Empanelment
            </span>
            <span className="flex items-center gap-1.5 bg-[#1B4332]/80 px-4 py-2 rounded-full border border-amber-400/20">
              <span>✅</span> Up to 20% Group Savings
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 2. CORPORATE ADVANTAGES ==================== */}
      <section className="py-16 bg-white border-b border-[#EADBCE]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#11261D]">
              Why Leading Teams Choose 36 Montane
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Everything your HR and Leadership need for a seamless, safe, and unforgettable team offsite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C84B31] transition">
              <div className="w-12 h-12 rounded-xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center text-2xl mb-4">
                ⛺
              </div>
              <h3 className="font-bold text-base text-[#11261D] mb-1">Exclusive Campsite Buyout</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The entire mountain plateau or riverside camp is reserved exclusively for your employees. No outside tourists.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C84B31] transition">
              <div className="w-12 h-12 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center text-2xl mb-4">
                📽️
              </div>
              <h3 className="font-bold text-base text-[#11261D] mb-1">AV Setup for Townhalls</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Outdoor HD projection, wireless microphones, and portable Wi-Fi hotspot under Sal trees for strategy decks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C84B31] transition">
              <div className="w-12 h-12 rounded-xl bg-[#E9C46A]/20 text-[#8C6B10] flex items-center justify-center text-2xl mb-4">
                🤝
              </div>
              <h3 className="font-bold text-base text-[#11261D] mb-1">Tribal Team Building</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Blindfold navigation, Baiga archery contests, bamboo raft challenges, and campfire leadership circles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] hover:border-[#C84B31] transition">
              <div className="w-12 h-12 rounded-xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center text-2xl mb-4">
                📑
              </div>
              <h3 className="font-bold text-base text-[#11261D] mb-1">GST & Corporate POs</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Seamless corporate vendor empanelment, official GST tax invoices, corporate bank transfers, and token advance terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. CORPORATE PACKAGES GRID ==================== */}
      <section className="py-20 bg-[#FAF6F0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C84B31] bg-[#C84B31]/10 px-3 py-1 rounded-full">
              CURATED PACKAGES • CORPORATE RETREATS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#11261D] mt-3">
              Tailored Tiers for Every Team Size
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              From 1-day energy boosters to multi-day executive summits. Choose your format below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {CORPORATE_PACKAGES.map((pkg) => {
              const isSelected = selectedPkgId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between ${
                    pkg.isPopular
                      ? 'border-[#C84B31] shadow-2xl scale-[1.02] relative ring-4 ring-[#C84B31]/10'
                      : 'border-[#EADBCE] shadow-lg hover:border-[#D4A373]'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="bg-[#C84B31] text-white text-center py-1.5 text-xs font-extrabold uppercase tracking-wider">
                      ★ Most Popular Choice for Offsites ★
                    </div>
                  )}

                  <div>
                    {/* Header Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
                        {pkg.tier}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-[#11261D]/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg">
                        📍 {pkg.location}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xs font-bold text-[#C84B31] uppercase tracking-wider">
                          {pkg.duration}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          Capacity: {pkg.maxCapacity}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-serif text-[#11261D] mb-2">
                        {pkg.name}
                      </h3>

                      <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                        {pkg.tagline}
                      </p>

                      {/* Starting Price Pill */}
                      <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] mb-6 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase font-bold">Standard Base Rate</span>
                          <span className="text-2xl font-black text-[#11261D] font-serif">
                            ₹{pkg.basePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-stone-500"> / employee</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                          Up to 20% Off
                        </span>
                      </div>

                      {/* Inclusions */}
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261D] mb-3">
                        What's Included:
                      </h4>
                      <ul className="space-y-2 text-xs text-stone-700 mb-6">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#C84B31] font-bold shrink-0">✓</span>
                            <span className="leading-snug">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPkgId(pkg.id);
                        document.getElementById('corporate-calculator')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full py-3 px-4 font-bold rounded-xl text-xs sm:text-sm transition shadow flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-[#11261D] text-amber-200 border border-amber-400/30'
                          : 'bg-[#C84B31] hover:bg-[#9E321C] text-white'
                      }`}
                    >
                      <span>🧮</span>
                      <span>{isSelected ? 'Currently Selected in Calculator' : 'Calculate Quote for This Package'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 4. INTERACTIVE CORPORATE QUOTE CALCULATOR ==================== */}
      <section id="corporate-calculator" className="py-16 bg-[#11261D] text-white border-y border-[#2D6A4F]/60 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E9C46A] bg-[#E9C46A]/10 px-3 py-1 rounded-full border border-[#E9C46A]/20">
              ⚡ INSTANT CORPORATE BUDGET ESTIMATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white mt-3">
              Calculate Your Team Retreat Budget
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-2">
              Slide your team size to see real-time volume discounts and generate an instant proposal for your finance department.
            </p>
          </div>

          <div className="bg-[#142E23] rounded-3xl p-6 sm:p-10 border border-[#D4A373]/50 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls (7 Cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Tech Solutions, Raipur Branch"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#0D2119] border border-[#2D6A4F] text-white placeholder-stone-400 text-sm focus:outline-none focus:border-[#E9C46A]"
                />
              </div>

              {/* Package Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Select Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CORPORATE_PACKAGES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPkgId(p.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition ${
                        selectedPkgId === p.id
                          ? 'bg-[#C84B31] text-white border-amber-300 font-bold shadow'
                          : 'bg-[#0D2119] text-stone-300 border-[#2D6A4F] hover:bg-[#1B4332]'
                      }`}
                    >
                      <span className="block font-bold">{p.tier}</span>
                      <span className="text-[10px] opacity-80">₹{p.basePrice}/person</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Size Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-200">
                    Team Size
                  </label>
                  <span className="px-3 py-1 rounded-full bg-[#C84B31] text-white font-extrabold text-sm font-mono shadow">
                    👥 {teamSize} Employees
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-[#C84B31] cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>10 Members</span>
                  <span>50 Members (15% Off)</span>
                  <span>100+ (20% Off)</span>
                </div>
              </div>

              {/* Preferred Timeline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-1.5">
                  Tentative Timeline
                </label>
                <select
                  value={tentativeMonth}
                  onChange={(e) => setTentativeMonth(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D2119] border border-[#2D6A4F] text-white text-xs focus:outline-none focus:border-[#E9C46A]"
                >
                  <option value="Within 2 Weeks">⚡ Urgent (Within 2 Weeks)</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Upcoming Quarter">Upcoming Quarter / Annual Offsite</option>
                  <option value="Flexible Dates">Flexible Dates</option>
                </select>
              </div>

            </div>

            {/* Price Breakdown Card (5 Cols) */}
            <div className="md:col-span-5 bg-[#0D2119] p-6 rounded-2xl border border-[#D4A373]/40 space-y-4">
              <div className="border-b border-[#2D6A4F] pb-3">
                <span className="text-[11px] text-amber-200/70 uppercase tracking-wider block">Estimated Quote</span>
                <h4 className="text-lg font-bold text-white font-serif">{selectedPkg.name}</h4>
              </div>

              <div className="space-y-2 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Standard Rate ({teamSize} × ₹{selectedPkg.basePrice}):</span>
                  <span>₹{rawTotal.toLocaleString('en-IN')}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Corporate Group Discount ({discountPercent}%):</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#2D6A4F] flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm">Total Estimated Budget:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#E9C46A] font-serif block">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      (Effective ₹{effectivePerPerson}/person + 5% GST)
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-Click WhatsApp Proposal CTA */}
              <div className="pt-2">
                <a
                  href={corporateWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.02]"
                >
                  <span>💬</span>
                  <span>Request Official Corporate Deck</span>
                </a>

                <p className="text-[10px] text-stone-400 text-center mt-2.5">
                  Direct WhatsApp response from Founder & Head of Operations within 1 hour.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 5. FAQ FOR CORPORATE ORGANIZERS ==================== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#11261D] text-center mb-10">
            Frequently Asked Questions by HR & Team Leads
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <h4 className="font-bold text-[#11261D] mb-1">Q: Can we reserve the entire campsite exclusively for our company?</h4>
              <p className="text-stone-600">
                Yes. For groups of 20 or more employees, we offer complete private buyout of our Saroda Dadar or Bhoramdev campsites. No outside campers are allowed on site during your retreat.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <h4 className="font-bold text-[#11261D] mb-1">Q: Do you provide GST tax invoices and vendor empanelment?</h4>
              <p className="text-stone-600">
                Absolutely. We issue official GST tax invoices with your company's GSTIN. We also complete vendor empanelment paperwork and accept corporate NEFT/RTGS payments with token advance terms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <h4 className="font-bold text-[#11261D] mb-1">Q: What safety and medical arrangements are in place?</h4>
              <p className="text-stone-600">
                All expeditions are staffed by certified wilderness first-aid responders. We carry emergency oxygen, trauma kits, and have dedicated 4x4 rescue vehicles on standby. Female safety coordinators are always present on team offsites.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <h4 className="font-bold text-[#11261D] mb-1">Q: What about transport from Raipur or Bilaspur?</h4>
              <p className="text-stone-600">
                We organize executive AC pushback buses or tempo travellers directly from Raipur Airport, Bilaspur Railway Station, or your office campus directly to the basecamp.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CorporateOffsite;
