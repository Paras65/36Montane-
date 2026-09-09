import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHiking } from '@fortawesome/free-solid-svg-icons';
import "../style/Navbar.css";

// Cultural link styles with terracotta and dokra gold accents
const linkClass = ({ isActive }) =>
  isActive
    ? "bg-[#C84B31] text-white px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-md shadow-amber-950/40 border border-amber-400/30 transition-all duration-200"
    : "text-amber-100/85 hover:bg-emerald-900/60 hover:text-amber-200 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Links data
  const links = [
    { to: '/home', label: 'Home' },
    { to: '/service', label: 'Tours & Treks' },
    { to: '/gallery', label: 'Bastar Gallery' },
    { to: '/event', label: 'Events & Campfires' },
    { to: '/about', label: 'Our Story' },
    { to: '/blogs', label: 'Trail Journal' },
    { to: '/contact', label: 'Contact' },
  ];

  const toggleMenu = () => setIsOpen(prev => !prev);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-[#11261D] border-b border-[#2D6A4F]/60 sticky top-0 z-50 shadow-xl">
      {/* Top Tribal Cultural Ribbon */}
      <div className="tribal-border-motif"></div>

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <NavLink className="flex items-center group py-2" to="/home">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C84B31] via-[#A3351E] to-[#6B1F0F] flex items-center justify-center text-amber-100 shadow-md shadow-black/40 mr-3 border border-amber-400/30 group-hover:scale-105 transition duration-200">
              <FontAwesomeIcon icon={faHiking} className="text-xl text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                  36 Montane
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C84B31] text-amber-100 border border-amber-400/30 uppercase tracking-widest hidden sm:inline-block">
                  छत्तीसगढ़
                </span>
              </div>
              <span className="block text-[11px] text-amber-200/80 font-medium tracking-wide">
                Dandakaranya Eco-Trekking & Camping
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Action CTA Button (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B4332] text-amber-200 border border-amber-500/20">
              <span>🙏</span>
              <span>जय जोहार</span>
            </span>
            <NavLink
              to="/service"
              className="px-4 py-2 bg-gradient-to-r from-[#C84B31] to-[#9E321C] hover:from-[#D95338] hover:to-[#B8391B] text-white text-xs font-bold rounded-xl shadow-md shadow-black/30 border border-amber-400/30 transition hover:scale-105 flex items-center gap-1.5"
            >
              <span>🏕️</span>
              <span>Book Trip</span>
            </NavLink>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <NavLink
              to="/service"
              className="px-3 py-1.5 bg-[#C84B31] text-white text-xs font-bold rounded-lg sm:hidden"
            >
              Book
            </NavLink>
            <button
              onClick={toggleMenu}
              className="p-2 text-amber-100 hover:text-white rounded-lg hover:bg-emerald-900/60 focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#0D2119] border-t border-[#2D6A4F]/60 p-4 rounded-b-2xl shadow-2xl space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-3 py-2 bg-[#1B4332]/60 rounded-xl mb-3 border border-amber-500/20">
              <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <span>🙏</span>
                <span>जय जोहार • Welcome to Chhattisgarh</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">36 Forts</span>
            </div>

            <div className="flex flex-col space-y-1">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  onClick={handleLinkClick}
                  to={to}
                  className={linkClass}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
