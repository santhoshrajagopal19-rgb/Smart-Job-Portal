const express = require('express');
const {
  postJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['Full-time', 'Part-time', 'Contract', 'Internship']).withMessage('Invalid job type'),
  body('salary').notEmpty().withMessage('Salary is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
];

// Public routes
router.get('/', getAllJobs);
router.get('/:jobId', getJobById);

// Recruiter routes
router.post('/', authenticateToken, authorizeRole('recruiter'), jobValidation, postJob);
router.put('/:jobId', authenticateToken, authorizeRole('recruiter'), updateJob);
router.delete('/:jobId', authenticateToken, authorizeRole('recruiter'), deleteJob);
router.get('/recruiter/jobs', authenticateToken, authorizeRole('recruiter'), getRecruiterJobs);

module.exports = router;
