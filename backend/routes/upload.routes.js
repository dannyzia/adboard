const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary.config');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/upload/single
 * @desc    Upload a single image to Cloudinary
 * @access  Private
 */
router.post('/single', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (error) {
    console.error('Single upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images to Cloudinary (max 5)
 * @access  Private
 */
router.post('/multiple', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: uploadedImages,
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/upload/images
 * @desc    Upload multiple images (Flutter client endpoint - accepts 'files' field)
 * @access  Private
 */
router.post('/images', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.status(201).json({
      success: true,
      data: uploadedImages,
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/upload/:publicId
 * @desc    Delete an image from Cloudinary
 * @access  Private
 */
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // The publicId comes URL-encoded, need to decode it
    const decodedPublicId = decodeURIComponent(publicId);
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok' || result.result === 'not found') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image',
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
});

module.exports = router;
