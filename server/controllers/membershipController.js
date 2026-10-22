const Membership = require('../models/Membership');
const Plan = require('../models/Plan');

/**
 * @desc   Create a new membership for the authenticated user
 * @route  POST /api/memberships
 * @access Private (protect)
 */
const createMembership = async (req, res, next) => {
  try {
    const { planId } = req.body;

    // Validate the plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: 'Plan not found' });
    }

    // Block if user already has an active membership
    const existingMembership = await Membership.findOne({
      user: req.user._id,
      status: 'active',
    });
    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message:
          'You already have an active membership. Cancel it before subscribing to a new plan.',
      });
    }

    // Compute endDate: startDate + plan.durationInDays
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const membership = await Membership.create({
      user: req.user._id,
      plan: plan._id,
      startDate,
      endDate,
    });

    // Return with plan populated
    const populated = await membership.populate('plan');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get the latest membership of the authenticated user
 * @route  GET /api/memberships/my
 * @access Private (protect)
 */
const getMyMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('plan');

    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: 'No membership found for this user' });
    }
    res.status(200).json({ success: true, data: membership });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all memberships (admin view)
 * @route  GET /api/memberships
 * @access Private (admin only)
 */
const getAllMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.find()
      .populate('user', 'name email role')
      .populate('plan');
    res.status(200).json({ success: true, data: memberships });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update a membership's status
 * @route  PUT /api/memberships/:id
 * @access Private (admin only)
 */
const updateMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email role')
      .populate('plan');

    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: 'Membership not found' });
    }
    res.status(200).json({ success: true, data: membership });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a membership
 * @route  DELETE /api/memberships/:id
 * @access Private (admin only)
 */
const deleteMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) {
      return res
        .status(404)
        .json({ success: false, message: 'Membership not found' });
    }
    res
      .status(200)
      .json({ success: true, message: 'Membership deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMembership,
  getMyMembership,
  getAllMemberships,
  updateMembership,
  deleteMembership,
};
