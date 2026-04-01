const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/teams?domain=web&hackathon=id
router.get('/', async (req, res) => {
  try {
    const { domain, hackathon, open } = req.query;
    const filter = {};
    if (domain) filter.domain = { $regex: domain, $options: 'i' };
    if (hackathon) filter.hackathon = hackathon;
    if (open === 'true') filter.isOpen = true;

    const teams = await Team.find(filter)
      .populate('leader', 'name department domains points badges')
      .populate('members', 'name department domains points badges')
      .lean();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teams/suggested - Suggest teams based on user skills
router.get('/suggested', protect, async (req, res) => {
  try {
    const user = req.user;
    const teams = await Team.find({
      isOpen: true,
      domain: { $in: user.domains },
      members: { $ne: user._id },
      leader: { $ne: user._id }
    })
    .populate('leader', 'name department domains points badges')
    .populate('members', 'name department domains')
    .limit(5)
    .lean();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/teams/find-teammates - Suggest students with similar skills
router.get('/find-teammates', protect, async (req, res) => {
  try {
    const user = req.user;
    const { domain } = req.query;
    const searchDomain = domain || (user.domains && user.domains[0]);

    const users = await User.find({
      _id: { $ne: user._id },
      isVerified: true,
      ...(searchDomain ? { domains: { $in: [searchDomain] } } : {})
    })
    .select('name department domains skills points badges bio')
    .sort({ points: -1 })
    .limit(12);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/teams - Create team
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, domain, hackathon, maxSize, requiredSkills } = req.body;
    if (!name) return res.status(400).json({ message: 'Team name is required.' });

    const team = await Team.create({
      name, description, domain, hackathon: hackathon || undefined,
      leader: req.user._id,
      members: [req.user._id],
      maxSize: maxSize || 4,
      requiredSkills: requiredSkills || []
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { teamsJoined: team._id },
      $inc: { points: 15 }
    });

    const populated = await team.populate('leader', 'name department domains');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/teams/:id/join
router.post('/:id/join', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found.' });
    if (!team.isOpen) return res.status(400).json({ message: 'Team is not accepting new members.' });
    if (team.members.length >= team.maxSize) return res.status(400).json({ message: 'Team is full.' });
    if (team.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member.' });

    team.members.push(req.user._id);
    if (team.members.length >= team.maxSize) team.isOpen = false;
    await team.save();

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { teamsJoined: team._id } });
    res.json({ message: `Joined team ${team.name}!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
