const { check } = require('express-validator');
const Facility = require('../models/Facility');

/**
 * @desc   Get all active facilities
 * @route  GET /api/facilities
 * @access Public
 */
const getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find({ isActive: true });
    res.status(200).json({ success: true, data: facilities });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get a single facility by id
 * @route  GET /api/facilities/:id
 * @access Public
 */
const getFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res
        .status(404)
        .json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new facility
 * @route  POST /api/facilities
 * @access Private (admin only)
 */
const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a facility
 * @route  PUT /api/facilities/:id
 * @access Private (admin only)
 */
const updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!facility) {
      return res
        .status(404)
        .json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a facility
 * @route  DELETE /api/facilities/:id
 * @access Private (admin only)
 */
const deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res
        .status(404)
        .json({ success: false, message: 'Facility not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/** Validation rules for creating/updating a facility */
const facilityValidation = [
  check('name', 'Facility name is required').notEmpty().trim(),
  check('description', 'Description is required').notEmpty().trim(),
];

module.exports = {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  facilityValidation,
};
