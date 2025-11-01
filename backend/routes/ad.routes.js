const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const { protect, checkAdLimit } = require('../middleware/auth.middleware');

// @route   GET /api/ads
// @desc    Get all ads with filters and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 48,
      category,
      country,
      state,
      city,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query;
    
    // Build filter query
    const filter = { status: 'active' };
    
    if (category && category !== 'All Categories') {
      filter.category = category;
    }
    
    if (country && country !== 'All Countries') {
      filter['location.country'] = country;
    }
    
    if (state && state !== 'All States') {
      filter['location.state'] = state;
    }
    
    if (city && city !== 'All Cities') {
      filter['location.city'] = city;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Check for expired ads
    filter.expiresAt = { $gt: new Date() };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const ads = await Ad.find(filter)
      .populate('user', 'name avatar email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Ad.countDocuments(filter);
    
    res.json({
      success: true,
      ads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ads'
    });
  }
});

// @route   GET /api/ads/similar
// @desc    Get similar ads based on category and location
// @access  Public
router.get('/similar', async (req, res) => {
  try {
    const { category, exclude, limit = 3, city, state, country } = req.query;
    
    const filter = {
      status: 'active',
      _id: { $ne: exclude },
      expiresAt: { $gt: new Date() }
    };
    
    if (category) filter.category = category;
    if (country) filter['location.country'] = country;
    if (state) filter['location.state'] = state;
    if (city) filter['location.city'] = city;
    
    const ads = await Ad.find(filter)
      .populate('user', 'name avatar email')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      ads
    });
  } catch (error) {
    console.error('Get similar ads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching similar ads'
    });
  }
});

// @route   GET /api/ads/:id
// @desc    Get single ad by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('user', 'name avatar email phone memberSince');
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    // Increment views
    await ad.incrementViews();
    
    res.json({
      success: true,
      ad
    });
    
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ad'
    });
  }
});

// @route   POST /api/ads
// @desc    Create new ad
// @access  Private
router.post('/', protect, checkAdLimit, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.city').notEmpty().withMessage('City is required')
], async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      currency,
      category,
      location,
      images,
      contactEmail,
      contactPhone,
      links,
      customDuration // Optional: user-selected duration in days
    } = req.body;
    
    // Get user's subscription plan
    const plan = await SubscriptionPlan.findOne({ tier: req.user.subscription.tier });
    
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }
    
    // Determine listing duration
    let listingDuration = plan.features.listingDuration; // Default to plan's max
    
    if (customDuration) {
      const requestedDuration = parseInt(customDuration);
      
      // Validate: custom duration must not exceed plan limit
      if (requestedDuration > plan.features.listingDuration) {
        return res.status(403).json({
          success: false,
          message: `Your ${plan.tier} plan allows ads up to ${plan.features.listingDuration} days. Please upgrade to extend duration.`,
          maxDuration: plan.features.listingDuration,
          requestedDuration: requestedDuration,
          upgradeRequired: true
        });
      }
      
      // Validate: minimum 1 day
      if (requestedDuration < 1) {
        return res.status(400).json({
          success: false,
          message: 'Ad duration must be at least 1 day'
        });
      }
      
      listingDuration = requestedDuration;
    }
    
    // Calculate expiration date based on determined duration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + listingDuration);
    
    // If Auction category, expect auctionDetails fields instead of price
    let adPayload = {
      title,
      description,
      currency,
      category,
      location,
      images: images || [],
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone,
      links: links || {},
      user: req.user._id,
      isFeatured: plan.features.isFeatured,
      expiresAt
    };

    if (category === 'Auction') {
      const { auctionEnd, startingBid, reservePrice } = req.body;
      if (!auctionEnd || !startingBid) {
        return res.status(400).json({ success: false, message: 'Auction requires auctionEnd and startingBid' });
      }

      // Validate auctionEnd is a valid future date and startingBid is positive
      const auctionEndDate = new Date(auctionEnd);
      if (isNaN(auctionEndDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid auctionEnd date' });
      }
      if (auctionEndDate <= new Date()) {
        return res.status(400).json({ success: false, message: 'auctionEnd must be a future date/time' });
      }
      const starting = parseFloat(startingBid);
      if (isNaN(starting) || starting <= 0) {
        return res.status(400).json({ success: false, message: 'startingBid must be a number greater than 0' });
      }

      adPayload.contactVisible = false; // hide contact until auction completes and paid
      adPayload.auctionDetails = {
        auctionEnd: new Date(auctionEnd),
        startingBid: parseFloat(startingBid),
        reservePrice: reservePrice ? parseFloat(reservePrice) : undefined,
        currentBid: undefined,
        currentWinnerId: undefined,
        bidCount: 0,
        auctionStatus: 'active',
        winnerId: undefined,
        winningBid: undefined,
        paymentDeadline: undefined,
        paymentReceived: false
      };

      // Do not set price for auction postings
    } else {
      // Non-auction: price is required
      if (price === undefined || price === null || price === '') {
        return res.status(400).json({ success: false, message: 'Price is required for non-auction listings' });
      }
      adPayload.price = parseFloat(price);
    }

    // Create ad
    const ad = await Ad.create(adPayload);
    
    // Update user's ad usage
    req.user.subscription.adsUsed += 1;
    if (plan.features.adsPerMonth !== 'unlimited') {
      req.user.subscription.adsRemaining -= 1;
    }
    await req.user.save();
    
    // Populate user info
    await ad.populate('user', 'name avatar email');
    
    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      ad
    });
    
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating ad'
    });
  }
});

