const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['hackathon', 'project', 'challenge'], default: 'hackathon' },
  mode: { type: String, enum: ['solo', 'team', 'both'], default: 'both' },
  scope: { type: String, enum: ['local', 'online', 'college', 'company'], default: 'online' },
  domain: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  prize: { type: String, default: 'Certificate' },
  deadline: { type: Date },
  teamSize: { min: { type: Number, default: 1 }, max: { type: Number, default: 4 } },
  organizer: { type: String },
  tags: [{ type: String }],
  registrationLink: { type: String, default: '#' },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);
