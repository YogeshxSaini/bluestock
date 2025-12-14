# Company Registration & Verification Module

A production-ready full-stack application for company registration and verification, built with React 19, Node.js 20, Express, and PostgreSQL.

## 🚀 Features

- **User Authentication**: Register, login, email & SMS OTP verification (demo)
- **JWT-based Authorization**: Secure API endpoints with 90-day token validity
- **Multi-step Company Registration**: Interactive form with validation and state persistence
- **Image Uploads**: Logo and banner uploads via Cloudinary
- **Profile Management**: View and edit user and company profiles
- **Responsive Design**: Mobile-friendly UI with Material-UI
- **Comprehensive Testing**: Unit and integration tests for backend and frontend
- **Docker Support**: Easy deployment with Docker Compose

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Demo Script](#demo-script)
- [Security & Compliance](#security--compliance)

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite
- **Redux Toolkit** for state management
- **@tanstack/react-query** for data fetching
- **Material-UI** for UI components
- **react-hook-form** for form handling
- **Axios** for HTTP requests

### Backend
- **Node.js 20 LTS**
- **Express** web framework
- **PostgreSQL 15** database
- **JWT** for authentication (90-day expiry)
- **bcrypt** for password hashing
- **Cloudinary** for image storage

### Development
- **Jest** & **Supertest** for backend testing
- **Testing Library** for frontend testing
- **ESLint** & **Prettier** for code quality
- **Docker** & **Docker Compose** for containerization

## 📦 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15 or higher
- npm or yarn
- Docker & Docker Compose (optional)
- Cloudinary account (for image uploads)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd bluestock
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your-strong-secret-key-change-this-in-production
JWT_EXPIRES_IN=90d


# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Upload Configuration
MAX_FILE_SIZE=5242880
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
VITE_API_URL=http://localhost:4000/api

```

### 🔧 Cloudinary Setup (Optional)

For image uploads, configure Cloudinary:

#### Quick Setup:
```bash
./configure-services.sh
```

#### Detailed guide:
- **Cloudinary Setup**: [docs/CLOUDINARY_SETUP.md](docs/CLOUDINARY_SETUP.md)

**Note**: Authentication in this demo uses backend endpoints without third-party services.

## 💾 Database Setup

### 1. Create PostgreSQL Database

```bash
psql -U postgres
CREATE DATABASE company_db;
CREATE USER company_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE company_db TO company_user;
\q
```

### 2. Import Database Schema

```bash
psql -U company_user -d company_db -f company_db.sql
```

The SQL file includes:
- Table schemas (users, company_profile)
- Triggers for automatic timestamp updates
- Seed data for demo users and companies

## 🚀 Running the Application

### Option 1: Run Locally

#### Start Backend

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:4000`

#### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Option 2: Run with Docker

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Backend API on port 4000
- Frontend on port 5173

### Verify Services

- Backend Health Check: `http://localhost:4000/api/health`
- Frontend: `http://localhost:5173`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

### API Testing with Postman

Import `postman_collection.json` into Postman:
1. Open Postman
2. Click Import
3. Select `postman_collection.json`
4. Configure environment variables (baseUrl, authToken, userId)
5. Run the collection

## 📚 API Documentation

Comprehensive API documentation is available in `docs/API.md`.

### Quick Reference

**Authentication Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/verify-mobile` - Verify mobile OTP
- `GET /api/auth/me` - Get current user (protected)

**Company Endpoints:**
- `POST /api/company/register` - Register company (protected)
- `GET /api/company/profile` - Get company profile (protected)
- `PUT /api/company/profile` - Update company profile (protected)
- `POST /api/company/upload-logo` - Upload logo (protected)
- `POST /api/company/upload-banner` - Upload banner (protected)

## 📁 Project Structure

```
bluestock/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── tests/          # Test files
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express app entry
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/            # API client & services
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store & slices
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── docs/
│   └── API.md              # API documentation
├── company_db.sql          # Database schema
├── postman_collection.json # Postman test collection
├── docker-compose.yml      # Docker configuration
└── README.md               # This file
```

## 🎬 Demo Script

### Preparation

1. Ensure PostgreSQL is running
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Open Postman with imported collection

### Demo Flow

#### 1. User Registration & Authentication

1. **Register User** (Postman or Frontend)
   - Navigate to `/register`
   - Fill in: email, password, full name, mobile, gender
   - Submit form
   - Show success message

2. **Login**
   - Navigate to `/login`
   - Enter credentials
   - Show JWT token in Redux DevTools
   - Redirect to dashboard

#### 2. Mobile Verification

1. **Verify Mobile OTP** (Postman)
   - Use `POST /api/auth/verify-mobile`
   - Enter user_id and OTP (123456)
   - Show verification success

#### 3. Company Registration

1. **Navigate to Company Registration**
   - Click "Register Company" on dashboard
   - Show multi-step form

2. **Step 1: Company Details**
   - Enter company name, industry, website
   - Click "Next"
   - Show form data persisted in Redux

3. **Step 2: Address Information**
   - Enter address, city, state, country, postal code
   - Click "Next"

4. **Step 3: Additional Info**
   - Enter founded date, description
   - Click "Submit"
   - Show success and redirect to dashboard

#### 4. Image Uploads

1. **Upload Logo** (Postman)
   - Use `POST /api/company/upload-logo`
   - Attach image file
   - Show Cloudinary URL in response

2. **Upload Banner** (Postman)
   - Use `POST /api/company/upload-banner`
   - Attach image file
   - Show updated company profile

#### 5. Profile Management

1. **View Dashboard**
   - Show user profile card
   - Show company profile card
   - Display uploaded images

2. **Update Company** (Postman)
   - Use `PUT /api/company/profile`
   - Update company name or description
   - Show updated data on dashboard

#### 6. API Testing

1. **Run Postman Collection**
   - Show all endpoints
   - Run tests with assertions
   - Display test results

#### 7. Error Handling

1. **Invalid Login**
   - Show 401 error response
2. **Missing Token**
   - Show 401 unauthorized
3. **Validation Errors**
   - Show 400 with field errors

## 🔒 Security & Compliance

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum 8 characters, uppercase, number, special char

2. **JWT Authentication**
   - 90-day token expiry
   - Secure secret key
   - Token validation on protected routes

3. **Input Validation**
   - express-validator for request validation
   - sanitize-html for XSS prevention
   - Parameterized SQL queries (SQL injection prevention)

4. **HTTP Security**
   - Helmet for security headers
   - CORS configuration
   - Rate limiting ready (to be implemented)

5. **Data Protection**
   - Environment variables for secrets
   - No secrets in git repository
   - Secure Cloudinary uploads

### NDA Compliance

⚠️ **CONFIDENTIAL**: This codebase is proprietary and confidential. Do not:
- Publish code to public repositories
- Share code outside authorized channels
- Discuss project details publicly

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql -U company_user -d company_db -c "SELECT 1"
```

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📝 License

Proprietary - All Rights Reserved

## 👥 Contact

For questions or support, contact the development team.

---

**Last Updated:** December 2025
**Version:** 1.0.0
