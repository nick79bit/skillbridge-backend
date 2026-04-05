const express = require('express');
const router = express.Router();
const TownHall = require('../models/TownHall');
const { protect } = require('../middleware/auth');

// Check if user can create (admin or mentor)
const canCreate = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'mentor') return next();
  return res.status(403).json({ message: 'Only admins and mentors can post Town Hall content.' });
};

// GET /api/townhall?type=announcement&page=1
router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type && type !== 'all') filter.type = type;

    const posts = await TownHall.find(filter)
      .populate('author', 'name role department')
      .populate('comments.user', 'name role')
      .sort({ isPinned: -1, createdAt: -1 });

    const withCounts = posts.map(p => ({
      ...p.toObject(),
      rsvpCount: p.rsvps.length,
      likeCount: p.likes.length,
      commentCount: p.comments.length,
      isRsvped: p.rsvps.includes(req.user._id),
      isLiked: p.likes.includes(req.user._id),
    }));

    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/townhall/stats — for dashboard widget
router.get('/stats', protect, async (req, res) => {
  try {
    const latest = await TownHall.find({ isActive: true })
      .populate('author', 'name role')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(3)
      .lean();

    const totalEvents = await TownHall.countDocuments({ type: 'event', isActive: true });
    const totalPosts = await TownHall.countDocuments({ isActive: true });

    res.json({ latest, totalEvents, totalPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/townhall — create post
router.post('/', protect, canCreate, async (req, res) => {
  try {
    const { title, description, type, scheduledAt, meetLink, location, tags, isPinned } = req.body;
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Title, description and type are required.' });
    }

    const post = await TownHall.create({
      title, description, type,
      author: req.user._id,
      scheduledAt: scheduledAt || undefined,
      meetLink: meetLink || '',
      location: location || 'Online',
      tags: tags || [],
      isPinned: isPinned && req.user.role === 'admin' ? true : false,
    });

    const populated = await post.populate('author', 'name role department');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/townhall/:id/rsvp — toggle RSVP
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const post = await TownHall.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.type !== 'event') return res.status(400).json({ message: 'RSVP is only for events.' });

    const idx = post.rsvps.indexOf(req.user._id);
    if (idx > -1) {
      post.rsvps.splice(idx, 1);
    } else {
      post.rsvps.push(req.user._id);
    }
    await post.save();
    res.json({ rsvpCount: post.rsvps.length, isRsvped: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/townhall/:id/like — toggle like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await TownHall.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const idx = post.likes.indexOf(req.user._id);
    if (idx > -1) {
      post.likes.splice(idx, 1);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likeCount: post.likes.length, isLiked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/townhall/:id/comment — add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text required.' });

    const post = await TownHall.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    const updated = await TownHall.findById(req.params.id)
      .populate('comments.user', 'name role');
    res.json(updated.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/townhall/:id — admin or author only
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await TownHall.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const isAuthor = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAuthor && !isAdmin) return res.status(403).json({ message: 'Not authorized.' });

    post.isActive = false;
    await post.save();
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
