const express = require('express');
const router = express.Router();
const {
  createMembership,
  getMyMembership,
  getAllMemberships,
  updateMembership,
  deleteMembership,
  unsubscribeMembership,
  unsubscribeByUserId,
} = require('../controllers/membershipController');
const { protect, adminOnly } = require('../middleware/auth');

// POST   /api/memberships      — authenticated user
router.post('/', protect, createMembership);

// GET    /api/memberships/my   — authenticated user (must be before /:id)
router.get('/my', protect, getMyMembership);

// GET    /api/memberships      — admin only
router.get('/', protect, adminOnly, getAllMemberships);

// PUT    /api/memberships/:id/unsubscribe — admin only
router.put('/:id/unsubscribe', protect, adminOnly, unsubscribeMembership);

// PUT    /api/memberships/user/:userId/unsubscribe — admin only
router.put('/user/:userId/unsubscribe', protect, adminOnly, unsubscribeByUserId);

// PUT    /api/memberships/:id  — admin only
router.put('/:id', protect, adminOnly, updateMembership);

// DELETE /api/memberships/:id  — admin only
router.delete('/:id', protect, adminOnly, deleteMembership);

module.exports = router;
