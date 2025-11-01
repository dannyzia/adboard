const Ad = require('../models/Ad.model');
const Bid = require('../models/Bid.model');
const User = require('../models/User.model');

/**
 * Sweep auctions that have ended and finalize winners / payment deadlines.
 * - For each auction where auctionEnd < now and status === 'active':
 *   - If no bids: mark auction cancelled/expired
 *   - If bids exist: pick highest bid, mark it winning, set auction status to 'payment-pending', set paymentDeadline (48 hours)
 * This function is intentionally idempotent and can be run regularly (e.g., cron every minute).
 */
async function runAuctionSweep() {
  try {
    const now = new Date();
    const auctions = await Ad.find({
      category: 'Auction',
      'auctionDetails.auctionEnd': { $lte: now },
      'auctionDetails.auctionStatus': 'active'
    });

    for (const auction of auctions) {
      try {
        const bids = await Bid.find({ auctionId: auction._id }).sort({ bidAmount: -1 }).limit(1);
        const topBid = bids[0];

        if (!topBid) {
          // No bids: mark ended with no winner
          auction.auctionDetails.auctionStatus = 'ended';
          auction.status = 'expired';
          auction.contactVisible = true;
          await auction.save();
          console.log(`Auction ${auction._id} ended with no bids`);
          continue;
        }

        // Mark the top bid as winning and others as outbid
        await Bid.updateMany({ auctionId: auction._id }, { isWinning: false, status: 'outbid' });
        topBid.isWinning = true;
        topBid.status = 'winning';
        await topBid.save();

        // Update auction details
        auction.auctionDetails.currentBid = topBid.bidAmount;
        auction.auctionDetails.currentWinnerId = topBid.bidderId;
        auction.auctionDetails.auctionStatus = 'payment-pending';
        // give 48 hours to complete payment
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 48);
        auction.auctionDetails.paymentDeadline = deadline;
        auction.contactVisible = false; // keep contact hidden until payment
        await auction.save();

        // (Placeholder) Notify winner - replace with real notification service
        const winner = await User.findById(topBid.bidderId);
        console.log(`Auction ${auction._id} has top bidder ${winner?.email || topBid.bidderId}, bid ${topBid.bidAmount}. Payment due by ${deadline}`);
      } catch (err) {
        console.error(`Error processing auction ${auction._id}:`, err);
      }
    }
  } catch (error) {
    console.error('runAuctionSweep error:', error);
  }
}

module.exports = { runAuctionSweep };
