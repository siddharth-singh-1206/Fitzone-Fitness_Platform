const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
  enquiryValidation,
} = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// POST   /api/enquiries       — public
router.post('/', enquiryValidation, validate, createEnquiry);

// GET    /api/enquiries       — admin only
router.get('/', protect, adminOnly, getAllEnquiries);

// PUT    /api/enquiries/:id   — admin only
router.put('/:id', protect, adminOnly, updateEnquiry);

// DELETE /api/enquiries/:id   — admin only
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
