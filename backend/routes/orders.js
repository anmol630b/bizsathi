const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Business = require('../models/Business');
const { protect } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../config/email');

// @route POST /api/orders/create (public - customer order karta hai)
router.post('/create', async (req, res) => {
  try {
    const { businessId, customer, items, deliveryType, notes, paymentMethod } = req.body;

    const business = await Business.findById(businessId);
    if (!business || !business.isPublished) {
      return res.status(404).json({ success: false, message: 'Store nahi mila' });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = deliveryType === 'delivery' ? 50 : 0;
    const total = subtotal + deliveryCharge;

    const order = await Order.create({
      business: businessId,
      customer,
      items,
      subtotal,
      deliveryCharge,
      total,
      deliveryType,
      notes,
      paymentMethod: paymentMethod || 'whatsapp',
      statusHistory: [{ status: 'new', note: 'Order place kiya gaya' }]
    });

    // Save or update customer
    let existingCustomer = await Customer.findOne({
      business: businessId,
      phone: customer.phone
    });

    if (existingCustomer) {
      existingCustomer.totalOrders += 1;
      existingCustomer.totalSpent += total;
      existingCustomer.lastOrderDate = Date.now();
      existingCustomer.updateTag();
      await existingCustomer.save();
    } else {
      await Customer.create({
        business: businessId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address,
        totalOrders: 1,
        totalSpent: total,
        lastOrderDate: Date.now(),
        tags: ['new']
      });
    }

    // Update business stats
    await Business.findByIdAndUpdate(businessId, {
      $inc: { totalOrders: 1, totalRevenue: total }
    });

    // Send email to business owner
    const owner = await require('../models/User').findById(business.owner);
    if (owner) {
      await sendEmail({
        to: owner.email,
        subject: `BizSathi - Naya Order! #${order.orderNumber}`,
        html: emailTemplates.newOrder(business.name, order.orderNumber, customer.name, total)
      });
    }

    // Generate WhatsApp message
    const itemsList = items.map(i => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('\n');
    const whatsappMessage = `🛒 *Naya Order - ${business.name}*\n\n` +
      `*Order #:* ${order.orderNumber}\n` +
      `*Customer:* ${customer.name}\n` +
      `*Phone:* ${customer.phone}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Subtotal:* ₹${subtotal}\n` +
      `*Delivery:* ₹${deliveryCharge}\n` +
      `*Total:* ₹${total}\n\n` +
      `*Delivery Type:* ${deliveryType === 'delivery' ? 'Home Delivery' : 'Pickup'}\n` +
      `${notes ? `*Notes:* ${notes}` : ''}`;

    const whatsappUrl = `https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    res.status(201).json({
      success: true,
      message: 'Order place ho gaya!',
      order,
      whatsappUrl,
      whatsappMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }

    const { status, page = 1, limit = 20, search } = req.query;
    let query = { business: business._id };
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/orders/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;
    const business = await Business.findOne({ owner: req.user._id });
    const order = await Order.findOne({ _id: req.params.id, business: business._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order nahi mila' });
    }
    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();
    res.json({ success: true, message: 'Order status update ho gaya!', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const order = await Order.findOne({ _id: req.params.id, business: business._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order nahi mila' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/orders/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const order = await Order.findOne({ _id: req.params.id, business: business._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order nahi mila' });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order delete ho gaya!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
