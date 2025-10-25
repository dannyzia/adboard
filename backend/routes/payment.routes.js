const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const SubscriptionPlan = require('../models/SubscriptionPlan.model');
const PaymentTransaction = require('../models/PaymentTransaction.model');

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    // Create or get Stripe customer
    let customerId = req.user.subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user._id.toString() }
      });
      customerId = customer.id;
      
      req.user.subscription.stripeCustomerId = customerId;
      await req.user.save();
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.stripePriceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: req.user._id.toString(),
        planId: plan._id.toString()
      }
    });
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook handler
// @access  Public (Stripe only)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
});

// Handle successful checkout
async function handleCheckoutComplete(session) {
  try {
    const userId = session.metadata.userId;
    const planId = session.metadata.planId;
    
    const user = await User.findById(userId);
    const plan = await SubscriptionPlan.findById(planId);
    
    if (!user || !plan) return;
    
    // Update user subscription
    user.subscription.planId = plan._id;
    user.subscription.tier = plan.tier;
    user.subscription.status = 'active';
    user.subscription.stripeSubscriptionId = session.subscription;
    user.subscription.currentPeriodStart = new Date();
    user.subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.subscription.adsRemaining = plan.features.adsPerMonth === 'unlimited' 
      ? 999999 
      : plan.features.adsPerMonth;
    
    await user.save();
    
    // Create transaction record
    await PaymentTransaction.create({
      user: userId,
      plan: planId,
      amount: session.amount_total,
      currency: session.currency,
      type: 'purchase',
      status: 'succeeded',
      stripePaymentIntentId: session.payment_intent
    });
    
  } catch (error) {
    console.error('Handle checkout error:', error);
  }
}

// Handle subscription update
async function handleSubscriptionUpdated(subscription) {
  // Implementation for subscription updates
  console.log('Subscription updated:', subscription.id);
}

// Handle subscription cancellation
async function handleSubscriptionCanceled(subscription) {
  try {
    const user = await User.findOne({ 
      'subscription.stripeSubscriptionId': subscription.id 
    });
    
    if (user) {
      user.subscription.status = 'canceled';
      user.subscription.tier = 'free';
      await user.save();
    }
  } catch (error) {
    console.error('Handle cancellation error:', error);
  }
}

module.exports = router;
