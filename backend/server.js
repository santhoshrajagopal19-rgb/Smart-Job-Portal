const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job-portal';

const getMongoConnectionHelp = (errorMessage, uri) => {
  const help = [];
  const isAtlas = uri.includes('mongodb+srv://') || uri.includes('mongodb.net');

  if (errorMessage.includes('querySrv')) {
    help.push('Atlas SRV lookup failed. This usually points to DNS or network restrictions.');
    help.push('Try switching networks, disabling VPN or proxy temporarily, or using a non-SRV Atlas URI.');
  }

  if (errorMessage.includes('whitelist') || errorMessage.includes('Could not connect to any servers')) {
    help.push('If you are using MongoDB Atlas, add your current public IP in Atlas Network Access.');
    help.push('For development, you can temporarily allow 0.0.0.0/0 in Atlas and tighten it later.');
  }

  if (isAtlas) {
    help.push('Include a database name in the URI, for example: mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/job-portal?retryWrites=true&w=majority');
  } else {
    help.push('If you want local MongoDB instead, use MONGODB_URI=mongodb://127.0.0.1:27017/job-portal');
  }

  return help;
};

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    const help = getMongoConnectionHelp(error.message, mongoUri);
    if (help.length) {
      console.error('MongoDB troubleshooting:');
      help.forEach((line) => console.error(`- ${line}`));
    }

    process.exit(1);
  }
};

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Job Portal API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server only after the database is connected
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
