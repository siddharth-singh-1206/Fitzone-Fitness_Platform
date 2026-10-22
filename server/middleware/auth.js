const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Verifies a Bearer JWT from the Authorization header.
 * Attaches the authenticated user (without password) to req.user.
 * Returns 401 if the token is missing or invalid.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch fresh user from DB; password excluded via select: false on schema
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found, token invalid' });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, token failed' });
  }
};

/**
 * adminOnly — Must be used after the protect middleware.
 * Blocks access if the authenticated user is not an admin.
 * Returns 403 Forbidden for non-admin users.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: 'Access denied: Admins only' });
};

module.exports = { protect, adminOnly };
