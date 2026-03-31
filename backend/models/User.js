const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema for both Candidates and Recruiters
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default in queries
  },
  phone: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate',
  },
  // Profile details
  bio: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  resume: {
    type: String, // URL or file path
    default: null,
  },
  skills: {
    type: [String],
    default: [],
  },
  // Company details (for recruiters)
  company: {
    type: String,
    default: null,
  },
  companyLogo: {
    type: String, // URL
    default: null,
  },
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  // Bookmarked jobs
  bookmarkedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
