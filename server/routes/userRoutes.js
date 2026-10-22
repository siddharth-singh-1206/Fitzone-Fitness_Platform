const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// All user management routes require admin privileges
// GET    /api/users
router.get('/', protect, adminOnly, getAllUsers);

// GET    /api/users/:id
router.get('/:id', protect, adminOnly, getUserById);

// PUT    /api/users/:id
router.put('/:id', protect, adminOnly, updateUser);

// DELETE /api/users/:id
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
