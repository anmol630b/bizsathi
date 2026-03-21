const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Business = require('../models/Business');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// @route GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/admin/businesses
router.get('/businesses', protect, adminOnly, async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('owner', 'name email plan')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, businesses, total: businesses.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/users/:id/plan
router.put('/users/:id/plan', protect, adminOnly, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
    res.json({ success: true, message: 'Plan updated!', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/users/:id/toggle
router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}!`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    const publishedBusinesses = await Business.countDocuments({ isPublished: true });
    const paidUsers = await User.countDocuments({ plan: { $ne: 'free' } });
    const totalOrders = await Order.countDocuments();
    res.json({ success: true, stats: { totalUsers, totalBusinesses, publishedBusinesses, paidUsers, totalOrders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
