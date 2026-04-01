const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  domain: { type: String },
  hackathon: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxSize: { type: Number, default: 4 },
  isOpen: { type: Boolean, default: true },
  requiredSkills: [{ type: String }],
  joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
