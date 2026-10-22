const { check } = require('express-validator');
const Enquiry = require('../models/Enquiry');

/**
 * @desc   Submit a new enquiry (contact form)
 * @route  POST /api/enquiries
 * @access Public
 */
const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const enquiry = await Enquiry.create({ name, email, phone, message });
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all enquiries
 * @route  GET /api/enquiries
 * @access Private (admin only)
 */
const getAllEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an enquiry (e.g. toggle status to 'resolved')
 * @route  PUT /api/enquiries/:id
 * @access Private (admin only)
 */
const updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete an enquiry
 * @route  DELETE /api/enquiries/:id
 * @access Private (admin only)
 */
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: 'Enquiry not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/** Validation rules for creating an enquiry */
const enquiryValidation = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  check('message', 'Message is required').notEmpty().trim(),
];

module.exports = {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
  enquiryValidation,
};
