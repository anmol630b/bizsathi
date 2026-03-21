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
    required: [true, 'Phone number is required']
  },
  avatar: { type: String, default: null },
  userType: {
    type: String,
    enum: ['user', 'business'],
    default: 'user'
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free'
  },
  planExpiry: { type: Date, default: null },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },
  savedAddresses: [{
    label: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  favouriteStores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }],
  orderHistory: [{
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    businessName: String,
    items: String,
    total: Number,
    orderedAt: { type: Date, default: Date.now }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isPlanActive = function() {
  if (this.plan === 'free') return true;
  return this.planExpiry && this.planExpiry > Date.now();
};

module.exports = mongoose.model('User', userSchema);
