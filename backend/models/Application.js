const mongoose = require('mongoose');

// Application Schema for job applications
const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume: {
    type: String, // URL or file path
    required: true,
  },
  coverLetter: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['applied', 'reviewing', 'shortlisted', 'rejected', 'selected'],
    default: 'applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
