# Quick Setup Guide

This guide will help you get the Company Registration & Verification Module up and running in under 10 minutes.

## Prerequisites Installation

### 1. Install Node.js 20 (if not installed)

**macOS (using Homebrew):**
```bash
brew install node@20
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/)

**Verify installation:**
```bash
node --version  # Should show v20.x.x
npm --version
```

### 2. Install PostgreSQL 15 (if not installed)

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/)

**Verify installation:**
```bash
psql --version  # Should show 15.x
```

## Quick Start (5 Minutes)

### Step 1: Database Setup (2 minutes)

```bash
# Create database and user
psql postgres
CREATE DATABASE company_db;
CREATE USER company_user WITH PASSWORD 'company_password';
GRANT ALL PRIVILEGES ON DATABASE company_db TO company_user;
\q

# Import schema
psql -U company_user -d company_db -f company_db.sql
```

### Step 2: Backend Setup (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file (use your favorite editor)
nano .env

# Minimum required changes in .env:
# DB_USER=company_user
# DB_PASSWORD=company_password
# JWT_SECRET=your-random-secret-here-change-this

# Start backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on port 4000
```

### Step 3: Frontend Setup (1 minute)

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Verify Installation (1 minute)

**Backend health check:**
```bash
curl http://localhost:4000/api/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Frontend:**
Open browser to `http://localhost:5173`
- You should see the login page

## Testing the Application (5 Minutes)

### 1. Register a User

1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Gender: Male
   - Password: TestPass123!
3. Click "Sign Up"
4. You should see success message

### 2. Login

1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: TestPass123!
3. Click "Sign In"
4. You should be redirected to dashboard

### 3. Register Company

1. Click "Register Company" button on dashboard
2. Fill in company details (Step 1)
3. Fill in address information (Step 2)
4. Fill in additional info (Step 3)
5. Submit form
6. Company profile should appear on dashboard

## Optional: Import Postman Collection

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Configure environment:
   - baseUrl: `http://localhost:4000/api`
   - authToken: (will be set after login)
5. Run "Register User" and "Login User" requests
6. Test other endpoints

## Troubleshooting

### Database Connection Failed

**Error:** `ECONNREFUSED` or `database does not exist`

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it (macOS)
brew services start postgresql@15

# Recreate database
psql postgres
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
\q

# Re-import schema
psql -U company_user -d company_db -f company_db.sql
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=4001
```

### Cannot Connect to Backend from Frontend

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Verify backend is running on port 4000
2. Check CORS_ORIGIN in backend `.env`:
   ```
   CORS_ORIGIN=http://localhost:5173
   ```
3. Check VITE_API_URL in frontend `.env`:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```

### Dependencies Installation Failed

**Error:** `npm ERR!` during `npm install`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Cloudinary Setup (Optional)

Cloudinary is optional for basic testing but required for image upload features.

### Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard
4. Copy credentials to backend `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Ensure Docker is installed and running
docker --version
docker-compose --version

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- PostgreSQL: localhost:5432

## Next Steps

1. ✅ Read the full README.md
2. ✅ Review API documentation in docs/API.md
3. ✅ Run tests: `npm test` (in backend and frontend)
4. ✅ Import Postman collection for API testing
5. ✅ Review demo script in docs/DEMO_SCRIPT.md

## Getting Help

- Check the main README.md for detailed documentation
- Review API.md for endpoint specifications
- Check console logs for error messages
- Ensure all environment variables are set correctly

---

**Setup Complete! 🎉**

You should now have a fully functional Company Registration & Verification Module running locally.
