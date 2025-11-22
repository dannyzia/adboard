const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog.model');
const { protect, admin } = require('../middleware/auth.middleware');
const { validateApiKey } = require('../middleware/apiKey.middleware');
const User = require('../models/User.model');

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
// @desc    Create blog via API (requires API key) or Admin panel (requires auth)
// @access  Private/Admin OR API Key
router.post('/', async (req, res, next) => {
  // Check if request has API key authentication
  const hasApiKey = req.headers['x-api-key'] || (req.headers.authorization && req.headers.authorization.startsWith('Bearer'));
  
  if (hasApiKey) {
    // Use API key authentication for external integrations (e.g., n8n)
    return validateApiKey(req, res, async () => {
      try {
        // Validate required fields
        const { title, content } = req.body;
        
        if (!title) {
          return res.status(400).json({
            error: 'Title is required',
            details: "The 'title' field was not provided in the request body."
          });
        }
        
        if (!content) {
          return res.status(400).json({
            error: 'Content is required',
            details: "The 'content' field was not provided in the request body."
          });
        }

        // Get or create default author for API-created posts
        const authorId = process.env.BLOG_API_AUTHOR_ID;
        if (!authorId) {
          return res.status(500).json({
            error: 'Server configuration error',
            details: 'BLOG_API_AUTHOR_ID environment variable is not configured'
          });
        }

        const author = await User.findById(authorId);
        if (!author) {
          return res.status(500).json({
            error: 'Author not found',
            details: 'The configured API author user does not exist'
          });
        }

        // Prepare blog data
        const blogData = {
          title: req.body.title,
          content: req.body.content,
          author: author._id,
          status: req.body.status || 'draft', // Default to draft for safety
          category: req.body.category || 'Tips',
          publishDate: req.body.status === 'published' ? new Date() : req.body.publishDate || new Date(),
        };

        // Generate excerpt if not provided (first 300 chars of content, stripped of HTML)
        if (req.body.excerpt) {
          blogData.excerpt = req.body.excerpt;
        } else {
          const strippedContent = req.body.content.replace(/<[^>]*>/g, '');
          blogData.excerpt = strippedContent.substring(0, 297) + (strippedContent.length > 297 ? '...' : '');
        }

        // Handle custom slug or auto-generate
        if (req.body.slug) {
          // Check if slug already exists
          const existingBlog = await Blog.findOne({ slug: req.body.slug });
          if (existingBlog) {
            return res.status(400).json({
              error: 'Slug already exists',
              details: `A blog post with the slug '${req.body.slug}' already exists. Please use a different slug.`
            });
          }
          blogData.slug = req.body.slug;
        } else {
          // Auto-generate slug from title
          blogData.slug = req.body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
        }

        // Handle tags if provided (stored in content metadata for now)
        // Note: If you want to add tags field to schema, update Blog.model.js

        // Create the blog post
        const blog = await Blog.create(blogData);

        // Populate author details for response
        await blog.populate('author', 'name avatar');

        // Build permalink
        const baseUrl = process.env.FRONTEND_URL || 'https://www.listynest.com';
        const permalink = `${baseUrl}/blog/${blog.slug}`;

        return res.status(201).json({
          message: 'Blog post created successfully',
          id: blog._id,
          permalink,
          blog: {
            id: blog._id,
            title: blog.title,
            slug: blog.slug,
            status: blog.status,
            category: blog.category,
            publishDate: blog.publishDate,
            createdAt: blog.createdAt
          }
        });
      } catch (error) {
        console.error('Create blog via API error:', error);
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            error: 'Validation error',
            details: error.message
          });
        }
        
        return res.status(500).json({
          error: 'Internal server error',
          details: 'An error occurred while creating the blog post'
        });
      }
    });
  } else {
    // Use standard admin authentication for dashboard
    return protect(req, res, () => {
      return admin(req, res, async () => {
        try {
          const blog = await Blog.create({ ...req.body, author: req.user._id });
          res.status(201).json({ success: true, blog });
        } catch (error) {
          console.error('Create blog error:', error);
          res.status(500).json({ success: false, message: error.message });
        }
      });
    });
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
