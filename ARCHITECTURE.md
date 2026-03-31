# Code Architecture & Explanation

## Backend Architecture

### MVC Pattern Implementation

The backend follows the Model-View-Controller (MVC) pattern:

```
├── Models (Database Schemas)
│   ├── User.js - User document structure
│   ├── Job.js - Job posting structure
│   └── Application.js - Application structure
│
├── Controllers (Business Logic)
│   ├── authController.js - Login/Register logic
│   ├── userController.js - User operations
│   ├── jobController.js - Job operations
│   └── applicationController.js - Application operations
│
├── Routes (API Endpoints)
│   ├── authRoutes.js - Auth endpoints
│   ├── userRoutes.js - User endpoints
│   ├── jobRoutes.js - Job endpoints
│   └── applicationRoutes.js - Application endpoints
│
└── Middleware (Request Processing)
    ├── auth.js - JWT authentication
    └── upload.js - File upload handling
```

### Key Backend Patterns

#### 1. Authentication Flow

**User Registration:**
```javascript
// authController.js - register()
1. Validate input (name, email, password)
2. Check if email already exists
3. Hash password using bcryptjs
4. Create new User document
5. Generate JWT token
6. Return token and user data
```

**User Login:**
```javascript
// authController.js - login()
1. Validate email and password
2. Find user by email
3. Compare hashed password
4. Check if user is active
5. Generate JWT token
6. Return token and user data
```

#### 2. JWT Authentication Middleware

```javascript
// middleware/auth.js - authenticateToken()
1. Extract token from Authorization header
2. Verify token signature using JWT_SECRET
3. Decode token to get userId and role
4. Attach userId and role to request object
5. Call next() to continue to route handler
```

#### 3. Role-Based Access Control

```javascript
// middleware/auth.js - authorizeRole()
1. Check if user's role is in allowed roles
2. If yes: Continue to handler
3. If no: Return 403 Forbidden error
```

### Database Schema Design

#### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['candidate', 'recruiter', 'admin'],
  phone: String,
  location: String,
  bio: String,
  skills: [String],
  resume: String (URL),
  company: String (for recruiters),
  bookmarkedJobs: [JobId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Job Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: String,
  jobType: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  skills: [String],
  experience: String,
  qualifications: [String],
  postedBy: UserId (recruiter),
  applicants: [UserId],
  applicationsCount: Number,
  isOpen: Boolean,
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date
}
```

#### Application Schema
```javascript
{
  _id: ObjectId,
  jobId: JobId,
  candidateId: UserId,
  recruiterId: UserId,
  resume: String (URL),
  coverLetter: String,
  status: ['applied', 'reviewing', 'shortlisted', 'rejected', 'selected'],
  appliedAt: Date,
  updatedAt: Date
}
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Navbar
├── Router (BrowserRouter)
│   ├── HomePage
│   ├── AuthPage (Login/Register)
│   ├── JobListingsPage
│   ├── JobDetailsPage
│   ├── CandidateDashboard
│   ├── RecruiterDashboard
│   └── AdminDashboard
├── Footer
└── AuthProvider (Context)
```

### State Management

#### Authentication State (Context API)

```javascript
// context/AuthContext.js
{
  user: {
    id: String,
    name: String,
    email: String,
    role: String
  },
  loading: Boolean,
  error: String,
  isAuthenticated: Boolean,
  isCandidate: Boolean,
  isRecruiter: Boolean,
  isAdmin: Boolean,
  
  registerAsync (name, email, password, role),
  loginAsync (email, password),
  logoutSync ()
}
```

### Custom Hooks

#### useAuth Hook
```javascript
// hooks/useAuth.js
// Returns auth context without needing useContext
const auth = useAuth()
// Returns: { user, loading, error, register, login, logout, ... }
```

#### useAsync Hook
```javascript
// hooks/useAsync.js
// Generic async operation hook
const { status, data, error, execute } = useAsync(asyncFunction)
// status: 'idle' | 'pending' | 'success' | 'error'
```

### API Client Configuration

```javascript
// utils/api.js
// Axios instance with:
// 1. Base URL configuration
// 2. Request interceptor: Adds JWT token to headers
// 3. Response interceptor: Handles 401 errors
```

### Protected Routes Implementation

```javascript
// components/ProtectedRoute.js
<ProtectedRoute>
  <CandidateDashboard />
