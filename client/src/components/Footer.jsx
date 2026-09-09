

import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { getOwnerWhatsAppNumber } from "../utils/whatsapp";

function Footer() {
  return (
    <footer className="relative bg-[#0B1D15] text-[#F0E5D3] pt-0">
      {/* Top Tribal Border Motif */}
      <div className="tribal-border-motif w-full"></div>

      <div className="container mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Cultural Note */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏕️</span>
              <div>
                <span className="block text-2xl font-black tracking-wider text-[#FAF6F0] font-serif">
                  36 MONTANE
                </span>
                <span className="block text-[11px] uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
                  छत्तीसगढ़ • DANDAKARANYA
                </span>
              </div>
            </div>
            <p className="text-sm text-[#D8CFBC] leading-relaxed mb-4">
              <span className="text-[#E9C46A] font-semibold">🙏 जय जोहार!</span> We invite you to experience the untamed green heart of India — the 36 ancient forts, sacred Sal woodlands, thunderous waterfalls, and timeless Bastar tribal crafts.
            </p>
            <div className="inline-block px-3 py-1.5 rounded-full bg-[#1B4332] border border-[#D4A373]/40 text-[#E9C46A] text-xs font-medium">
              🌿 100% Eco-Responsible & Tribal Led
            </div>
          </div>

          {/* Col 2: Popular Expeditions */}
          <div>
            <h4 className="text-lg font-bold text-[#FAF6F0] font-serif mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C84B31]"></span>
              Popular Trails
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D8CFBC]">
              <li>
                <Link to="/service" className="hover:text-[#E9C46A] transition flex items-center gap-2">
                  <span>›</span> Saroda Dadar Plateau Camp
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E9C46A] transition flex items-center gap-2">
                  <span>›</span> Kanger Valley Caves & Waterfalls
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E9C46A] transition flex items-center gap-2">
                  <span>›</span> Chitrakote Falls Night Safari
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E9C46A] transition flex items-center gap-2">
                  <span>›</span> Bhoramdev 11th-Century Heritage Trail
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E9C46A] transition flex items-center gap-2">
                  <span>›</span> Maikal Range High-Ridge Trek
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-lg font-bold text-[#FAF6F0] font-serif mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4A373]"></span>
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D8CFBC]">
              <li>
                <Link to="/" className="hover:text-[#E9C46A] transition">Home</Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-[#E9C46A] transition">All Services & Treks</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E9C46A] transition">About Us & Our Story</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#E9C46A] transition">Expedition Gallery</Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-[#E9C46A] transition">Travel Stories & Blog</Link>
              </li>
              <li>
                <Link to="/admin" className="text-[#E9C46A] hover:underline font-medium">
                  🔒 Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div>
            <h4 className="text-lg font-bold text-[#FAF6F0] font-serif mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C84B31]"></span>
              Connect With Us
            </h4>
            <div className="space-y-3 text-sm text-[#D8CFBC] mb-5">
              <p className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#D4A373] mt-1 shrink-0" />
                <span>Base Camp: Saroda Dadar, Kawardha, Chhattisgarh 491995</span>
              </p>
              <p className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#D4A373] shrink-0" />
                <a href={`tel:+${getOwnerWhatsAppNumber()}`} className="hover:text-[#E9C46A] transition">+91 96693 24552</a>
              </p>
              <p className="flex items-center gap-3">
                <FaEnvelope className="text-[#D4A373] shrink-0" />
                <a href="mailto:info@36montane.com" className="hover:text-[#E9C46A] transition">info@36montane.com</a>
              </p>
            </div>

            <a
              href={`https://wa.me/${getOwnerWhatsAppNumber()}?text=${encodeURIComponent(
                "Jai Johar! I want to know more about trekking with 36 Montane."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl text-xs transition shadow-lg hover:scale-[1.02]"
            >
              <FaWhatsapp className="text-base" />
              <span>Ask Local Guide on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom divider with copyright & cultural motto */}
        <div className="pt-8 border-t border-[#1B4332] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8AE9C]">
          <p>
            &copy; {new Date().getFullYear()} 36 Montane Adventure Camping. All rights reserved.
          </p>
          <p className="text-[#E9C46A] font-medium tracking-wide">
            जय जोहार • मोर मयारू छत्तीसगढ़ • The 36 Forts of Central India
          </p>
          <div className="flex items-center space-x-4 text-base">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E9C46A] transition" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E9C46A] transition" aria-label="Facebook">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;