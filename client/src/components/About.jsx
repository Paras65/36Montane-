import Testimonial from "./Testimonial";

const testimonials = [
  {
    name: "John Doe",
    text: "The trek through the mountains was truly unforgettable. The landscapes were breathtaking, and the journey brought me peace and adventure at the same time.",
    location: "Himalayas, Nepal",
    image: "https://picsum.photos/200/300?random=1152"
  },
  {
    name: "Michael Johnson",
    text: "Trekking through the wilderness of Patagonia was an adventure of a lifetime. The remote beauty and the sheer scale of the landscapes left me in awe. I can't wait to go back!",
    location: "Patagonia, Argentina",
    image: "https://picsum.photos/200/300?random=1154"
  },
  {
    name: "Emily Roberts",
    text: "Camping in Banff National Park was a magical experience. Surrounded by towering peaks and crystal-clear lakes, I felt completely at peace and rejuvenated. Nature truly has the power to heal.",
    location: "Banff National Park, Canada",
    image: "https://picsum.photos/200/300?random=1155"
  },
  {
    name: "David Lee",
    text: "The Canadian Rockies are nothing short of breathtaking. Hiking through the rugged trails and being surrounded by glaciers and turquoise lakes was a dream come true.",
    location: "Canadian Rockies, Canada",
    image: "https://picsum.photos/200/300?random=1156"
  },
  {
    name: "Isabella Martinez",
    text: "The trek through the Andes Mountains was a true test of endurance. But reaching the summit and witnessing the panoramic views of the valleys below made every step worth it.",
    location: "Andes Mountains, Peru",
    image: "https://picsum.photos/200/300?random=1157"
  }
];

const AboutUs = () => {
  return (
    <>
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          {/* Section: Mission & Values */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              We are dedicated to providing unforgettable experiences through immersive
              trekking, camping, and adventure travel. Our goal is to inspire people to
              explore the world, connect with nature, and create lasting memories.
            </p>
          </div>

          {/* Section: Company Values */}
          <div className="text-center mb-16">
            <h3 className="text-4xl font-semibold text-gray-800 mb-8">Our Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <h4 className="text-xl font-semibold text-green-600 mb-4">Sustainability</h4>
                <p className="text-gray-500">
                  We believe in preserving the environment, ensuring sustainable practices
                  in all our activities to protect nature for future generations.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <h4 className="text-xl font-semibold text-green-600 mb-4">Adventure</h4>
                <p className="text-gray-500">
                  We encourage our guests to push their limits and embrace the thrill of adventure.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <h4 className="text-xl font-semibold text-green-600 mb-4">Community</h4>
                <p className="text-gray-500">
                  We foster a sense of community by connecting like-minded individuals who share
                  a passion for the outdoors.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <h4 className="text-xl font-semibold text-green-600 mb-4">Safety</h4>
                <p className="text-gray-500">
                  The safety of our guests is our top priority. We ensure professional guides and
                  safety measures throughout every adventure.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Company History */}
          <div className="text-center mb-16">
  <h3 className="text-4xl font-semibold text-gray-800 mb-8">Our History</h3>
  <div className="relative flex items-center justify-center">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-t-2 border-gray-300 w-full z-0"></div>
    <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-8 z-10">
      <div className="text-center mb-8 sm:mb-0">
        <h4 className="text-xl font-semibold text-green-600">2010</h4>
        <p className="text-gray-500">Founded with a vision to inspire outdoor exploration.</p>
      </div>
      <div className="text-center mb-8 sm:mb-0">
        <h4 className="text-xl font-semibold text-green-600">2015</h4>
        <p className="text-gray-500">Expanded to multiple locations globally.</p>
      </div>
      <div className="text-center">
        <h4 className="text-xl font-semibold text-green-600">2020</h4>
        <p className="text-gray-500">Launched eco-friendly camping and trekking options.</p>
      </div>
    </div>
  </div>
</div>


          {/* Section: Meet the Team */}
          <div className="text-center mb-16">
            <h3 className="text-4xl font-semibold text-gray-800 mb-8">Meet Our Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Team Member 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <img
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-6"
                  src="https://picsum.photos/200/300?random=1150"
                  alt="Team Member"
                />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">John Doe</h4>
                <p className="text-gray-500">Lead Guide</p>
              </div>
              {/* Team Member 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <img
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-6"
                  src="https://picsum.photos/200/300?random=1151"
                  alt="Team Member"
                />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Jane Smith</h4>
                <p className="text-gray-500">Marketing Manager</p>
              </div>
              {/* Team Member 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                <img
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-6"
                  src="https://picsum.photos/200/300?random=1152"
                  alt="Team Member"
                />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Sarah Lee</h4>
                <p className="text-gray-500">Operations Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {testimonials.map((testimonial, index) => (
        <Testimonial
          key={index}
          name={testimonial.name}
          text={testimonial.text}
          location={testimonial.location}
          image={testimonial.image}
        />
      ))}
    </>
  );
};

export default AboutUs;
