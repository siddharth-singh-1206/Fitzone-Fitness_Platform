const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  trainerValidation,
} = require('../controllers/trainerController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

// GET  /api/trainers       — public
router.get('/', getTrainers);

// GET  /api/trainers/:id   — public
router.get('/:id', getTrainer);

// POST /api/trainers        — admin only
router.post('/', protect, adminOnly, trainerValidation, validate, createTrainer);

// PUT  /api/trainers/:id   — admin only
router.put('/:id', protect, adminOnly, updateTrainer);

// DELETE /api/trainers/:id — admin only
router.delete('/:id', protect, adminOnly, deleteTrainer);

module.exports = router;
