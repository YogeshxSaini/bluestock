# Cloudinary Setup - Quick Start

## 📋 Prerequisites

- Cloudinary account (free): https://cloudinary.com/

## 🚀 Quick Setup (5 minutes each)

### Authentication Provider (Optional)

For production email/SMS verification, integrate your chosen provider and update backend endpoints accordingly.

### Cloudinary Setup (3 min)

1. **Sign Up**: https://cloudinary.com/
2. **Get Credentials**: Dashboard shows Cloud Name, API Key, API Secret
3. **Optional**: Create upload presets for logos and banners

## ⚡ Configuration Methods

### Method 1: Interactive Script (Recommended)
```bash
./configure-services.sh
```

### Method 2: Manual Configuration

**Backend** (`backend/.env`):
```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz12
```

**Frontend** (`frontend/.env`):
```env
# API (already configured)
VITE_API_URL=http://localhost:4000/api
```

## ✅ Verification

### Start Servers:
```bash
# Terminal 1 - Backend
cd backend && npm run dev
# Look for: ✅ Cloudinary configured successfully

# Terminal 2 - Frontend
cd frontend && npm run dev
# Open: http://localhost:5173
```

### Test Authentication Provider (if configured):
1. Register a new user
2. Verify email/phone via your provider

### Test Cloudinary:
1. Login to app
2. Register a company (if not done)
3. Upload logo or banner image
4. Check Cloudinary Console → Media Library
5. Image should appear with URL

## 📚 Detailed Guides

- **Cloudinary**: `docs/CLOUDINARY_SETUP.md`

## 🔧 Troubleshooting

### Authentication Provider Issues
- Check: Backend integration errors
- Fix: Verify provider credentials and endpoints
- Restart: Backend server after updating .env

### Cloudinary Not Working
- Check: "Cloudinary not configured" warning
- Fix: Verify all 3 credentials (Cloud Name, API Key, Secret)
- Test: Use test-api.sh to verify connection

### Environment Variables Not Loading
- Restart: Both backend and frontend servers after .env changes
- Verify: .env files are in correct directories (backend/.env, frontend/.env)
- Check: No typos in variable names (exact match required)

## 🎯 What You Get

### With Cloudinary:
✅ Company logo uploads  
✅ Company banner uploads  
✅ Automatic image optimization  
✅ CDN delivery (fast image loading)  
✅ Image transformations (resize, crop)  

## 💡 Development vs Production

### Development (Current):
- Cloudinary: Free tier (25GB storage, 25GB bandwidth/month)
- Perfect for local testing and demos

### Production (When Deploying):
- Consider Cloudinary paid plan if high traffic
- Use environment-specific .env files
- Enable additional security rules

## 🔐 Security Notes

⚠️ **NEVER commit .env files to Git!**

Already protected:
- `.env` is in `.gitignore`
- `.env.example` files show structure only (no real credentials)

Best practices:
- Use different credentials for dev/staging/prod
- Rotate API keys periodically
- Monitor usage in dashboards
- Set up billing alerts

## 📞 Support

- Cloudinary: https://support.cloudinary.com/
- Project Issues: Check `docs/` folder for detailed guides

## 🎉 Ready to Go!

Once configured, your app will have:
1. Image upload capabilities
2. Professional CDN-backed image delivery
3. Production-ready image workflow

Start with the interactive script: `./configure-services.sh`

Or follow the detailed guides in `docs/` folder! 🚀
