# Quick Reference Card

## 🚀 Start Commands

### Backend
```bash
cd backend
npm install
npm run dev          # Development mode with hot reload
npm start           # Production mode
npm test            # Run tests
npm run test:coverage  # Tests with coverage
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
npm test           # Run tests
```

### Docker
```bash
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
docker-compose ps           # Check status
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Health Check | http://localhost:4000/api/health |
| PostgreSQL | localhost:5432 |

---

## 📊 Database

### Connection
```bash
psql -U company_user -d company_db
```

### Useful Commands
```sql
-- Show all tables
\dt

-- View users
SELECT * FROM users;

-- View companies
SELECT * FROM company_profile;

-- Check user count
SELECT COUNT(*) FROM users;

-- Exit
\q
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=4000
DB_USER=company_user
DB_PASSWORD=company_password
DB_NAME=company_db
JWT_SECRET=your-secret-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 🧪 Test Credentials

### Demo User
```
Email: demo@example.com
Password: DemoPass123!
Mobile: +1234567890
```

### OTP for Testing
```
Any 6-digit number (e.g., 123456)
```

---

## 📡 API Endpoints

### Authentication
```http
POST   /api/auth/register      # Register user
POST   /api/auth/login         # Login user
GET    /api/auth/verify-email  # Verify email
POST   /api/auth/verify-mobile # Verify mobile OTP
GET    /api/auth/me            # Get current user (Protected)
```

### Company
```http
POST   /api/company/register       # Register company (Protected)
GET    /api/company/profile        # Get company (Protected)
PUT    /api/company/profile        # Update company (Protected)
POST   /api/company/upload-logo    # Upload logo (Protected)
POST   /api/company/upload-banner  # Upload banner (Protected)
```

---

## 🔐 Authentication

### Get Token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"DemoPass123!"}'
```

### Use Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/auth/me
```

---

## 🐛 Troubleshooting

### Port in Use
```bash
# Find process on port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Database Issues
```bash
# Restart PostgreSQL (macOS)
brew services restart postgresql@15

# Check if running
pg_isready

# Reset database
psql postgres
DROP DATABASE company_db;
CREATE DATABASE company_db;
\q
psql -U company_user -d company_db -f company_db.sql
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Common Tasks

### Update Seed Data
```bash
# Edit company_db.sql
# Re-import
psql -U company_user -d company_db -f company_db.sql
```

### Check API Health
```bash
curl http://localhost:4000/api/health
```

### View Backend Logs
```bash
cd backend
npm run dev
# Logs appear in terminal
```

### Run Specific Test
```bash
cd backend
npm test -- auth.test.js
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| backend/.env | Backend configuration |
| frontend/.env | Frontend configuration |
| backend/src/config/index.js | Backend config loader |
| company_db.sql | Database schema |
| docker-compose.yml | Docker services |
| postman_collection.json | API tests |

---

## 📚 Documentation

| Document | Location |
|----------|----------|
| Main README | README.md |
| API Docs | docs/API.md |
| Setup Guide | docs/SETUP_GUIDE.md |
| Demo Script | docs/DEMO_SCRIPT.md |
| Project Summary | PROJECT_SUMMARY.md |

---

## 🎯 Demo Checklist

- [ ] Database running and seeded
- [ ] Backend running on :4000
- [ ] Frontend running on :5173
- [ ] Postman collection imported
- [ ] Test user created
- [ ] Company registered
- [ ] Images uploaded
- [ ] All endpoints tested

---

## 💡 Quick Tips

1. **Use Redux DevTools** to inspect state
2. **Check Network tab** for API calls
3. **View console logs** for errors
4. **Use Postman** for API testing
5. **Keep terminals open** to see logs
6. **Test with real emails** using your chosen provider
7. **Use valid phone numbers** for OTP

---

## 🆘 Need Help?

1. Check main README.md
2. Review API documentation
3. Check console logs
4. Verify environment variables
5. Ensure services are running
6. Check database connection
7. Review error messages

---

**Quick Reference v1.0**  
Last Updated: December 2025
