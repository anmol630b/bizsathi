const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken, generateEmailToken, generateResetToken } = require('../config/jwt');
const { protect } = require('../middleware/auth');

let sendEmail, emailTemplates;
try {
  const emailConfig = require('../config/email');
  sendEmail = emailConfig.sendEmail;
  emailTemplates = emailConfig.emailTemplates;
} catch(e) {
  sendEmail = async () => ({});
  emailTemplates = { welcome: () => '', resetPassword: () => '' };
}

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  userType: user.userType,
  plan: user.plan,
  avatar: user.avatar,
  role: user.role
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, userType: 'user' });
    try { await sendEmail({ to: email, subject: 'Welcome to BizSathi!', html: emailTemplates.welcome(name) }); } catch(e) {}
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Account created!', token, user: userResponse(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/register-business', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, userType: 'business' });
    try { await sendEmail({ to: email, subject: 'Welcome to BizSathi Business!', html: emailTemplates.welcome(name) }); } catch(e) {}
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Business account created!', token, user: userResponse(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please enter email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account is deactivated' });
    user.lastLogin = Date.now();
    user.loginCount += 1;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful', token, user: userResponse(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favouriteStores', 'name slug logo category address');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });
    const resetToken = generateResetToken(user._id);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();
    try { await sendEmail({ to: email, subject: 'Password Reset', html: emailTemplates.resetPassword(user.name, resetToken) }); } catch(e) {}
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET + '_reset');
    const user = await User.findOne({ _id: decoded.id, resetPasswordExpire: { $gt: Date.now() } });
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

router.post('/favourite-store/:businessId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const businessId = req.params.businessId;
    const isFav = user.favouriteStores.includes(businessId);
    if (isFav) user.favouriteStores = user.favouriteStores.filter(id => id.toString() !== businessId);
    else user.favouriteStores.push(businessId);
    await user.save();
    res.json({ success: true, isFavourite: !isFav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

router.post('/save-address', protect, async (req, res) => {
  try {
    const { label, street, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    if (isDefault) user.savedAddresses.forEach(addr => addr.isDefault = false);
    user.savedAddresses.push({ label, street, city, state, pincode, isDefault });
    await user.save();
    res.json({ success: true, message: 'Address saved', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

const { uploadAvatar, handleUploadError } = require('../middleware/upload');
router.post('/upload-avatar', protect, uploadAvatar, handleUploadError, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
    res.json({ success: true, avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
