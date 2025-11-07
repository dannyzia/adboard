const mongoose = require('mongoose');

const slugSchema = new mongoose.Schema({
  base: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // seq stores the highest ordinal already allocated for this base
  seq: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('SlugCounter', slugSchema);
