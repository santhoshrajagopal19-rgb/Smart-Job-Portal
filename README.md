# Smart Job Portal System - MERN Stack

A full-stack web application for job seekers to find jobs and recruiters to post job openings. Built with React, Node.js, Express, and MongoDB.

## 🚀 Live Demo

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Tech Stack](#tech-stack)

## 📁 Project Structure

```
job-portal-MERN/
│
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (Candidate, Recruiter, Admin)
│   │   ├── Job.js            # Job posting schema
│   │   └── Application.js     # Job application schema
│   │
│   ├── controllers/
│   │   ├── authController.js        # Login & Register logic
│   │   ├── userController.js        # User profile management
│   │   ├── jobController.js         # Job CRUD operations
│   │   └── applicationController.js # Application management
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── userRoutes.js           # User endpoints
│   │   ├── jobRoutes.js            # Job endpoints
│   │   └── applicationRoutes.js     # Application endpoints
│   │
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── upload.js        # File upload handling
│   │
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── AuthPage.js
│   │   │   ├── JobListingsPage.js
│   │   │   ├── JobDetailsPage.js
│   │   │   ├── CandidateDashboard.js
│   │   │   ├── RecruiterDashboard.js
│   │   │   └── AdminDashboard.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── JobCard.js
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js       # Global auth state management
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Custom auth hook
│   │   │   └── useAsync.js          # Custom async hook
│   │   │
│   │   ├── utils/
│   │   │   └── api.js               # API client configuration
│   │   │
│   │   ├── App.js            # Main app component with routing
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   │
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── postcss.config.js      # PostCSS config
│   └── .env.example          # Environment variables template
│
└── README.md                 # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in .env:**
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```

5. **Start MongoDB:**
   ```bash
   # On Windows with MongoDB installed
   mongod
   
   # Or use MongoDB Atlas (cloud database)
   ```

6. **Start the server:**
   ```bash
   npm start
   # Or with nodemon for development:
   npm run dev
   ```

   Server will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in .env:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

   Application will open at: `http://localhost:3000`

## 🔌 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate" // or "recruiter"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGcio...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGcio...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate"
  }
}
```

### Job Endpoints

#### Get All Jobs (with filters)
```
GET /api/jobs?page=1&limit=10&search=developer&location=NYC&jobType=Full-time

