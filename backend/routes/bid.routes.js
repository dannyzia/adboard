const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const Bid = require('../models/Bid.model');
const Ad = require('../models/Ad.model');
const User = require('../models/User.model');

// Place a bid on an auction
// POST /api/bids/:auctionId/place
router.post('/:auctionId/place', protect, [
  body('bidAmount').isNumeric().withMessage('bidAmount must be a number')
], async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidAmount } = req.body;

    const auction = await Ad.findById(auctionId);
    if (!auction) return res.status(404).json({ success: false, message: 'Auction not found' });
    if (auction.category !== 'Auction') return res.status(400).json({ success: false, message: 'Not an auction' });
    if (!auction.auctionDetails || auction.auctionDetails.auctionStatus !== 'active') return res.status(400).json({ success: false, message: 'Auction is not active' });
    const now = new Date();
    if (auction.auctionDetails.auctionEnd && new Date(auction.auctionDetails.auctionEnd) <= now) {
      return res.status(400).json({ success: false, message: 'Auction has already ended' });
    }

    const minAccept = auction.auctionDetails.currentBid || auction.auctionDetails.startingBid || 0;
    if (bidAmount <= minAccept) {
      return res.status(400).json({ success: false, message: `Bid must be greater than current bid (${minAccept})` });
    }

    // Create bid
    const bid = await Bid.create({
      auctionId,
      bidderId: req.user._id,
      bidAmount,
      status: 'winning',
      isWinning: true
    });

    // Mark previous winning bids as outbid and not winning
    await Bid.updateMany({ auctionId: auctionId, isWinning: true, _id: { $ne: bid._id } }, { isWinning: false, status: 'outbid' });

    // Update auction's current bid info
    auction.auctionDetails.currentBid = bidAmount;
    auction.auctionDetails.currentWinnerId = req.user._id;
    auction.auctionDetails.bidCount = (auction.auctionDetails.bidCount || 0) + 1;
    await auction.save();

    res.json({ success: true, message: 'Bid placed', bid });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ success: false, message: 'Error placing bid' });
  }
});

// Get bids for an auction (public)
// GET /api/bids/:auctionId
router.get('/:auctionId', async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await Bid.find({ auctionId }).populate('bidderId', 'name avatar');
    res.json({ success: true, bids });
  } catch (error) {
    console.error('Get auction bids error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bids' });
  }
});

// Get current user's bids
// GET /api/bids/my-bids
router.get('/my-bids', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ bidderId: req.user._id }).populate('auctionId');
    res.json({ success: true, bids });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ success: false, message: 'Error fetching your bids' });
  }
});

// Confirm payment (winner confirms payment)
// POST /api/bids/:auctionId/confirm-payment
router.post('/:auctionId/confirm-payment', protect, async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Ad.findById(auctionId);
    if (!auction) return res.status(404).json({ success: false, message: 'Auction not found' });

    if (!auction.auctionDetails || auction.auctionDetails.auctionStatus !== 'payment-pending') {
      return res.status(400).json({ success: false, message: 'Auction not awaiting payment' });
    }

    // Find winning bid
    const winningBid = await Bid.findOne({ auctionId, isWinning: true });
    if (!winningBid) return res.status(400).json({ success: false, message: 'No winning bid found' });
    if (winningBid.bidderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not the winning bidder' });
    }

    // Mark bid as won and finalize auction
    winningBid.status = 'won';
    winningBid.isWinning = true;
    await winningBid.save();

    auction.auctionDetails.auctionStatus = 'completed';
    auction.auctionDetails.winnerId = winningBid.bidderId;
    auction.auctionDetails.winningBid = winningBid.bidAmount;
    auction.auctionDetails.paymentReceived = true;
    auction.status = 'sold';
    auction.contactVisible = true; // show contact now
    await auction.save();

    res.json({ success: true, message: 'Payment confirmed, auction completed' });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, message: 'Error confirming payment' });
  }
});

module.exports = router;
