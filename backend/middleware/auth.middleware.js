const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token invalid.'
      });
    }
    
    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been banned.',
        reason: user.banReason
      });
    }
    
    // Check if user is suspended
    if (user.status === 'suspended') {
      if (user.suspendedUntil && user.suspendedUntil > new Date()) {
        return res.status(403).json({
          success: false,
          message: 'Your account is suspended.',
          suspendedUntil: user.suspendedUntil,
          reason: user.suspensionReason
        });
      } else {
        // Suspension expired, reactivate
        user.status = 'active';
        user.suspendedUntil = undefined;
        user.suspensionReason = undefined;
        await user.save();
      }
    }
    
    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid token.'
    });
  }
};

// Restrict to admin only
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Check subscription limits
exports.checkAdLimit = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Get user's subscription plan
    const SubscriptionPlan = require('../models/SubscriptionPlan.model');
    const plan = await SubscriptionPlan.findOne({ tier: user.subscription.tier });
    
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }
    
    // Check if unlimited
    if (plan.features.adsPerMonth === 'unlimited') {
      return next();
    }
    
    // Check remaining ads
    if (user.subscription.adsRemaining <= 0) {
      return res.status(403).json({
        success: false,
        message: 'You have reached your monthly ad limit. Please upgrade your plan.',
        limit: plan.features.adsPerMonth,
        used: user.subscription.adsUsed
      });
    }
    
    next();
    
  } catch (error) {
    console.error('Check ad limit error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking ad limits'
    });
  }
};
