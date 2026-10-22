const express = require('express');
const router = express.Router();
const {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  planValidation,
} = require('../controllers/planController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// GET    /api/plans       — public
router.get('/', getPlans);

// GET    /api/plans/:id   — public
router.get('/:id', getPlan);

// POST   /api/plans       — admin only
router.post('/', protect, adminOnly, planValidation, validate, createPlan);

// PUT    /api/plans/:id   — admin only
router.put('/:id', protect, adminOnly, updatePlan);

// DELETE /api/plans/:id   — admin only
router.delete('/:id', protect, adminOnly, deletePlan);

module.exports = router;
