const mongoose = require('mongoose');
const slug = require('slug');

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['shop', 'gym', 'coaching', 'salon', 'restaurant', 'medical', 'other'],
    default: 'shop'
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'bold', 'minimal'],
    default: 'modern'
  },
  logo: { type: String, default: null },
  coverImage: { type: String, default: null },
  phone: { type: String, required: [true, 'Phone number is required'] },
  whatsapp: { type: String, required: [true, 'WhatsApp number is required'] },
  email: { type: String, default: null },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  socialLinks: {
    instagram: { type: String, default: null },
    facebook: { type: String, default: null },
    youtube: { type: String, default: null }
  },
  seo: {
    title: String,
    description: String,
    keywords: String
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  customDomain: { type: String, default: null },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalCustomers: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

businessSchema.index({ location: '2dsphere' });

businessSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  let baseSlug = slug(this.name, { lower: true });
  let finalSlug = baseSlug;
  let count = 1;
  while (await mongoose.model('Business').findOne({ slug: finalSlug, _id: { $ne: this._id } })) {
    finalSlug = `${baseSlug}-${count}`;
    count++;
  }
  this.slug = finalSlug;
  next();
});

module.exports = mongoose.model('Business', businessSchema);
