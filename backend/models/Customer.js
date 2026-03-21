const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  email: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    enum: ['new', 'regular', 'vip', 'inactive']
  }],
  notes: {
    type: String,
    default: null
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  whatsappOptIn: {
    type: Boolean,
    default: true
  },
  birthday: {
    type: Date,
    default: null
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  }
}, { timestamps: true });

// Auto tag customer
customerSchema.methods.updateTag = function() {
  if (this.totalOrders === 0) {
    this.tags = ['new'];
  } else if (this.totalOrders >= 10 || this.totalSpent >= 5000) {
    this.tags = ['vip'];
  } else if (this.totalOrders >= 3) {
    this.tags = ['regular'];
  }
  const daysSinceLastOrder = this.lastOrderDate
    ? (Date.now() - this.lastOrderDate) / (1000 * 60 * 60 * 24)
    : 999;
  if (daysSinceLastOrder > 30) {
    this.tags.push('inactive');
  }
  return this;
};

module.exports = mongoose.model('Customer', customerSchema);
