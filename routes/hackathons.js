const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/hackathons?type=hackathon&scope=online&domain=AI&difficulty=beginner&mode=solo
router.get('/', async (req, res) => {
  try {
    const { type, scope, domain, difficulty, mode, search } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (scope) filter.scope = scope;
    if (domain) filter.domain = { $regex: domain, $options: 'i' };
    if (difficulty) filter.difficulty = difficulty;
    if (mode && mode !== 'both') filter.mode = { $in: [mode, 'both'] };
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { organizer: { $regex: search, $options: 'i' } }
    ];

    const hackathons = await Hackathon.find(filter)
      .sort({ isFeatured: -1, deadline: 1 })
      .lean();

    const withCount = hackathons.map(h => ({ ...h, participantCount: h.participants.length }));
    res.json(withCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/hackathons/recommended - Smart recommendations
router.get('/recommended', protect, async (req, res) => {
  try {
    const user = req.user;
    const domains = user.domains || [];
    const recommended = await Hackathon.find({
      isActive: true,
      $or: [
        { domain: { $in: domains } },
        { isFeatured: true }
      ]
    })
    .sort({ isFeatured: -1, deadline: 1 })
    .limit(6)
    .lean();
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/hackathons/:id
router.get('/:id', async (req, res) => {
  try {
    const h = await Hackathon.findById(req.params.id)
      .populate('participants', 'name department domains points')
      .populate('teams');
    if (!h) return res.status(404).json({ message: 'Not found.' });
    res.json(h);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/hackathons/:id/register
router.post('/:id/register', protect, async (req, res) => {
  try {
    const h = await Hackathon.findById(req.params.id);
    if (!h) return res.status(404).json({ message: 'Hackathon not found.' });

    if (h.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered.' });
    }
    h.participants.push(req.user._id);
    await h.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { hackathonsParticipated: h._id },
      $inc: { points: 20 }
    });

    res.json({ message: `Registered for ${h.title}!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
