const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find({ isActive: true })
      .select('-pathway -events')
      .lean();
    const withCount = communities.map(c => ({ ...c, memberCount: c.members.length }));
    res.json(withCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/communities/:id
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members', 'name department domains points badges');
    if (!community) return res.status(404).json({ message: 'Community not found.' });
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/communities/:id/join
router.post('/:id/join', protect, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found.' });

    const alreadyJoined = community.members.includes(req.user._id);
    if (alreadyJoined) return res.status(400).json({ message: 'Already a member of this community.' });

    community.members.push(req.user._id);
    await community.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { communitiesJoined: community._id },
      $inc: { points: 10 }
    });

    res.json({ message: `Joined ${community.name}!`, memberCount: community.members.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/communities/:id/leave
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.user._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(req.user._id, { $pull: { communitiesJoined: community._id } });
    res.json({ message: 'Left community.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
