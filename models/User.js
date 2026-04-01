const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  department: { type: String, default: '' },
  domains: [{ type: String }],
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpiry: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  communitiesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  teamsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  hackathonsParticipated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }],
  projectsDone: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
