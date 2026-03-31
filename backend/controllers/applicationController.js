const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resume, coverLetter } = req.body;

    // Validate required fields
    if (!jobId || !resume) {
      return res.status(400).json({ message: 'Please provide job ID and resume' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      candidateId: req.userId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create new application
    const application = new Application({
      jobId,
      candidateId: req.userId,
      recruiterId: job.postedBy,
      resume,
      coverLetter: coverLetter || null,
    });

    await application.save();

    // Add candidate to job's applicants list
    if (!job.applicants.includes(req.userId)) {
      job.applicants.push(req.userId);
      job.applicationsCount += 1;
      await job.save();
    }

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications for a candidate
const getCandidateApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applications = await Application.find({ candidateId: req.userId })
      .populate('jobId', 'title location salary jobType company')
      .skip(skip)
      .limit(limit)
      .sort({ appliedAt: -1 });

    const total = await Application.countDocuments({ candidateId: req.userId });

    res.status(200).json({
      message: 'Applications fetched successfully',
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get applications for a job (Recruiter only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only view applications for your own jobs' });
    }

    const applications = await Application.find({ jobId })
      .populate('candidateId', 'name email phone skills location resume')
      .skip(skip)
      .limit(limit)
      .sort({ appliedAt: -1 });

    const total = await Application.countDocuments({ jobId });

    res.status(200).json({
      message: 'Job applications fetched successfully',
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update application status (Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'rejected', 'selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the recruiter for this job
    if (application.recruiterId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only update applications for your own jobs' });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the candidate
    if (application.candidateId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only withdraw your own applications' });
    }

    // Remove candidate from job's applicants list
    const job = await Job.findById(application.jobId);
    if (job && job.applicants.includes(req.userId)) {
      job.applicants = job.applicants.filter(id => id.toString() !== req.userId);
      job.applicationsCount -= 1;
      await job.save();
    }

    // Delete application
    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
};