Response:
{
  "message": "Jobs fetched successfully",
  "jobs": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Get Job Details
```
GET /api/jobs/:jobId

Response:
{
  "message": "Job fetched successfully",
  "job": {
    "_id": "...",
    "title": "Senior Developer",
    "location": "New York",
    "salary": { "min": 80, "max": 120 },
    ...
  }
}
```

#### Post New Job (Recruiter Only)
```
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Senior Developer",
  "description": "Looking for a senior developer...",
  "location": "New York",
  "jobType": "Full-time",
  "salary": { "min": 80, "max": 120, "currency": "USD" },
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": "5+ years"
}
```

### Application Endpoints

#### Apply for Job
```
POST /api/applications/:jobId/apply
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "resume": "https://example.com/resume.pdf",
  "coverLetter": "I'm interested in this position because..."
}
```

#### Get Candidate Applications
```
GET /api/applications/candidate/applications
Authorization: Bearer {token}

Response:
{
  "message": "Applications fetched successfully",
  "applications": [...]
}
```

#### Get Job Applications (Recruiter)
```
GET /api/applications/job/:jobId/applications
Authorization: Bearer {token}
```

#### Update Application Status
```
PATCH /api/applications/:applicationId/status
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "status": "shortlisted" // or "reviewing", "rejected", "selected"
}
```

### User Endpoints

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update Profile
```
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  "phone": "123-456-7890",
  "location": "New York",
  "skills": ["JavaScript", "React"],
  "resume": "https://example.com/resume.pdf"
}
```

#### Bookmark Job
```
POST /api/users/bookmark/:jobId
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get All Users
```
GET /api/users/all
Authorization: Bearer {token}
```

#### Toggle User Status
```
PATCH /api/users/toggle-status/:userId
Authorization: Bearer {token}
```

#### Delete User
```
DELETE /api/users/:userId
Authorization: Bearer {token}
```

## ✨ Features

### For Candidates
- User registration and authentication
- Create and update profile with skills and resume
- Search and filter jobs (by title, location, job type)
- View job details
- Apply for jobs
- Track application status
- Bookmark favorite jobs
- Responsive dashboard

### For Recruiters
- User registration (as recruiter)
- Create, edit, and delete job postings
- Manage job applications
- Update applicant status (applied → reviewing → shortlisted → selected)
- View recruiter analytics
- Search through candidates

### For Admins
- View all users
- Block/Unblock users
- Delete users
- Dashboard with user analytics
- System statistics

### General Features
- JWT-based authentication
- Role-based access control
- Form validation
- Error handling
- Loading states
- Pagination
- Search and filter functionality
- Responsive design (Mobile, Tablet, Desktop)
- Clean and intuitive UI

## 🏗️ Tech Stack

### Frontend
- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **Context API**: State management for authentication
- **Custom Hooks**: useAuth, useAsync

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-Origin Resource Sharing
- **express-validator**: Input validation

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with role-based access
- Input validation on both frontend and backend
- CORS configuration
- Environment variables for sensitive data

## 📝 Sample Data

### Sample Candidate Account
```
Email: candidate@example.com
Password: password123
Role: Candidate
```

### Sample Recruiter Account
```
Email: recruiter@example.com
Password: password123
Role: Recruiter
```

### Sample Admin Account
```
Email: admin@example.com
Password: password123
Role: Admin
```

## 🔄 Data Flow

1. **Authentication**:
   - User registers/logs in
   - Backend verifies credentials and generates JWT token
   - Frontend stores token in localStorage
   - Token is sent with every API request via Authorization header

2. **Job Search**:
   - Candidate searches jobs with filters
   - Frontend sends request to backend with query parameters
   - Backend queries MongoDB with filters
   - Results are returned with pagination

3. **Job Application**:
   - Candidate applies for job with resume and cover letter
   - Backend creates Application document
   - Candidate ID is added to job's applicants array
   - Application status changes from "applied" to "reviewing"

4. **Profile Management**:
   - User updates profile information
   - Frontend sends PUT request with updated data
   - Backend validates and updates MongoDB document
   - Frontend receives updated user object

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Tablet (768px to 1024px)
- Mobile (320px to 767px)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in .env file
- Verify MongoDB is accessible on localhost:27017

### Port Already in Use
- Change PORT in .env file
- Or kill the process using the port

### CORS Error
- Ensure backend is running on correct port
- Check CORS middleware configuration in server.js
- Verify API_URL matches backend URL in frontend .env

### Token Expiration
- Tokens expire after 7 days (configurable in JWT_EXPIRE)
- User will be redirected to login page
- Save important data before expiration

## 🚀 Deployment

### Deploy Backend (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create job-portal-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploy Frontend (Netlify/Vercel)
```bash
# Build production bundle
npm run build

# Deploy to Netlify
npm run build && netlify deploy --prod --dir=build
```

## 📄 License

This project is open source and available under the MIT License.

## ✅ Checklist - What's Included

- ✅ Complete backend API with all CRUD operations
- ✅ Frontend with all required pages and features
- ✅ Authentication and authorization
- ✅ Job search with filters and pagination
- ✅ Application management
- ✅ User profile management
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Role-based access control
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Form validation
- ✅ API documentation

## 🎯 Future Enhancements

- Email notifications using Nodemailer
- Resume file upload with Multer
- Advanced analytics dashboard
- Interview scheduling system
- Video interview integration
- Recommendation system
- Social login (Google, LinkedIn)
- Real-time notifications using WebSockets
- Dark mode support
- Multi-language support

## 📧 Support

For questions or issues, please create an issue in the repository.

---

**Happy coding! 🚀**
#   S m a r t - J o b - P o r t a l  
 