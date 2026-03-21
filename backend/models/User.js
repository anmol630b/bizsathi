const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number']
  },
  avatar: {
    type: String,
    default: null
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free'
  },
  planExpiry: {
    type: Date,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifyToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if plan is active
userSchema.methods.isPlanActive = function() {
  if (this.plan === 'free') return true;
  return this.planExpiry && this.planExpiry > Date.now();
};

module.exports = mongoose.model('User', userSchema);
