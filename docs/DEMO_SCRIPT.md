# Demo Script - Company Registration & Verification Module
**Date:** August 13, 2025
**Duration:** 15-20 minutes
**Environment:** localhost

---

## Pre-Demo Checklist

- [ ] PostgreSQL running and database imported
- [ ] Backend server running on port 4000
- [ ] Frontend server running on port 5173
- [ ] Postman collection imported
- [ ] Test accounts ready
- [ ] Browser developer tools open (Redux DevTools)
- [ ] Demo data prepared

---

## Demo Outline

### 1. Introduction (2 minutes)

**Show:** Project overview and architecture

**Say:**
> "Today I'll demonstrate a production-ready Company Registration & Verification Module built with React 19, Node.js 20, and PostgreSQL. The system includes user authentication (demo), JWT-based authorization, multi-step company registration, and cloud-based image uploads."

**Display:**
- Project README
- Tech stack overview
- Architecture diagram (if available)

---

### 2. Database & Backend Setup (2 minutes)

**Show:** Database schema and seed data

```bash
# Terminal 1: Show database
psql -U company_user -d company_db
\dt  # Show tables
SELECT * FROM users LIMIT 2;
SELECT * FROM company_profile LIMIT 2;
\q
```

**Show:** Backend server running

```bash
# Terminal 2: Backend logs
cd backend
npm run dev
# Show: Server running on port 4000
# Show: Database connected message
```

**Test:** Health check endpoint

```bash
curl http://localhost:4000/api/health
```

---

### 3. User Registration Flow (3 minutes)

**Action:** Open frontend at `http://localhost:5173`

**Demonstrate:**

1. **Navigate to Registration Page**
   - Click "Sign Up" or go to `/register`

2. **Fill Registration Form**
   ```
   Full Name: Demo User
   Email: demo.user@example.com
   Phone: +1 (555) 123-4567
   Gender: Male
   Password: DemoPass123!
   Confirm Password: DemoPass123!
   ```

3. **Submit Form**
   - Show loading spinner
   - Show success toast notification
   - Show redirect to login page

**Explain:**
> "The registration process creates a user in our PostgreSQL database. Password is hashed with bcrypt, and the phone number is validated using libphonenumber-js. The user receives email and SMS verification prompts (demo)."

---

### 4. Authentication & JWT (3 minutes)

**Action:** Login with created user

1. **Login via Frontend**
   - Email: `demo.user@example.com`
   - Password: `DemoPass123!`

2. **Show JWT Token**
   - Open Redux DevTools
   - Navigate to State → auth → token
   - Copy JWT token

3. **Decode JWT** (jwt.io or browser console)
   ```javascript
   const token = "eyJhbGciOi...";
   const decoded = JSON.parse(atob(token.split('.')[1]));
   console.log(decoded);
   // Show: userId, email, exp (90 days)
   ```

4. **Test Protected Endpoint** (Postman)
   - Request: `GET /api/auth/me`
   - Headers: `Authorization: Bearer <token>`
   - Show: User profile returned

**Explain:**
> "Our JWT tokens are valid for 90 days and securely store the user ID. All protected endpoints validate this token via middleware before processing requests."

---

### 5. Mobile OTP Verification (2 minutes)

**Action:** Use Postman to verify mobile

**Request:**
```http
POST http://localhost:4000/api/auth/verify-mobile
Content-Type: application/json

{
  "user_id": 1,
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mobile number verified successfully",
  "data": {
    "mobile_no": "+15551234567",
    "is_mobile_verified": true
  }
}
```

**Explain:**
> "In production, use an SMS provider to handle OTP verification. For demo purposes, we accept any 6-digit OTP. The verification status is stored in our database."

---

### 6. Multi-Step Company Registration (4 minutes)

**Action:** Register a company

1. **Navigate to Dashboard**
   - Show "Register Company" button
   - Click to start registration

2. **Step 1: Company Details**
   ```
   Company Name: Tech Innovations Inc
   Industry: Technology
   Website: https://techinnovations.com
   ```
   - Click "Next"
   - Open Redux DevTools
   - Show: formData in company slice
   - Navigate back and forth to show persistence

3. **Step 2: Address Information**
   ```
   Address: 123 Innovation Drive
   City: San Francisco
   State: California
   Country: USA
   Postal Code: 94102
   ```
   - Click "Next"

4. **Step 3: Additional Info**
   ```
   Founded Date: 2020-01-15
   Description: Leading technology solutions provider
   ```
   - Click "Submit"
   - Show: Success toast
   - Show: Redirect to dashboard
   - Show: Company info displayed

