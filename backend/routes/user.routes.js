const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const Ad = require('../models/Ad.model');

// @route   GET /api/users/favorites
// @desc    Get user's favorite ads
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: { path: 'user', select: 'name avatar' }
      });
    
    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching favorites' });
  }
});

// @route   GET /api/users/my-ads
// @desc    Get user's own ads
// @access  Private
router.get('/my-ads', protect, async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user._id }).sort('-createdAt');
    
    res.json({
      success: true,
      ads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching ads' });
  }
});

module.exports = router;
