const mongoose = require('mongoose');
const { getCategoryValues } = require('../config/categories.config');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: getCategoryValues()
  },
  
  // Location
  location: {
    country: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String, // Cloudinary public ID for deletion
    order: Number
  }],
  
  // User/Owner
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Contact Info
  contactEmail: String,
  contactPhone: String,
  
  // External Links
  links: {
    link1: String,
    link2: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'expired', 'archived', 'flagged'],
    default: 'active'
  },
  
  // Featured
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Views & Favorites
  views: {
    type: Number,
    default: 0
  },
  favoritedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Expiration
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Reports/Flags
  reportCount: {
    type: Number,
    default: 0
  },
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // SEO
  slug: {
    type: String,
    unique: true
  },
  
  // Archive Info (when status = 'archived')
  archivedAt: Date,
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  archiveReason: String
  
}, {
  timestamps: true
});

// Indexes for better query performance
adSchema.index({ status: 1, createdAt: -1 });
adSchema.index({ category: 1, status: 1 });
adSchema.index({ 'location.country': 1, 'location.state': 1, 'location.city': 1 });
adSchema.index({ user: 1 });
adSchema.index({ slug: 1 });
adSchema.index({ expiresAt: 1 });

// Generate slug before saving
adSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Increment view count
adSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Check if ad is expired
adSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

module.exports = mongoose.model('Ad', adSchema);
