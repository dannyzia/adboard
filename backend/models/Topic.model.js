const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  keywords: [String],
  processed: { type: Boolean, default: false },
  processedAt: { type: Date },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  category: { 
    type: String, 
    enum: ['Tips', 'News', 'Guide', 'Update', 'Announcement'], 
    default: 'Tips' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Topic', topicSchema);
