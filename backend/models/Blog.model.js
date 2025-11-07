const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { url: String, publicId: String },
  category: { type: String, enum: ['Tips', 'News', 'Guide', 'Update', 'Announcement'], default: 'Tips' },
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  publishDate: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  slug: { type: String, unique: true }
}, {
  timestamps: true
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
