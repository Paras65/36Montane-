// src/Booking.js
import { useState } from "react";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.service) newErrors.service = "Service selection is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Booking Submitted:", formData);
      alert("Your booking has been successfully submitted!");
      setFormData({ name: "", email: "", service: "", date: "" }); // Reset form
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg my-10 max-w-4xl">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Book Your Next Adventure
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your full name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your email address"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Service Selection */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="service"
          >
            Select Service
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          >
            <option value="">Choose your adventure</option>
            <option value="Camping">Camping</option>
            <option value="Trekking">Trekking</option>
            <option value="Guided Tour">Guided Tour</option>
          </select>
          {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label
            className="block text-lg font-medium text-gray-700"
            htmlFor="date"
          >
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300"
          >
            Book Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;
