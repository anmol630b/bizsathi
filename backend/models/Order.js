const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required']
    },
    phone: {
      type: String,
      required: [true, 'Customer phone is required']
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
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    },
    total: Number
  }],
  orderNumber: {
    type: String,
    unique: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['whatsapp', 'upi', 'cash', 'online'],
    default: 'whatsapp'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'new'
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  notes: {
    type: String,
    default: null
  },
  isWhatsAppSent: {
    type: Boolean,
    default: false
  },
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Auto generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `BS${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
