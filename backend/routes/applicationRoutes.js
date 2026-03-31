const express = require('express');
const {
  applyJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const applicationValidation = [
  body('resume').trim().notEmpty().withMessage('Resume is required'),
];

// Candidate routes
router.post('/:jobId/apply', authenticateToken, authorizeRole('candidate'), applicationValidation, applyJob);
router.get('/candidate/applications', authenticateToken, authorizeRole('candidate'), getCandidateApplications);
router.delete('/:applicationId/withdraw', authenticateToken, authorizeRole('candidate'), withdrawApplication);

// Recruiter routes
router.get('/job/:jobId/applications', authenticateToken, authorizeRole('recruiter'), getJobApplications);
router.patch('/:applicationId/status', authenticateToken, authorizeRole('recruiter'), updateApplicationStatus);

module.exports = router;
