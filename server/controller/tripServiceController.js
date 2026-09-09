const AllService = require('../models/TrekkingService');

// Controller to fetch all trekking services
exports.getAllServices = async (req, res) => {
  try {
    const trekkingServices = await AllService.find();
    res.status(200).json(trekkingServices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trekking services', error: err });
  }
};

// Controller to create a new trekking service
exports.createService = async (req, res) => {
  try {
    const { title, description, icon, image, link, category, price, duration, location, rating } = req.body;
    const newTrekkingService = new AllService({
      title,
      description,
      icon,
      image,
      link,
      category,
      price,
      duration,
      location,
      rating
    });
    await newTrekkingService.save();
    res.status(201).json(newTrekkingService);
  } catch (err) {
    res.status(500).json({ message: 'Error creating trekking service', error: err });
  }
};

exports.getFilteredServices = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build the query object
    let query = {};

    // If search parameter is provided, add search filter
    if (search) {
      query.title = { $regex: search, $options: 'i' };  // Case-insensitive search
    }

    // If category parameter is provided, add category filter
    if (category) {
      query.category = category;
    }
console.log('getFilteredServices debug',query);
    // Find matching trekking services
    const trekkingServices = await AllService.find(query);

    res.status(200).json(trekkingServices);
  } catch (err) {
    console.error('getFilteredServices',err);
    res.status(500).json({ message: 'Error fetching trekking services', error: err });
  }
};

// Update an existing service
exports.updateService = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await AllService.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('updateService error:', err);
    res.status(500).json({ message: 'Error updating service', error: err });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await AllService.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully', id });
  } catch (err) {
    console.error('deleteService error:', err);
    res.status(500).json({ message: 'Error deleting service', error: err });
  }
};