</ProtectedRoute>

// Also supports role-based protection:
<RoleProtectedRoute allowedRoles={['recruiter']}>
  <RecruiterDashboard />
</RoleProtectedRoute>
```

## Data Flow Examples

### Job Search Flow

```
User Input Filter
        ↓
JobListingsPage State
        ↓
API Request (GET /jobs with query params)
        ↓
Backend Filters Data
        ↓
MongoDB Query Execution
        ↓
Response with Jobs + Pagination
        ↓
Frontend Renders JobCard Components
        ↓
User Sees Job List
```

### Job Application Flow

```
Candidate Views Job
        ↓
Clicks "Apply Now"
        ↓
Inputs Cover Letter
        ↓
Submits Application
        ↓
POST /applications/:jobId/apply
        ↓
Backend Creates Application Document
        ↓
Adds Candidate to Job's Applicants Array
        ↓
Response: Success Message
        ↓
Frontend Redirects to Dashboard
        ↓
Recruiter Sees Application in Job Details
```

### Profile Update Flow

```
User Edits Profile Form
        ↓
Frontend Validation
        ↓
PUT /users/profile Request
        ↓
Backend Validation
        ↓
MongoDB Updates User Document
        ↓
Response: Updated User Object
        ↓
Frontend Updates Local State
        ↓
UI Reflects Changes
```

## Error Handling Strategy

### Frontend Error Handling
```javascript
// Try-Catch + Error State
try {
  const result = await apiClient.post(...)
  setData(result.data)
} catch (error) {
  setError(error.response?.data?.message || 'Error occurred')
  // Show error to user
}
```

### Backend Error Handling
```javascript
// Controller Error Handling
try {
  // Business logic
} catch (error) {
  console.error(error)
  res.status(500).json({ 
    message: 'Server error', 
    error: error.message 
  })
}

// Global Error Middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
    error: isDevelopment ? err : {}
  })
})
```

## Security Considerations

### Password Security
```javascript
// Pre-save hook: Hash password with bcryptjs
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})
```

### JWT Token Management
```javascript
// Token sent in Authorization header
Authorization: Bearer <token>

// Token verified on every protected route
const decoded = jwt.verify(token, JWT_SECRET)
```

### Input Validation
```javascript
// Backend validation using express-validator
body('email').isEmail()
body('password').isLength({ min: 6 })

// Frontend validation before submission
if (!email || !password) {
  setError('All fields required')
}
```

## Performance Optimizations

### Database Indexing
```javascript
// Email is indexed for fast lookups
userSchema.index({ email: 1 })

// Pagination prevents loading all records
GET /jobs?page=1&limit=10
```

### Frontend Optimization
```javascript
// Code splitting with React Router
const HomePage = lazy(() => import('./pages/HomePage'))

// Conditional rendering of components
{loading && <Spinner />}
{error && <Error />}
{data && <Content />}
```

## Testing Checklist

1. **Authentication**
   - Register with new account
   - Login with valid credentials
   - Login with invalid credentials
   - Token persistence after refresh

2. **Jobs**
   - Search with filters
   - View job details
   - Apply for job
   - Pagination works

3. **Profile**
   - Update profile info
   - Add/remove skills
   - Update resume

4. **Admin**
   - View all users
   - Block/Unblock user
   - Delete user

## Deployment Considerations

1. **Environment Variables**
   - Use production MongoDB URI
   - Use strong JWT_SECRET
   - Set NODE_ENV=production

2. **Frontend Build**
   - Run npm run build
   - Deploy build folder to CDN/hosting

3. **API CORS**
   - Update CORS origins for production domain
   - Restrict API access to frontend domain

4. **Security Headers**
   - Add HTTPS/SSL
   - Set secure cookies
   - Add security middleware
