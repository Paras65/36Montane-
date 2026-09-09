const Gallery = require('../models/Gallery');

// Get gallery by type (photo/video)
const getGalleryByType = async (req, res) => {
    const { type } = req.query;
    
    if (type && !['video', 'photo'].includes(type)) {
        return res.status(400).json({ message: 'Invalid media type.' });
    }

    try {
        const filter = type ? { type } : {};
        const galleryItems = await Gallery.find(filter);
        res.json(galleryItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery data.' });
    }
};

// Add new gallery item
const addGalleryItem = async (req, res) => {
    const { title, mediaUrl, thumbnail, type, platform } = req.body;

    if (!['video', 'photo'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either "video" or "photo".' });
    }

    try {
        const newItem = new Gallery({ title, mediaUrl, thumbnail, type, platform: platform || null });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error saving gallery data.' });
    }
};

// Delete gallery item
const deleteGalleryItem = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Gallery.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        res.status(200).json({ message: 'Gallery item deleted successfully', id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting gallery item' });
    }
};

module.exports = { getGalleryByType, addGalleryItem, deleteGalleryItem };
