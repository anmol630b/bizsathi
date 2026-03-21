const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const { sendEmail, emailTemplates } = require('../config/email');
const { generateToken, generateEmailToken, generateResetToken } = require('../config/jwt');
const { protect } = require('../middleware/auth');

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, userType = 'seller' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const emailToken = generateEmailToken(email);
    const user = await User.create({ name, email, password, phone, userType, emailVerifyToken: emailToken });

    await sendEmail({
      to: email,
      subject: 'BizSathi - Welcome!',
      html: emailTemplates.welcome(name)
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    user.lastLogin = Date.now();
    user.loginCount += 1;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        userType: user.userType,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET + '_email');
    const user = await User.findOne({ email: decoded.id });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid token' });
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Token invalid or expired' });
  }
});

// @route POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });
    const resetToken = generateResetToken(user._id);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();
    await sendEmail({
      to: email,
      subject: 'BizSathi - Password Reset',
      html: emailTemplates.resetPassword(user.name, resetToken)
    });
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET + '_reset');
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ success: false, message: 'Token invalid or expired' });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favouriteStores', 'name slug logo category address');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/auth/update-profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/favourite-store
router.post('/favourite-store/:businessId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const businessId = req.params.businessId;
    const isFav = user.favouriteStores.includes(businessId);
    if (isFav) {
      user.favouriteStores = user.favouriteStores.filter(id => id.toString() !== businessId);
    } else {
      user.favouriteStores.push(businessId);
    }
    await user.save();
    res.json({ success: true, isFavourite: !isFav, message: isFav ? 'Removed from favourites' : 'Added to favourites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/save-order
router.post('/save-order', protect, async (req, res) => {
  try {
    const { businessId, businessName, items, total } = req.body;
    const user = await User.findById(req.user._id);
    user.orderHistory.unshift({ business: businessId, businessName, items, total });
    if (user.orderHistory.length > 50) user.orderHistory = user.orderHistory.slice(0, 50);
    await user.save();
    res.json({ success: true, message: 'Order saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/save-address
router.post('/save-address', protect, async (req, res) => {
  try {
    const { label, street, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (isDefault) {
      user.savedAddresses.forEach(addr => addr.isDefault = false);
    }
    user.savedAddresses.push({ label, street, city, state, pincode, isDefault });
    await user.save();
    res.json({ success: true, message: 'Address saved', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/auth/delete-address/:index
router.delete('/delete-address/:index', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedAddresses.splice(req.params.index, 1);
    await user.save();
    res.json({ success: true, message: 'Address deleted', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/upload-avatar
const { uploadAvatar, handleUploadError } = require('../middleware/upload');
router.post('/upload-avatar', protect, uploadAvatar, handleUploadError, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await require('../models/User').findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
    res.json({ success: true, avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
