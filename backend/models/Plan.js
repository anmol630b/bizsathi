const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['free', 'starter', 'pro', 'enterprise']
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 }
  },
  features: {
    maxProducts: { type: Number, default: 10 },
    maxOrders: { type: Number, default: 50 },
    maxCustomers: { type: Number, default: 100 },
    customDomain: { type: Boolean, default: false },
    whatsappMarketing: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    paymentGateway: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    removeBranding: { type: Boolean, default: false },
    seoTools: { type: Boolean, default: false },
    multipleTemplates: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isMostPopular: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#1D9E75'
  },
  razorpayPlanId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
