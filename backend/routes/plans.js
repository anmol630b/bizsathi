const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Plan = require('../models/Plan');
const { protect } = require('../middleware/auth');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route GET /api/plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ 'price.monthly': 1 });
    if (plans.length === 0) {
      return res.json({
        success: true,
        plans: [
          {
            name: 'free',
            displayName: 'Free',
            description: 'Shuruat karne ke liye',
            price: { monthly: 0, yearly: 0 },
            features: {
              maxProducts: 10,
              maxOrders: 50,
              maxCustomers: 100,
              customDomain: false,
              whatsappMarketing: false,
              analytics: false,
              paymentGateway: false,
              prioritySupport: false,
              removeBranding: false,
              seoTools: false,
              multipleTemplates: false,
              apiAccess: false
            },
            isMostPopular: false,
            color: '#888780'
          },
          {
            name: 'starter',
            displayName: 'Starter',
            description: 'Chhote business ke liye',
            price: { monthly: 299, yearly: 2990 },
            features: {
              maxProducts: 50,
              maxOrders: 500,
              maxCustomers: 1000,
              customDomain: false,
              whatsappMarketing: false,
              analytics: true,
              paymentGateway: false,
              prioritySupport: false,
              removeBranding: false,
              seoTools: true,
              multipleTemplates: true,
              apiAccess: false
            },
            isMostPopular: false,
            color: '#1D9E75'
          },
          {
            name: 'pro',
            displayName: 'Pro',
            description: 'Growing business ke liye',
            price: { monthly: 599, yearly: 5990 },
            features: {
              maxProducts: 500,
              maxOrders: 5000,
              maxCustomers: 10000,
              customDomain: true,
              whatsappMarketing: true,
              analytics: true,
              paymentGateway: true,
              prioritySupport: true,
              removeBranding: true,
              seoTools: true,
              multipleTemplates: true,
              apiAccess: false
            },
            isMostPopular: true,
            color: '#534AB7'
          },
          {
            name: 'enterprise',
            displayName: 'Enterprise',
            description: 'Bade business ke liye',
            price: { monthly: 999, yearly: 9990 },
            features: {
              maxProducts: 99999,
              maxOrders: 99999,
              maxCustomers: 99999,
              customDomain: true,
              whatsappMarketing: true,
              analytics: true,
              paymentGateway: true,
              prioritySupport: true,
              removeBranding: true,
              seoTools: true,
              multipleTemplates: true,
              apiAccess: true
            },
            isMostPopular: false,
            color: '#D85A30'
          }
        ]
      });
    }
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/plans/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { plan, billing } = req.body;
    const planPrices = {
      starter: { monthly: 299, yearly: 2990 },
      pro: { monthly: 599, yearly: 5990 },
      enterprise: { monthly: 999, yearly: 9990 }
    };

    if (!planPrices[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const amount = planPrices[plan][billing || 'monthly'] * 100;
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `bizsathi_${req.user._id}_${Date.now()}`,
      notes: { userId: req.user._id.toString(), plan, billing }
    });

    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/plans/verify-payment
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billing } = req.body;
    const crypto = require('crypto');
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const expiry = new Date();
    if (billing === 'yearly') {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 1);
    }

    await User.findByIdAndUpdate(req.user._id, {
      plan,
      planExpiry: expiry
    });

    res.json({
      success: true,
      message: `${plan} plan activate ho gaya!`,
      expiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
