const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token containing the user's id and role.
 * Token expires in 30 days.
 * @param {string} id - MongoDB user _id
 * @param {string} role - User role ('user' | 'admin')
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
