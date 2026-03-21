const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: null
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: -1
  },
  unit: {
    type: String,
    enum: ['piece', 'kg', 'gram', 'liter', 'pack', 'dozen', 'service'],
    default: 'piece'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  tags: [String],
  whatsappMessage: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function() {
  if (this.discountPrice && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
