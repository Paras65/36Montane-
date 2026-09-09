const TrekkingService = require('../models/FeatureService');

// Create a new trekking service
exports.createTrekkingService = async (req, res) => {
  try {
    const { title, description, detailLink } = req.body;

    const newTrekkingService = new TrekkingService({
      title,
      description,
      detailLink,
    });

    const savedService = await newTrekkingService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Error creating trekking service', error });
  }
};

// Get all trekking services
exports.getAllTrekkingServices = async (req, res) => {
  try {
    const services = await TrekkingService.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trekking services', error });
  }
};

// Get a single trekking service by ID
exports.getTrekkingServiceById = async (req, res) => {
  try {
    const service = await TrekkingService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Trekking service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trekking service', error });
  }
};

// Update a trekking service
exports.updateTrekkingService = async (req, res) => {
  try {
    const updatedService = await TrekkingService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Trekking service not found' });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trekking service', error });
  }
};

// Delete a trekking service
exports.deleteTrekkingService = async (req, res) => {
  try {
    const deletedService = await TrekkingService.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Trekking service not found' });
    }
    res.status(200).json({ message: 'Trekking service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trekking service', error });
  }
};
