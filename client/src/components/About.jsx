import React from "react";
import TrekkerStories from "./TrekkerStories";
import { Link } from "react-router-dom";
import { FaTree, FaCampground, FaHandsHelping, FaShieldAlt } from "react-icons/fa";
import { getOwnerWhatsAppNumber } from "../utils/whatsapp";

const teamMembers = [
  {
    name: "Paras Sahu",
    role: "Founder & Lead Expedition Director",
    bio: "Wilderness trekking veteran passionate about putting Central India's hidden trails and the Maikal range on the global eco-tourism map.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Mangal Ram Gond",
    role: "Head Tribal Trailmaster & Naturalist",
    bio: "Born in the dense woodlands of Bastar, master tracker with generational knowledge of Dandakaranya flora, fauna, and indigenous routes.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Ananya Sharma",
    role: "Eco-Tourism & Community Relations",
    bio: "Dedicated to zero-waste travel, empowering Baiga artisan families, and curating authentic Dokra craft exchanges for travelers.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
  }
];

const AboutUs = () => {
  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#1A211D]">
      {/* Hero Header */}
      <section className="relative py-20 bg-gradient-to-b from-[#11261D] to-[#1B4332] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E9C46A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#C84B31]/30 text-[#E9C46A] border border-[#D4A373]/30 text-xs uppercase tracking-widest font-semibold mb-4">
            🌾 जय जोहार • THE STORY OF 36 MONTANE
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-serif leading-tight mb-6">
            Born in the Ancient Heart of <span className="text-[#E9C46A]">Dandakaranya</span>
          </h1>
          <p className="text-lg md:text-xl text-[#D8CFBC] leading-relaxed max-w-3xl mx-auto">
            Chhattisgarh takes its historic name from the <span className="text-white font-semibold">36 Forts (छत्तीस गढ़)</span> that guarded these sacred highlands. 36 Montane was born from a singular passion: to open Central India’s untouched Sal canopies, misty plateaus, and vibrant tribal culture to respectful explorers worldwide.
          </p>
        </div>
      </section>

      {/* Section: Mission & Ethos */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1B4332] mb-4">
            हमर संकल्प (Our Sacred Mission)
          </h2>
          <div className="w-24 h-1 bg-[#C84B31] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe that true adventure leaves no scars on the earth. Our expeditions combine rigorous wilderness safety with intimate tribal heritage, offering travelers soulful immersion into the sacred forests of Central India while directly supporting local community livelihoods.
          </p>
        </div>

        {/* Section: Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center text-2xl mb-5">
              <FaTree />
            </div>
            <h4 className="text-xl font-bold font-serif text-[#1B4332] mb-3">प्रकृति संरक्षण</h4>
            <h5 className="text-xs uppercase tracking-wider text-[#C84B31] font-semibold mb-2">Leave No Trace</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              We practice 100% plastic-free camping and protect the fragile biodiversity of Sal forests, river basins, and wildlife corridors.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#C84B31]/10 text-[#C84B31] flex items-center justify-center text-2xl mb-5">
              <FaHandsHelping />
            </div>
            <h4 className="text-xl font-bold font-serif text-[#1B4332] mb-3">जनजातीय सम्मान</h4>
            <h5 className="text-xs uppercase tracking-wider text-[#C84B31] font-semibold mb-2">Tribal Empowerment</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              Local Baiga and Gond youth lead our trails as certified guides, ensuring authentic wisdom and direct economic uplift.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#D4A373]/20 text-[#9E6B28] flex items-center justify-center text-2xl mb-5">
              <FaShieldAlt />
            </div>
            <h4 className="text-xl font-bold font-serif text-[#1B4332] mb-3">सुरक्षा एवं विश्वास</h4>
            <h5 className="text-xs uppercase tracking-wider text-[#C84B31] font-semibold mb-2">Wilderness Safety</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              Equipped with high-altitude weatherproof gear, comprehensive first-aid medical kits, and satellite-assisted trail protocols.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#E9C46A]/20 text-[#8C6B10] flex items-center justify-center text-2xl mb-5">
              <FaCampground />
            </div>
            <h4 className="text-xl font-bold font-serif text-[#1B4332] mb-3">सांस्कृतिक धरोहर</h4>
            <h5 className="text-xs uppercase tracking-wider text-[#C84B31] font-semibold mb-2">Heritage Storytelling</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              Evenings alive with campfire stories of ancient dynasties, traditional Chhattisgarhi pitha dining, and live Dokra metal casting workshops.
            </p>
          </div>
        </div>

        {/* Section: Timeline */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#EADBCE] shadow-sm mb-20">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold">MILESTONES</span>
            <h3 className="text-3xl font-bold font-serif text-[#1B4332] mt-1">हमर यात्रा (Our Journey)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="text-center p-6 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <div className="inline-block px-4 py-1 rounded-full bg-[#C84B31] text-white font-bold text-sm mb-3">
                2019
              </div>
              <h4 className="text-lg font-bold text-[#1B4332] mb-2">First Campfire at Saroda Dadar</h4>
              <p className="text-sm text-gray-600">
                Founded with a dream to introduce trekkers to the breathtaking sunset cliffs and Sal tree plateaus of Kawardha.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <div className="inline-block px-4 py-1 rounded-full bg-[#1B4332] text-[#E9C46A] font-bold text-sm mb-3">
                2022
              </div>
              <h4 className="text-lg font-bold text-[#1B4332] mb-2">Bastar & Kanger Valley Circuits</h4>
              <p className="text-sm text-gray-600">
                Expanded into Dandakaranya rainforests, partnering with indigenous cave experts and Chitrakote boatmen.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
              <div className="inline-block px-4 py-1 rounded-full bg-[#D4A373] text-[#1A211D] font-bold text-sm mb-3">
                2024
              </div>
              <h4 className="text-lg font-bold text-[#1B4332] mb-2">Certified Tribal Guide Academy</h4>
              <p className="text-sm text-gray-600">
                Launched training programs empowering 30+ local tribal youths with first-aid, leave-no-trace, and guest hospitality skills.
              </p>
            </div>
          </div>
        </div>

        {/* Section: Meet the Team */}
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-[#C84B31] font-semibold">LEADERSHIP</span>
          <h3 className="text-3xl md:text-4xl font-bold font-serif text-[#1B4332] mt-1 mb-12">
            Meet Your Trail Guardians
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-[#EADBCE] shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#D4A373] shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img
                    className="w-full h-full object-cover"
                    src={member.image}
                    alt={member.name}
                  />
                </div>
                <h4 className="text-xl font-bold font-serif text-[#1B4332] mb-1">{member.name}</h4>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C84B31] mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-10 md:p-14 text-center shadow-xl mb-20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-2xl mb-2 block">🌿</span>
            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-[#FAF6F0]">
              Ready to Explore Chhattisgarh with Us?
            </h3>
            <p className="text-sm md:text-base text-[#D8CFBC] mb-8 leading-relaxed">
              Step off the beaten path into pristine Sal canopies, hidden waterfalls, and warm tribal hospitality.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/service"
                className="px-8 py-3.5 bg-[#C84B31] hover:bg-[#9E321C] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Explore Upcoming Expeditions
              </Link>
              <a
                href={`https://wa.me/${getOwnerWhatsAppNumber()}?text=${encodeURIComponent(
                  "Jai Johar! I want to plan a trip with 36 Montane."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <span>💬</span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Trekker Stories & Community Wall */}
      <TrekkerStories />
    </div>
  );
};

export default AboutUs;
