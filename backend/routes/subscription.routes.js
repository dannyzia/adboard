const express = require('express');
const router = express.Router();
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   GET /api/subscriptions/plans
// @desc    Get all active/visible subscription plans
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({
      isActive: true,
      isVisible: true
    }).sort('displayOrder');
    
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ success: false, message: 'Error fetching plans' });
  }
});

// @route   GET /api/subscriptions/admin/plans
// @desc    Get all plans (including inactive)
// @access  Admin
router.get('/admin/plans', protect, admin, async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort('displayOrder');
    
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Error fetching admin plans:', error);
    res.status(500).json({ success: false, message: 'Error fetching plans' });
  }
});

// @route   POST /api/subscriptions/admin/plans
// @desc    Create new subscription plan
// @access  Admin
router.post('/admin/plans', protect, admin, async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ success: false, message: 'Error creating plan' });
  }
});

// @route   PUT /api/subscriptions/admin/plans/:id
// @desc    Update subscription plan
// @access  Admin
router.put('/admin/plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ success: false, message: 'Error updating plan' });
  }
});

// @route   DELETE /api/subscriptions/admin/plans/:id
// @desc    Delete subscription plan
// @access  Admin
router.delete('/admin/plans/:id', protect, admin, async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    // Prevent deleting the Free tier
    if (plan.tier === 'free') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete the Free tier plan' 
      });
    }
    
    await plan.deleteOne();
    
    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ success: false, message: 'Error deleting plan' });
  }
});

// @route   GET /api/subscriptions/:id
// @desc    Get single plan
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ success: false, message: 'Error fetching plan' });
  }
});

module.exports = router;
