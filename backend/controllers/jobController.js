const Job = require('../models/Job');
const User = require('../models/User');

// Post a new job (Recruiter only)
const postJob = async (req, res) => {
  try {
    const { title, description, location, jobType, category, salary, skills, experience, qualifications } = req.body;

    // Validate required fields
    if (!title || !description || !location || !jobType || !salary || !skills || !experience) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new job
    const job = new Job({
      title,
      description,
      location,
      jobType,
      category: category || 'General',
      salary,
      skills,
      experience,
      qualifications: qualifications || [],
      postedBy: req.userId,
    });

    await job.save();

    res.status(201).json({
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all jobs with search and filter
const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isOpen: true };

    // Search by title
    if (req.query.search) {
      filter.title = new RegExp(req.query.search, 'i');
    }

    // Filter by location
    if (req.query.location) {
      filter.location = new RegExp(req.query.location, 'i');
    }

    // Filter by job type
    if (req.query.jobType) {
      filter.jobType = req.query.jobType;
    }

    // Filter by skills (at least one skill match)
    if (req.query.skills) {
      const skillsArray = Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills];
      filter.skills = { $in: skillsArray };
    }

    // Filter by salary range
    if (req.query.minSalary || req.query.maxSalary) {
      filter.salary = {};
      if (req.query.minSalary) {
        filter.salary.$gte = parseInt(req.query.minSalary);
      }
      if (req.query.maxSalary) {
        filter.salary.$lte = parseInt(req.query.maxSalary);
      }
    }

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    // Fetch jobs with population
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name company email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Jobs fetched successfully',
      jobs,
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

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('postedBy', 'name company email phone')
      .populate('applicants', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job fetched successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update job (Recruiter only - own jobs)
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own jobs' });
    }

    // Update allowed fields
    const { title, description, location, jobType, salary, skills, experience, qualifications, isOpen } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (salary) job.salary = salary;
    if (skills) job.skills = skills;
    if (experience) job.experience = experience;
    if (qualifications) job.qualifications = qualifications;
    if (isOpen !== undefined) job.isOpen = isOpen;
    job.updatedAt = Date.now();

    await job.save();

    res.status(200).json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete job (Recruiter only - own jobs)
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get jobs posted by a recruiter
const getRecruiterJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ postedBy: req.userId })
      .populate('applicants', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments({ postedBy: req.userId });

    res.status(200).json({
      message: 'Recruiter jobs fetched successfully',
      jobs,
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

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
};
