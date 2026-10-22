const { check } = require('express-validator');
const Plan = require('../models/Plan');

/**
 * @desc   Get all plans
 * @route  GET /api/plans
 * @access Public
 */
const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get a single plan by id
 * @route  GET /api/plans/:id
 * @access Public
 */
const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: 'Plan not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new plan
 * @route  POST /api/plans
 * @access Private (admin only)
 */
const createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a plan
 * @route  PUT /api/plans/:id
 * @access Private (admin only)
 */
const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: 'Plan not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a plan
 * @route  DELETE /api/plans/:id
 * @access Private (admin only)
 */
const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: 'Plan not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/** Validation rules for creating a plan */
const planValidation = [
  check('name', 'Plan name is required').notEmpty().trim(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('durationInDays', 'Duration in days must be a positive integer').isInt(
    { min: 1 }
  ),
];

module.exports = {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  planValidation,
};
