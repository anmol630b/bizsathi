const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { protect, planCheck } = require('../middleware/auth');
const { uploadLogo, uploadCover, handleUploadError } = require('../middleware/upload');

// @route POST /api/business/create
router.post('/create', protect, async (req, res) => {
  try {
    const existing = await Business.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Aapki business already exist karti hai' });
    }
    const business = await Business.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, message: 'Business ban gayi!', business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/business/my
router.get('/my', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }
    res.json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/business/update
router.put('/update', protect, async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }
    res.json({ success: true, message: 'Business update ho gayi!', business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/business/upload-logo
router.post('/upload-logo', protect, uploadLogo, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Logo upload karein' });
    }
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { logo: logoUrl },
      { new: true }
    );
    res.json({ success: true, message: 'Logo upload ho gaya!', logo: logoUrl, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/business/upload-cover
router.post('/upload-cover', protect, uploadCover, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Cover image upload karein' });
    }
    const coverUrl = `/uploads/covers/${req.file.filename}`;
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { coverImage: coverUrl },
      { new: true }
    );
    res.json({ success: true, message: 'Cover upload ho gaya!', coverImage: coverUrl, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/business/publish
router.post('/publish', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business nahi mili' });
    }
    if (!business.name || !business.phone || !business.whatsapp) {
      return res.status(400).json({ success: false, message: 'Business name, phone aur whatsapp number zaroori hai' });
    }
    business.isPublished = true;
    business.publishedAt = Date.now();
    await business.save();
    res.json({
      success: true,
      message: 'Website publish ho gayi!',
      url: `${process.env.FRONTEND_URL}/store/${business.slug}`,
      business
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/business/unpublish
router.post('/unpublish', protect, async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { isPublished: false },
      { new: true }
    );
    res.json({ success: true, message: 'Website unpublish ho gayi!', business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/business/store/:slug (public)
router.get('/store/:slug', async (req, res) => {
  try {
    const business = await Business.findOne({
      slug: req.params.slug,
      isPublished: true,
      isActive: true
    }).populate('owner', 'name email');
    if (!business) {
      return res.status(404).json({ success: false, message: 'Store nahi mila' });
    }
    res.json({ success: true, business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/business/seo
router.put('/seo', protect, planCheck('starter'), async (req, res) => {
  try {
    const { title, description, keywords } = req.body;
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { seo: { title, description, keywords } },
      { new: true }
    );
    res.json({ success: true, message: 'SEO settings save ho gayi!', business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/business/custom-domain
router.put('/custom-domain', protect, planCheck('pro'), async (req, res) => {
  try {
    const { domain } = req.body;
    const existing = await Business.findOne({ customDomain: domain });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Yeh domain already use ho raha hai' });
    }
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      { customDomain: domain },
      { new: true }
    );
    res.json({ success: true, message: 'Custom domain save ho gaya!', business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
