const { check } = require('express-validator');
const Trainer = require('../models/Trainer');

/**
 * @desc   Get all active trainers
 * @route  GET /api/trainers
 * @access Public
 */
const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({ isActive: true });
    res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get a single trainer by id
 * @route  GET /api/trainers/:id
 * @access Public
 */
const getTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: 'Trainer not found' });
    }
    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new trainer
 * @route  POST /api/trainers
 * @access Private (admin only)
 */
const createTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a trainer
 * @route  PUT /api/trainers/:id
 * @access Private (admin only)
 */
const updateTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: 'Trainer not found' });
    }
    res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a trainer
 * @route  DELETE /api/trainers/:id
 * @access Private (admin only)
 */
const deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: 'Trainer not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/** Validation rules for creating a trainer */
const trainerValidation = [
  check('name', 'Trainer name is required').notEmpty().trim(),
  check('specialization', 'Specialization is required').notEmpty().trim(),
  check('experience', 'Experience (years) must be a positive number')
    .isNumeric()
    .isFloat({ min: 0 }),
  check('bio', 'Bio is required').notEmpty().trim(),
];

module.exports = {
  getTrainers,
  getTrainer,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  trainerValidation,
};
