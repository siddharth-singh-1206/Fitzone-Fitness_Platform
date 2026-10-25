const express = require('express');
const router = express.Router();
const { checkIn, getMyAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

// Private routes for authenticated users
router.post('/checkin', protect, checkIn);
router.get('/my', protect, getMyAttendance);

module.exports = router;
