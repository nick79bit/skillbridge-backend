const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ isVerified: true })
      .select('name department domains points badges communitiesJoined projectsDone tasksCompleted')
      .sort({ points: -1 })
      .limit(50)
      .lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -resetPasswordToken')
      .populate('communitiesJoined', 'name domain icon color');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/me
router.patch('/me', protect, async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'skills', 'domains', 'department'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
      .select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, verifiedUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true })
    ]);
    res.json({ totalUsers, verifiedUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
