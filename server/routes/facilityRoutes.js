const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  facilityValidation,
} = require('../controllers/facilityController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// GET    /api/facilities       — public
router.get('/', getFacilities);

// GET    /api/facilities/:id   — public
router.get('/:id', getFacility);

// POST   /api/facilities       — admin only
router.post('/', protect, adminOnly, facilityValidation, validate, createFacility);

// PUT    /api/facilities/:id   — admin only
router.put('/:id', protect, adminOnly, updateFacility);

// DELETE /api/facilities/:id   — admin only
router.delete('/:id', protect, adminOnly, deleteFacility);

module.exports = router;
