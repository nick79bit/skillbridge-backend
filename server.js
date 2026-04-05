require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware


const allowedOrigins = [
  'https://skillbridgefrontend-taupe.vercel.app',
  'http://localhost:5173'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// This is critical — handles preflight requests
app.options('*', cors())

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

//checking
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

//json
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/hackathons', require('./routes/hackathons'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/townhall', require('./routes/townhall'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SkillBridge API running on port ${PORT}`));
