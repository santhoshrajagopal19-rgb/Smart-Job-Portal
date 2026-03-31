# Installation Guide - Step by Step

## Prerequisites

Before you start, make sure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB** (Local or Cloud)
   - Local: Download from https://www.mongodb.com/try/download/community
   - Cloud: Create account on MongoDB Atlas https://www.mongodb.com/cloud/atlas

3. **Git** (Optional but recommended)
   - Download from: https://git-scm.com/

4. **Code Editor** (VS Code, WebStorm, etc.)

## Step 1: Database Setup

### Option A: MongoDB Local Installation

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **Windows**: MongoDB should start as a service automatically
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Verify MongoDB is running:
   ```bash
   mongo --version
   mongod
   ```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project and cluster
4. Get your connection string:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the URI: `mongodb+srv://username:password@cluster.mongodb.net/job-portal?retryWrites=true&w=majority`

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- multer
- express-validator

### 2.3 Create Environment Configuration

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/job-portal

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 2.4 Create Uploads Directory

The backend needs an uploads folder for resume files:

```bash
mkdir uploads
```

### 2.5 Start Backend Server

```bash
# Development mode with auto-reload (requires nodemon)
npm run dev

# Or production mode
npm start
```

Expected output:
```
✓ MongoDB connected successfully
✓ Server is running on port 5000
✓ Environment: development
```

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory

```bash
cd ../frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install all required packages:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- react-icons

### 3.3 Create Environment Configuration

Create a `.env` file in the frontend folder:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Development Server

```bash
npm start
```

The application will automatically open at: `http://localhost:3000`

## Step 4: Accessing the Application

### Home Page
- URL: http://localhost:3000
- Shows job listings and platform information

### Register Page
- URL: http://localhost:3000/register
- Create new account as Candidate or Recruiter

### Login Page
- URL: http://localhost:3000/login
- Sign in with your credentials

### Job Listings
- URL: http://localhost:3000/jobs
- Browse all available jobs with filters

### Candidate Dashboard
- URL: http://localhost:3000/dashboard (after login as candidate)
- Manage profile and view applications

### Recruiter Dashboard
- URL: http://localhost:3000/recruiter-dashboard (after login as recruiter)
- Post and manage jobs

### Admin Dashboard
- URL: http://localhost:3000/admin-dashboard (after login as admin)
- Manage users and system

## Step 5: Test with Sample Data

### Create Test Accounts

**Candidate Account:**
```
Email: candidate@example.com
Password: password123
Name: John Candidate
```

**Recruiter Account:**
```
Email: recruiter@example.com
Password: password123
Name: Jane Recruiter
```

**Admin Account:**
```
Email: admin@example.com
Password: password123
Name: Admin User
```

### Test Workflow

1. **Register as Candidate**
   - Go to Register page
   - Select "Job Seeker" as role
   - Create account and add resume URL
   - Browse and apply for jobs

2. **Register as Recruiter**
   - Go to Register page
   - Select "Recruiter" as role
   - Create account
   - Post a new job
   - View applications

3. **Test Admin Features**
   - Login as admin
   - View all users
   - Block/Unblock users
   - Delete users

## Troubleshooting

### Issue: "Cannot find module" error

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Issue: MongoDB connection failed

**Solution:**
1. Check if MongoDB is running:
   - For local: `mongod` should be running in a terminal
   - For Atlas: Check connection string in .env
2. Verify MONGODB_URI in .env is correct
3. Check firewall settings

### Issue: Port 5000 or 3000 already in use

**Solution:**
```bash
# Change PORT in backend .env to another port (e.g., 5001)
PORT=5001

# Change API URL in frontend .env
REACT_APP_API_URL=http://localhost:5001/api
```

### Issue: CORS error

**Solution:**
1. Ensure backend is running
2. Check that REACT_APP_API_URL matches backend URL
3. Restart both frontend and backend

### Issue: JWT token invalid or expired

**Solution:**
1. Clear localStorage: Open browser DevTools → Application → localStorage → Clear all
2. Login again to get new token

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/` folder.

### Build Backend

For production, no build is needed. Just ensure Node.js is installed and run:

```bash
npm start
```

## Running Both Servers Together

### Terminal 1: Start Backend

```bash
cd backend
npm start
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

Both servers will be running simultaneously.

## Common Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm start           # Start production server
npm run dev         # Start development server with nodemon

# Frontend
cd frontend
npm install         # Install dependencies
npm start           # Start development server
npm run build       # Build for production
npm run test        # Run tests
```

## Next Steps

1. Read the main [README.md](./README.md) for detailed documentation
2. Check [API_Documentation.postman_collection.json](./API_Documentation.postman_collection.json) for API endpoints
3. Explore the codebase and customize as needed
4. Deploy to production when ready

## Need Help?

- Check error messages in browser console (DevTools)
- Check backend logs in terminal
- Verify .env configuration
- Ensure all services (MongoDB, Node servers) are running
