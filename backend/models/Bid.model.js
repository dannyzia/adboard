const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true,
    index: true
  },
  bidderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bidAmount: {
    type: Number,
    required: true,
    min: [0, 'Bid amount must be non-negative']
  },
  status: {
    type: String,
    enum: ['active', 'outbid', 'winning', 'won', 'lost'],
    default: 'active'
  },
  isWinning: {
    type: Boolean,
    default: false,
    index: true
  },
  placedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for fast lookup: highest bid per auction and quick lookup of winning bid
bidSchema.index({ auctionId: 1, bidAmount: -1 });
bidSchema.index({ auctionId: 1, isWinning: 1 });

module.exports = mongoose.model('Bid', bidSchema);
