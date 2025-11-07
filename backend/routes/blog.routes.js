const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog.model');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   GET /api/blogs/featured
// @desc    Get 4 featured blogs (previous, current, 2 upcoming)
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const now = new Date();

    // Get 1 previous (most recent published)
    const previous = await Blog.find({ status: 'published', publishDate: { $lt: now } })
      .sort({ publishDate: -1 })
      .limit(1)
      .populate('author', 'name avatar');

    // Get 1 current (published, most recent excluding the previous)
    const current = await Blog.find({ status: 'published', publishDate: { $lte: now } })
      .sort({ publishDate: -1 })
      .limit(1)
      .skip(1)
      .populate('author', 'name avatar');

    // Get 2 upcoming (scheduled, future dates)
    const upcoming = await Blog.find({ status: 'scheduled', publishDate: { $gt: now } })
      .sort({ publishDate: 1 })
      .limit(2)
      .populate('author', 'name avatar');

    const featured = [...previous, ...current, ...upcoming];

    res.json({ success: true, blogs: featured });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({ success: false, message: 'Error fetching blogs' });
  }
});

// @route   GET /api/blogs/recent
// @desc    Get recent published blogs (public)
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 12;
    const now = new Date();
    const blogs = await Blog.find({ status: 'published', publishDate: { $lte: now } })
      .sort({ publishDate: -1 })
      .limit(limit)
      .populate('author', 'name avatar');

    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Get recent blogs error:', error);
    res.status(500).json({ success: false, message: 'Error fetching recent blogs' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public
// NOTE: The single-blog route is moved to the bottom of this file so it doesn't
// accidentally capture more specific routes like '/all' when Express matches
// routes in declaration order.

// @route   POST /api/blogs
// @desc    Create blog (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/blogs/all
// @desc    Get all blogs (Admin)
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');

    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ success: false, message: 'Error fetching blogs' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog (Admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Error deleting blog' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog (Admin)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate('author', 'name avatar');
    if (!updated) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, blog: updated });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: 'Error updating blog' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name avatar');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ success: false, message: 'Error fetching blog' });
  }
});

module.exports = router;
