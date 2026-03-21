const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Business = require('../models/Business');
const { protect, planCheck } = require('../middleware/auth');

// @route GET /api/analytics/dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Today stats
    const todayOrders = await Order.countDocuments({
      business: business._id,
      createdAt: { $gte: today }
    });
    const todayRevenue = await Order.aggregate([
      { $match: { business: business._id, createdAt: { $gte: today }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // This month stats
    const monthOrders = await Order.countDocuments({
      business: business._id,
      createdAt: { $gte: thisMonth }
    });
    const monthRevenue = await Order.aggregate([
      { $match: { business: business._id, createdAt: { $gte: thisMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Last month stats
    const lastMonthRevenue = await Order.aggregate([
      { $match: { business: business._id, createdAt: { $gte: lastMonth, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Total stats
    const totalCustomers = await Customer.countDocuments({ business: business._id });
    const totalProducts = await Product.countDocuments({ business: business._id });
    const newCustomersThisMonth = await Customer.countDocuments({
      business: business._id,
      createdAt: { $gte: thisMonth }
    });

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $match: { business: business._id } },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { business: business._id } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalOrders: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.total' } } },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 }
    ]);

    // Last 7 days orders
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const count = await Order.countDocuments({
        business: business._id,
        createdAt: { $gte: date, $lt: nextDate }
      });
      const revenue = await Order.aggregate([
        { $match: { business: business._id, createdAt: { $gte: date, $lt: nextDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);
      last7Days.push({
        date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        orders: count,
        revenue: revenue[0]?.total || 0
      });
    }

    const currentMonthRevenue = monthRevenue[0]?.total || 0;
    const previousMonthRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = previousMonthRevenue > 0
      ? (((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)
      : 100;

    res.json({
      success: true,
      analytics: {
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.total || 0
        },
        thisMonth: {
          orders: monthOrders,
          revenue: currentMonthRevenue,
          revenueGrowth: Number(revenueGrowth),
          newCustomers: newCustomersThisMonth
        },
        total: {
          orders: business.totalOrders,
          revenue: business.totalRevenue,
          customers: totalCustomers,
          products: totalProducts
        },
        orderStatusBreakdown,
        topProducts,
        last7Days
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/analytics/revenue
router.get('/revenue', protect, planCheck('starter'), async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const { period = 'monthly' } = req.query;

    let groupBy, dateFormat;
    if (period === 'daily') {
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };
    } else if (period === 'weekly') {
      groupBy = { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } };
    } else {
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
    }

    const revenue = await Order.aggregate([
      { $match: { business: business._id } },
      { $group: { _id: groupBy, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({ success: true, revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
