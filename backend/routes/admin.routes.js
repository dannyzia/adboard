const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const PaymentTransaction = require('../models/PaymentTransaction.model');

// All admin routes require authentication and admin role
router.use(protect, admin);

// ========================================
// DASHBOARD & STATS
// ========================================

router.get('/stats', async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const freeUsers = await User.countDocuments({ 'subscription.tier': 'free' });
    const basicUsers = await User.countDocuments({ 'subscription.tier': 'basic' });
    const proUsers = await User.countDocuments({ 'subscription.tier': 'pro' });
    
    // Ad stats
    const totalAds = await Ad.countDocuments();
    const activeAds = await Ad.countDocuments({ status: 'active' });
    const expiredAds = await Ad.countDocuments({ status: 'expired' });
    const archivedAds = await Ad.countDocuments({ status: 'archived' });
    const deletedAds = await Ad.countDocuments({ status: 'deleted' });
    
    // Revenue stats (from subscription plans and transactions)
    const transactions = await PaymentTransaction.find({ status: 'completed' });
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthlyRevenue = transactions
      .filter(t => new Date(t.createdAt) >= thisMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Recent activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newAdsToday = await Ad.countDocuments({ createdAt: { $gte: today } });
    const newUsersToday = await User.countDocuments({ memberSince: { $gte: today } });
    
    const recentUsers = await User.find().sort('-memberSince').limit(5);
    const recentAds = await Ad.find().sort('-createdAt').limit(5).populate('user', 'name email');
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        freeUsers,
        basicUsers,
        proUsers,
        totalAds,
        activeAds,
        expiredAds,
        archivedAds,
        deletedAds,
        totalRevenue: totalRevenue / 100, // Convert cents to dollars
        monthlyRevenue: monthlyRevenue / 100,
        newAdsToday,
        newUsersToday
      },
      recentUsers,
      recentAds
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

// ========================================
// USER MANAGEMENT
// ========================================

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

router.put('/users/:id/suspend', async (req, res) => {
  try {
    const { days, reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.status = 'suspended';
    user.suspendedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    user.suspensionReason = reason;
    await user.save();
    
    res.json({ success: true, message: 'User suspended', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error suspending user' });
  }
});

router.put('/users/:id/ban', async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.status = 'banned';
    user.bannedAt = new Date();
    user.banReason = reason;
    await user.save();
    
    res.json({ success: true, message: 'User banned', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error banning user' });
  }
});

router.put('/users/:id/reactivate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.status = 'active';
    user.suspendedUntil = undefined;
    user.suspensionReason = undefined;
    user.bannedAt = undefined;
    user.banReason = undefined;
    await user.save();
    
    res.json({ success: true, message: 'User reactivated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reactivating user' });
  }
});

// ========================================
// AD MANAGEMENT
// ========================================

router.get('/ads', async (req, res) => {
  try {
    // Support optional filters (status, category, country, state, city) and pagination
    const {
      page = 1,
      limit = 50,
      status,
      category,
      country,
      state,
      city,
      search,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;
    if (country && country !== 'All Countries') filter['location.country'] = country;
    if (state && state !== 'All States') filter['location.state'] = state;
    if (city && city !== 'All Cities') filter['location.city'] = city;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const ads = await Ad.find(filter)
      .populate('user', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Ad.countDocuments(filter);
    res.json({ success: true, ads, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching ads' });
  }
});

router.put('/ads/:id/approve', async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    res.json({ success: true, message: 'Ad approved', ad });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving ad' });
  }
});

router.put('/ads/:id/archive', async (req, res) => {
  try {
    const { reason } = req.body;
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      {
        status: 'archived',
        archivedAt: new Date(),
        archivedBy: req.user._id,
        archiveReason: reason
      },
      { new: true }
    );
    res.json({ success: true, message: 'Ad archived', ad });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error archiving ad' });
  }
});

router.delete('/ads/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ad deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting ad' });
  }
});

// ========================================
// SUBSCRIPTION PLAN MANAGEMENT
// ========================================

router.get('/subscriptions', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort('displayOrder');
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans' });
  }
});

router.post('/subscriptions', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, message: 'Plan created', plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/subscriptions/:id', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Plan updated', plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/subscriptions/:id', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    
    if (plan.tier === 'free') {
      return res.status(400).json({ success: false, message: 'Cannot delete free plan' });
    }
    
    await plan.deleteOne();
    res.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/subscriptions/:id/toggle-visibility', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    plan.isVisible = !plan.isVisible;
    await plan.save();
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/subscriptions/:id/toggle-status', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    plan.isActive = !plan.isActive;
    await plan.save();
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========================================
// REPORTS
// ========================================

router.get('/reports', async (req, res) => {
  try {
    const flaggedAds = await Ad.find({ status: 'flagged' })
      .populate('user', 'name email')
      .sort('-reportCount');
    
    res.json({ success: true, flaggedAds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
});

module.exports = router;
