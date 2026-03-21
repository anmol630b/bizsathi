const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

const plans = [
  { id: 'free', name: 'Free', price: 0, duration: null, features: ['10 Products', '50 Orders', 'WhatsApp Button', 'Basic Website'] },
  { id: 'starter', name: 'Starter', price: 299, duration: 30, features: ['50 Products', '500 Orders', 'SEO Tools', 'Analytics'] },
  { id: 'pro', name: 'Pro', price: 599, duration: 30, features: ['500 Products', 'Custom Domain', 'WhatsApp Marketing', 'Payment Gateway'] },
  { id: 'enterprise', name: 'Enterprise', price: 999, duration: 30, features: ['Unlimited', 'API Access', 'Priority Support', 'White Label'] }
];

router.get('/', (req, res) => {
  res.json({ success: true, plans });
});

router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ success: false, message: 'Payment gateway not configured yet.' });
    const { planId } = req.body;
    const plan = plans.find(p => p.id === planId);
    if (!plan || plan.price === 0) return res.status(400).json({ success: false, message: 'Invalid plan' });
    const order = await razorpay.orders.create({ amount: plan.price * 100, currency: 'INR', receipt: `receipt_${Date.now()}` });
    res.json({ success: true, order, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    if (!razorpay) return res.status(503).json({ success: false, message: 'Payment gateway not configured yet.' });
    const { planId } = req.body;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ success: false, message: 'Invalid plan' });
    const expiry = plan.duration ? new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000) : null;
    await User.findByIdAndUpdate(req.user._id, { plan: planId, planExpiry: expiry });
    res.json({ success: true, message: 'Plan activated!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
