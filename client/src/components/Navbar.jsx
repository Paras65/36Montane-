import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHiking } from '@fortawesome/free-solid-svg-icons';
import "../style/Navbar.css";

// Define link styles for active/inactive states outside the component
const linkClass = ({ isActive }) =>
  isActive
    ? "text-white bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 px-3 py-2 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out"
    : "text-gray-300 hover:bg-gray-600 hover:text-white px-3 py-2 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Links data
  const links = [
    { to: '/home', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/service', label: 'Services' },
    { to: '/event', label: 'Events' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/blogs', label: 'Blogs' },
  ];

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(prev => !prev);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex flex-1 items-center justify-between md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4 group" to="/home">
              <span className="flex items-center text-orange-500 text-4xl font-extrabold tracking-widest ml-2">
                <FontAwesomeIcon icon={faHiking} className="mr-2" />
                {/* Dynamic font size for the logo and label */}
                <span className="text-xl sm:text-2xl lg:text-3xl">
                  36 Montane
                </span>
              </span>
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-2 ml-auto">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
                aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={isOpen ? "true" : "false"}
                aria-controls="mobile-menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Links */}
        <div
          id="mobile-menu"
          className={`md:hidden bg-transparent p-6 space-y-2 transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100 transform translate-y-0" : "max-h-0 opacity-0 transform -translate-y-10"
          } overflow-hidden`}
        >
          <div className="flex flex-col items-start">
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
      </div>
    </nav>
  );
};

export default Navbar;
