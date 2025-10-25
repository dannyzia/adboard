const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  
  amount: {
    type: Number,
    required: true // in cents
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  type: {
    type: String,
    enum: ['purchase', 'upgrade', 'downgrade', 'renewal', 'refund'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Stripe Info
  stripePaymentIntentId: String,
  stripeInvoiceId: String,
  stripeChargeId: String,
  
  // Metadata
  metadata: {
    oldPlan: String,
    newPlan: String,
    prorated: Boolean,
    description: String
  },
  
  // Error info if failed
  errorMessage: String
  
}, {
  timestamps: true
});

// Indexes
paymentTransactionSchema.index({ user: 1, createdAt: -1 });
paymentTransactionSchema.index({ status: 1 });
paymentTransactionSchema.index({ stripePaymentIntentId: 1 });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
