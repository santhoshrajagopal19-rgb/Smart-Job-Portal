const User = require('../models/User');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('bookmarkedJobs');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, location, skills, company, companyLogo, resume } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (skills) updateData.skills = skills; // Array of strings
    if (company) updateData.company = company;
    if (companyLogo) updateData.companyLogo = companyLogo;
    if (resume) updateData.resume = resume;
    updateData.updatedAt = Date.now();

    // Update user in database
    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true });

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      message: 'Users fetched successfully',
      users,
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

// Block/Unblock user (Admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bookmark a job
const bookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already bookmarked
    if (user.bookmarkedJobs.includes(jobId)) {
      // Remove bookmark
      user.bookmarkedJobs = user.bookmarkedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.status(200).json({
        message: 'Job unbookmarked successfully',
        user,
      });
    }

    // Add bookmark
    user.bookmarkedJobs.push(jobId);
    await user.save();

    res.status(200).json({
      message: 'Job bookmarked successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  bookmarkJob,
};
