const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
} = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', registerValidation, validate, register);

// POST /api/auth/login
router.post('/login', loginValidation, validate, login);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
