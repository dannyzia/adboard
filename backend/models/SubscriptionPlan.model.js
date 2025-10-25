const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  tier: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 // in cents
  },
  currency: {
    type: String,
    default: 'USD'
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    required: true
  },
  
  features: {
    adsPerMonth: {
      type: mongoose.Schema.Types.Mixed, // Number or 'unlimited'
      required: true
    },
    listingDuration: {
      type: Number,
      required: true // in days
    },
    imagesPerAd: {
      type: Number,
      required: true
    },
    maxImageSize: {
      type: Number,
      required: true // in MB
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    hasAnalytics: {
      type: Boolean,
      default: false
    },
    hasPrioritySupport: {
      type: Boolean,
      default: false
    },
    hasPriorityPlacement: {
      type: Boolean,
      default: false
    },
    hasApiAccess: {
      type: Boolean,
      default: false
    },
    hasCustomBranding: {
      type: Boolean,
      default: false
    },
    allowedCategories: [{
      type: String
    }]
  },
  
  // Stripe Integration
  stripePriceId: String,
  stripeProductId: String,
  
  // Visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 1
  },
  
  // Metadata
  metadata: {
    description: {
      type: String,
      required: false
    },
    badge: String,
    color: String
  },
  
  // Admin tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  
}, {
  timestamps: true
});

// Index for querying
subscriptionPlanSchema.index({ tier: 1 });
subscriptionPlanSchema.index({ isActive: 1, isVisible: 1 });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
