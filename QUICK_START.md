# Quick Start Guide

## 🚀 Start Project in 5 Minutes

### Prerequisites Check
```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# MongoDB running? (for local)
mongod --version
```

### Backend - Terminal 1

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI

# Start server
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Server is running on port 5000
```

### Frontend - Terminal 2

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start React app
npm start
```

**Browser will open at:** `http://localhost:3000`

## 🧪 Test the Application

### Step 1: Register as Candidate
1. Click "Register" button
2. Select "Job Seeker" 
3. Fill in details
4. Add a resume URL (e.g., `https://example.com/resume.pdf`)
5. Click Register
6. You're logged in!

### Step 2: Browse & Apply for Jobs
1. Go to "Jobs" page
2. Search or filter jobs
3. Click any job to view details
4. Click "Apply Now"
5. Add cover letter (optional)
6. Submit application

### Step 3: Register as Recruiter
1. Logout from current account
2. Register again, select "Recruiter"
3. Go to "Recruiter Dashboard"
4. Click "Post New Job"
5. Fill in job details
6. Click "Post Job"

### Step 4: View Applications
1. On Recruiter Dashboard
2. Find your posted job
3. Click "Edit" to see applicants
4. Update applicant status

## 📝 API Testing with Postman

1. Import `API_Documentation.postman_collection.json` into Postman
2. For each request, replace:
   - `YOUR_TOKEN_HERE` with your JWT token (from login response)
   - `jobId` with actual job ID
   - `userId` with actual user ID

### Get JWT Token

**Login Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

Copy the `token` and use it in requests:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 Useful Commands

```bash
# Backend
cd backend
npm install          # Install packages
npm run dev         # Start with auto-reload
npm start          # Start server

# Frontend
cd frontend
npm install         # Install packages
npm start          # Start development server
npm run build      # Build for production

# Clear node_modules if you have issues
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Ensure mongod is running: `mongod` |
| Port 5000 in use | Change PORT in .env to 5001 |
| Port 3000 in use | React will prompt to use another port |
| CORS error | Restart both servers |
| Token expired | Logout and login again |
| Can't upload resume | Ensure uploads folder exists |

## 📱 Features to Test

### Candidate Features
- [x] Register as candidate
- [x] Edit profile & add skills
- [x] Add resume URL
- [x] Search jobs with filters
- [x] View job details
- [x] Apply for jobs
- [x] View application status
- [x] Bookmark jobs (UI exists)

### Recruiter Features
- [x] Register as recruiter
- [x] Post job listings
- [x] Edit job postings
- [x] Delete job postings
- [x] View applications for jobs
- [x] Update application status

### Admin Features
- [x] View all users
- [x] Block/Unblock users
- [x] Delete users
- [x] View user statistics

## 🎯 Key API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:jobId` - Get job details
- `POST /api/jobs` - Post new job (recruiter)
- `PUT /api/jobs/:jobId` - Update job (recruiter)
- `DELETE /api/jobs/:jobId` - Delete job (recruiter)

### Applications
- `POST /api/applications/:jobId/apply` - Apply for job
- `GET /api/applications/candidate/applications` - Get my applications
- `PATCH /api/applications/:applicationId/status` - Update status

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/all` - Get all users (admin)

## 📚 Learn More

- [Full Installation Guide](./INSTALLATION_GUIDE.md)
- [Architecture & Code Explanation](./ARCHITECTURE.md)
- [Complete README](./README.md)
- [API Documentation](./API_Documentation.postman_collection.json)

## ✅ What's Working

- ✅ Complete authentication system
- ✅ Job posting and management
- ✅ Job applications
- ✅ User profiles and dashboards
- ✅ Search and filters
- ✅ Pagination
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

## 🚀 Next Steps

1. Register test accounts
2. Post some test jobs
3. Apply for jobs
4. Review applications
5. Explore all features
6. Read documentation
7. Customize for your needs
8. Deploy to production

## 📧 Need Help?

- Check browser console for errors
- Check terminal for backend errors
- Verify .env configuration
- Ensure all services running
- Read error messages carefully

---

**Happy coding! 🎉**
