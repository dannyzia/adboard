const express = require('express');
const router = express.Router();
const { CATEGORIES } = require('../config/categories.config');

// @route   GET /api/categories
// @desc    Get all available categories
// @access  Public
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      categories: CATEGORIES
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
