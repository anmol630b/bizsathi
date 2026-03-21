const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Business = require('../models/Business');
const { protect, planCheck } = require('../middleware/auth');

// @route GET /api/customers/my
router.get('/my', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }

    const { tag, search, sort, page = 1, limit = 20 } = req.query;
    let query = { business: business._id };
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'orders') sortObj = { totalOrders: -1 };
    if (sort === 'spent') sortObj = { totalSpent: -1 };
    if (sort === 'recent') sortObj = { lastOrderDate: -1 };

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      customers,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/customers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const customer = await Customer.findOne({ _id: req.params.id, business: business._id });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer nahi mila' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/customers/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, business: business._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer nahi mila' });
    }
    res.json({ success: true, message: 'Customer update ho gaya!', customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/customers/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, business: business._id });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer nahi mila' });
    }
    res.json({ success: true, message: 'Customer delete ho gaya!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/customers/whatsapp-broadcast
router.post('/whatsapp-broadcast', protect, planCheck('pro'), async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const { message, tag } = req.body;

    let query = { business: business._id, whatsappOptIn: true, isBlocked: false };
    if (tag) query.tags = tag;

    const customers = await Customer.find(query).select('name phone');
    if (customers.length === 0) {
      return res.status(404).json({ success: false, message: 'Koi customer nahi mila' });
    }

    const whatsappLinks = customers.map(c => ({
      name: c.name,
      phone: c.phone,
      url: `https://wa.me/91${c.phone}?text=${encodeURIComponent(message)}`
    }));

    res.json({
      success: true,
      message: `${customers.length} customers ke liye WhatsApp links ready hain!`,
      totalCustomers: customers.length,
      whatsappLinks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/customers/:id/block
router.put('/:id/block', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const customer = await Customer.findOne({ _id: req.params.id, business: business._id });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer nahi mila' });
    }
    customer.isBlocked = !customer.isBlocked;
    await customer.save();
    res.json({
      success: true,
      message: `Customer ${customer.isBlocked ? 'block' : 'unblock'} ho gaya!`,
      customer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
