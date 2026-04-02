require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: "https://skillbridgefrontend-taupe.vercel.app",
  credentials: true
}));
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/hackathons', require('./routes/hackathons'));
app.use('/api/teams', require('./routes/teams'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SkillBridge API running on port ${PORT}`));
