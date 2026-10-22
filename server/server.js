const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables before importing anything that uses them
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const planRoutes = require('./routes/planRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const userRoutes = require('./routes/userRoutes');

// ── Connect to MongoDB ────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Security middleware ───────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ── Body parser ───────────────────────────────────────────────────────────
app.use(express.json());

// ── Rate limiter — applied ONLY to auth routes ────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FitZone API running' });
});

// ── Mount API routes ──────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);

// ── 404 handler for unknown API routes ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Central error handler (must be last) ─────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FitZone server running on port ${PORT}`);
});
