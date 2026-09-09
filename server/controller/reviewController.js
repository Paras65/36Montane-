// controllers/reviewController.js
const Review = require('../models/Review');

// Get all approved reviews for public display with aggregate statistics
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    let averageRating = 5.0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => {
        const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
        distribution[star] = (distribution[star] || 0) + 1;
        return acc + (r.rating || 5);
      }, 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
    }

    res.status(200).json({
      reviews,
      stats: {
        totalReviews,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
  }
};

// Admin: Get all reviews (approved and unapproved)
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ message: 'Error retrieving all reviews', error: error.message });
  }
};

// Create a new trekker review
const createReview = async (req, res) => {
  try {
    const { name, location, tripTitle, rating, comment, photoUrl, travelDate } = req.body;

    if (!name || !tripTitle || !comment) {
      return res.status(400).json({ message: 'Name, expedition title, and feedback are required.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    const newReview = new Review({
      name: name.trim(),
      location: location ? location.trim() : 'Chhattisgarh',
      tripTitle: tripTitle.trim(),
      rating: numRating,
      comment: comment.trim(),
      photoUrl: photoUrl ? photoUrl.trim() : '',
      travelDate: travelDate ? travelDate.trim() : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      badge: 'Verified Trekker',
      isApproved: true, // Approved by default for rapid community engagement, toggleable by admin
      likes: 0,
    });

    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};

// Toggle review approval status (Admin)
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (typeof isApproved === 'boolean') {
      review.isApproved = isApproved;
    } else {
      review.isApproved = !review.isApproved;
    }

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ message: 'Failed to update review status', error: error.message });
  }
};

// Increment likes on a review (Public)
const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ id: review._id, likes: review.likes });
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(500).json({ message: 'Failed to like review', error: error.message });
  }
};

// Delete review (Admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully', id });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

module.exports = {
  getApprovedReviews,
  getAllReviewsAdmin,
  createReview,
  updateReviewStatus,
  likeReview,
  deleteReview,
};

