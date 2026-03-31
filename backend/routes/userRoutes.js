const express = require('express');
const {
  getProfile,
  updateProfile,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  bookmarkJob,
} = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// User profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Bookmark job
router.post('/bookmark/:jobId', authenticateToken, bookmarkJob);

// Admin routes
router.get('/all', authenticateToken, authorizeRole('admin'), getAllUsers);
router.patch('/toggle-status/:userId', authenticateToken, authorizeRole('admin'), toggleUserStatus);
router.delete('/:userId', authenticateToken, authorizeRole('admin'), deleteUser);

module.exports = router;
