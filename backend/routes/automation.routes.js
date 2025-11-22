const express = require('express');
const router = express.Router();
const blogAutomation = require('../services/blogAutomation.service');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   POST /api/automation/topics/load
// @desc    Load topics into automation queue
// @access  Private/Admin
router.post('/topics/load', protect, admin, async (req, res) => {
  try {
    const { topics, category } = req.body;

    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Topics array is required and must not be empty'
      });
    }

    const created = await blogAutomation.loadTopics(topics, category);

    res.json({
      success: true,
      message: `Successfully loaded ${created.length} topics`,
      count: created.length,
      topics: created
    });
  } catch (error) {
    console.error('Load topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading topics',
      error: error.message
    });
  }
});

// @route   POST /api/automation/generate-now
// @desc    Manually trigger blog generation immediately
// @access  Private/Admin
router.post('/generate-now', protect, admin, async (req, res) => {
  try {
    const blog = await blogAutomation.generateBlogNow();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'No topics available in queue'
      });
    }

    res.json({
      success: true,
      message: 'Blog generated and published successfully',
      blog: {
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        status: blog.status,
        publishDate: blog.publishDate,
        permalink: `${process.env.FRONTEND_URL}/blog/${blog.slug}`
      }
    });
  } catch (error) {
    console.error('Generate blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating blog',
      error: error.message
    });
  }
});

// @route   GET /api/automation/status
// @desc    Get automation queue status
// @access  Private/Admin
router.get('/status', protect, admin, async (req, res) => {
  try {
    const status = await blogAutomation.getQueueStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching status',
      error: error.message
    });
  }
});

// @route   GET /api/automation/topics
// @desc    Get all topics with their status
// @access  Private/Admin
router.get('/topics', protect, admin, async (req, res) => {
  try {
    const topics = await blogAutomation.getAllTopics();

    res.json({
      success: true,
      count: topics.length,
      topics
    });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topics',
      error: error.message
    });
  }
});

// @route   DELETE /api/automation/topics/clear
// @desc    Clear all topics (useful for testing)
// @access  Private/Admin
router.delete('/topics/clear', protect, admin, async (req, res) => {
  try {
    const result = await blogAutomation.clearAllTopics();

    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} topics`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear topics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing topics',
      error: error.message
    });
  }
});

module.exports = router;