// @route   PUT /api/ads/:id
// @desc    Update ad
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    // Check ownership
    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ad'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'price', 'currency', 'images', 'contactEmail', 'contactPhone', 'links'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        ad[field] = req.body[field];
      }
    });
    
    await ad.save();
    
    res.json({
      success: true,
      message: 'Ad updated successfully',
      ad
    });
    
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ad'
    });
  }
});

// @route   DELETE /api/ads/:id
// @desc    Delete ad
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    // Check ownership
    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this ad'
      });
    }
    
    await ad.deleteOne();
    
    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ad'
    });
  }
});

// @route   GET /api/ads/user/:userId
// @desc    Get user's ads
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const ads = await Ad.find({
      user: req.params.userId,
      status: 'active'
    }).sort('-createdAt');
    
    res.json({
      success: true,
      ads
    });
    
  } catch (error) {
    console.error('Get user ads error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user ads'
    });
  }
});

// @route   POST /api/ads/:id/favorite
// @desc    Toggle favorite ad
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    const isFavorited = user.favorites.includes(ad._id);
    
    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(fav => fav.toString() !== ad._id.toString());
      ad.favoritedBy = ad.favoritedBy.filter(userId => userId.toString() !== user._id.toString());
    } else {
      // Add to favorites
      user.favorites.push(ad._id);
      ad.favoritedBy.push(user._id);
    }
    
    await user.save();
    await ad.save();
    
    res.json({
      success: true,
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited
    });
    
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling favorite'
    });
  }
});

// @route   POST /api/ads/:id/report
// @desc    Report ad
// @access  Private
router.post('/:id/report', protect, [
  body('reason').trim().notEmpty().withMessage('Reason is required')
], async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }
    
    // Check if already reported by this user
    const alreadyReported = ad.reports.some(
      report => report.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this ad'
      });
    }
    
    ad.reports.push({
      user: req.user._id,
      reason: req.body.reason
    });
    ad.reportCount += 1;
    
    // Auto-flag if too many reports
    if (ad.reportCount >= 5) {
      ad.status = 'flagged';
    }
    
    await ad.save();
    
    res.json({
      success: true,
      message: 'Ad reported successfully'
    });
    
  } catch (error) {
    console.error('Report ad error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting ad'
    });
  }
});

module.exports = router;
