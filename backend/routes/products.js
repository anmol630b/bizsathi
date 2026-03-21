const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Business = require('../models/Business');
const { protect } = require('../middleware/auth');
const { uploadProduct, handleUploadError } = require('../middleware/upload');

// @route POST /api/products/add
router.post('/add', protect, uploadProduct, handleUploadError, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Pehle business banayein' });
    }

    const planLimits = { free: 10, starter: 50, pro: 500, enterprise: 99999 };
    const limit = planLimits[req.user.plan] || 10;
    const count = await Product.countDocuments({ business: business._id });
    if (count >= limit) {
      return res.status(403).json({
        success: false,
        message: `Aapke plan mein sirf ${limit} products allowed hain. Upgrade karein!`,
        upgradeRequired: true
      });
    }

    const images = req.files ? req.files.map(f => `/uploads/products/${f.filename}`) : [];
    const product = await Product.create({
      ...req.body,
      business: business._id,
      images,
      price: Number(req.body.price),
      discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : null
    });

    res.status(201).json({ success: true, message: 'Product add ho gaya!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/products/my
router.get('/my', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    let query = { business: business._id };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'name') sortObj = { name: 1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/products/store/:businessId (public)
router.get('/store/:businessId', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = { business: req.params.businessId, isAvailable: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;

    const products = await Product.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, business: business._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product nahi mila' });
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, price: Number(req.body.price) },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Product update ho gaya!', product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, business: business._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product nahi mila' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product delete ho gaya!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/products/:id/toggle
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, business: business._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product nahi mila' });
    }
    product.isAvailable = !product.isAvailable;
    await product.save();
    res.json({
      success: true,
      message: `Product ${product.isAvailable ? 'available' : 'unavailable'} kar diya!`,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/products/:id/featured
router.put('/:id/featured', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    const product = await Product.findOne({ _id: req.params.id, business: business._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product nahi mila' });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({
      success: true,
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} kar diya!`,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
