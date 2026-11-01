const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });
    }

    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Login an existing user
 * @route  POST /api/auth/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (excluded by default via schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get currently authenticated user
 * @route  GET /api/auth/me
 * @access Private (protect)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update user profile and fitness goals
 * @route  PUT /api/auth/profile
 * @access Private (protect)
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, fitnessGoal, currentWeight, targetWeight, height } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name.trim();
    if (phone !== undefined) fieldsToUpdate.phone = phone.trim();
    if (fitnessGoal !== undefined) fieldsToUpdate.fitnessGoal = fitnessGoal;
    if (currentWeight !== undefined) fieldsToUpdate.currentWeight = Number(currentWeight);
    if (targetWeight !== undefined) fieldsToUpdate.targetWeight = Number(targetWeight);
    if (height !== undefined) fieldsToUpdate.height = Number(height);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

/** Validation rules for the register endpoint */
const registerValidation = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
];

/** Validation rules for the login endpoint */
const loginValidation = [
  check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
];

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  registerValidation,
  loginValidation,
};
