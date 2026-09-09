import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!validateForm()) return;

    // Set loading state to true
    setLoading(true);
    setApiError(""); // Reset any previous API errors

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message, please try again later.");
      }

      // Reset form and show success message
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setApiError(error.message); // Set API error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form Section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-10 rounded-xl shadow-lg">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-8">Contact Us</h2>

          {submitted && (
            <div className="mb-6 text-center text-green-400 font-semibold">
              <p>Your message has been sent successfully!</p>
            </div>
          )}

          {apiError && (
            <div className="mb-6 text-center text-red-400 font-semibold">
              <p>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-lg font-medium text-gray-800">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
                placeholder="Enter your full name"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-lg font-medium text-gray-800">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
                placeholder="Enter your email address"
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-lg font-medium text-gray-800">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
                placeholder="Enter your phone number (Optional)"
              />
            </div>

            {/* Message Input */}
            <div className="mb-8">
              <label htmlFor="message" className="block text-lg font-medium text-gray-800">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full p-4 bg-white border-2 border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800"
                placeholder="Write your message here"
                required
              ></textarea>
              {errors.message && <p className="text-red-400 text-sm mt-2">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-12 py-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-10 rounded-xl shadow-lg">
  <h2 className="text-4xl font-semibold text-gray-800 text-center mb-8">Our Location</h2>

  <div className="text-center mb-8">
    <p className="text-lg text-gray-700">Visit us at:</p>
    <p className="text-xl font-semibold text-gray-800">36 Montane Adventure Camping, Saroda, Unnamed Road, Dadar, Mahali, Chhattisgarh 491559</p>
    <p className="text-lg text-gray-700">Open Hours: Mon-Fri, 9am - 6pm</p>
  </div>



          {/* Google Map Embed */}
          <div className="w-full h-64 mb-8">
  <iframe
    className="w-full h-full rounded-xl"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29689.21596359117!2d81.707786!3d20.6944108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28f4c68833e5e1%3A0xd77560f57320d6d9!2s36%20Montane%20Adventure%20Camping%2C%20Saroda%2C%20Dadar%2C%20Mahali%2C%20Chhattisgarh%20491559!5e0!3m2!1sen!2sin!4v1713948503181!5m2!1sen!2sin"
    title="Google Map - 36 Montane Adventure Camping"
    allowFullScreen
    loading="lazy"
    frameBorder="0"
    aria-label="Map of 36 Montane Adventure Camping, Saroda, Dadar, Mahali, Chhattisgarh"
  ></iframe>
</div>


        </div>
      </div>
    </div>
  );
};

export default Contact;
