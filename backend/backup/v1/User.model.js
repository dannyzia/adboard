// Backup of User.model.js before schema change

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  
  // Subscription Details
  subscription: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan'
    },
    tier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'past_due'],
      default: 'active'
    },
    adsUsed: {
      type: Number,
      default: 0
    },
    adsRemaining: {
      type: Number,
      default: 5 // Free plan default
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    previousPlan: String,
    upgradedAt: Date,
    downgradedAt: Date
  },
  
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad'
  }],
  
  // Suspension/Ban Info
  suspendedUntil: Date,
  suspensionReason: String,
  bannedAt: Date,
  banReason: String,
  
  // OAuth
  googleId: String,
  githubId: String,
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  memberSince: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get JWT token payload
userSchema.methods.getJWTPayload = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    memberSince: this.memberSince,
    subscription: {
      tier: this.subscription.tier,
      adsRemaining: this.subscription.adsRemaining,
      status: this.subscription.status
    },
    favorites: this.favorites
  };
};

// Reset subscription usage monthly
userSchema.methods.resetMonthlyUsage = function() {
  this.subscription.adsUsed = 0;
  // Reset adsRemaining based on plan
  // This will be set when fetching plan details
};

module.exports = mongoose.model('User', userSchema);
