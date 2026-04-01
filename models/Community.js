const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: '💻' },
  color: { type: String, default: '#4f46e5' },
  tags: [{ type: String }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pathway: [{
    week: Number,
    title: String,
    description: String,
    resources: [String]
  }],
  events: [{
    title: String,
    date: Date,
    type: { type: String, enum: ['workshop', 'session', 'challenge', 'meetup'] }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