**Explain:**
> "The multi-step form uses react-hook-form for validation and Redux Toolkit for state persistence. Users can navigate between steps without losing data. All fields are validated both client-side and server-side."

---

### 7. Image Upload with Cloudinary (3 minutes)

**Action:** Upload company logo and banner

**Using Postman:**

1. **Upload Logo**
   ```http
   POST http://localhost:4000/api/company/upload-logo
   Authorization: Bearer <token>
   Content-Type: multipart/form-data

   file: [Select image file]
   ```

   **Response:**
   ```json
   {
     "success": true,
     "message": "Logo uploaded successfully",
     "data": {
       "logo_url": "https://res.cloudinary.com/..."
     }
   }
   ```

2. **Upload Banner**
   - Same process for banner
   - Show Cloudinary URL

3. **Refresh Dashboard**
   - Show images displayed
   - Show responsive image loading

**Explain:**
> "Images are uploaded to Cloudinary with automatic optimization and transformation. The URLs are stored in our database and displayed in the UI. Cloudinary handles CDN delivery for fast loading."

---

### 8. Company Profile Management (2 minutes)

**Action:** Update company profile

**Using Postman:**

```http
PUT http://localhost:4000/api/company/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "company_name": "Tech Innovations Corp",
  "description": "Updated company description with more details"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company profile updated successfully",
  "data": {
    "company": {
      // Updated company object
    }
  }
}
```

**Action:** Refresh frontend dashboard
- Show updated information

---

### 9. API Testing & Error Handling (2 minutes)

**Action:** Run Postman collection

1. **Run Collection Tests**
   - Click "Run Collection"
   - Show all tests passing
   - Show test assertions

2. **Demonstrate Error Handling**

   **Invalid Login:**
   ```http
   POST /api/auth/login
   {
     "email": "demo.user@example.com",
     "password": "wrongpassword"
   }
   ```
   - Show: 401 Unauthorized
   - Show: Error message

   **Missing Token:**
   ```http
   GET /api/company/profile
   # No Authorization header
   ```
   - Show: 401 Unauthorized

   **Validation Error:**
   ```http
   POST /api/company/register
   {
     "company_name": "Test"
     # Missing required fields
   }
   ```
   - Show: 400 Bad Request
   - Show: Detailed field errors

**Explain:**
> "All endpoints return consistent error responses with appropriate HTTP status codes. Validation errors include field-level details to help developers debug issues."

---

### 10. Testing Coverage (2 minutes)

**Action:** Show test results

**Backend Tests:**
```bash
cd backend
npm run test:coverage
```

**Show:**
- Test suites passing
- Coverage report
- Key test files

**Frontend Tests:**
```bash
cd frontend
npm test
```

**Explain:**
> "We have comprehensive test coverage including unit tests for utilities, integration tests for API endpoints, and component tests for the frontend. All tests are automated and can run in CI/CD pipelines."

---

### 11. Documentation Review (1 minute)

**Show:**

1. **API Documentation** (`docs/API.md`)
   - Endpoint descriptions
   - Request/response examples
   - Authentication requirements

2. **README.md**
   - Setup instructions
   - Configuration guide
   - Deployment steps

3. **Postman Collection**
   - All endpoints documented
   - Test scripts included
   - Environment variables

---

## Demo Conclusion (1 minute)

**Recap:**
> "We've demonstrated:
> - Complete user registration and authentication flow
> - JWT-based security with 90-day token validity
> - Multi-step company registration with state persistence
> - Cloud-based image uploads to Cloudinary
> - Comprehensive API testing and error handling
> - Full test coverage and documentation"

**Next Steps:**
> "The application is production-ready and can be deployed to any cloud platform. All code follows best practices for security, scalability, and maintainability."

---

## Backup Scenarios (If Issues Arise)

### If Frontend Fails:
- Use Postman exclusively to demonstrate API
- Show source code for React components

### If Database Fails:
- Show seed data in SQL file
- Explain schema design

### If Image Upload Fails:
- Show previous uploads
- Explain Cloudinary integration

---

## Questions to Anticipate

**Q: How is security handled?**
A: JWT tokens, bcrypt password hashing, input validation, SQL injection prevention, XSS protection

**Q: Can this scale?**
A: Yes - uses connection pooling, stateless architecture, can add Redis caching, horizontal scaling ready

**Q: How long did this take to build?**
A: Following requirements and best practices, approximately [X] hours including testing and documentation

**Q: What about deployment?**
A: Docker-ready, can deploy to AWS/Azure/GCP, includes CI/CD configuration files

---

**Demo Complete! ✅**
