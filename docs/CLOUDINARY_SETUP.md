# Cloudinary Configuration Guide

## Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Click "Sign Up Free"
3. Fill in your details or sign up with Google/GitHub
4. Verify your email address

## Step 2: Get API Credentials

1. Log in to [Cloudinary Console](https://console.cloudinary.com/)
2. Go to **Dashboard**
3. You'll see your credentials:
   ```
   Cloud Name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz12
   ```

## Step 3: Create Upload Presets (Optional but Recommended)

1. Go to **Settings** → **Upload**
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure preset:
   - **Preset name**: `company_logos`
   - **Signing Mode**: Signed
   - **Folder**: `company/logos`
   - **Format**: Auto
   - **Quality**: Auto
   - **Image transformations**:
     - Width: 500px
     - Height: 500px
     - Crop: Fill
5. Save preset
6. Repeat for banners:
   - **Preset name**: `company_banners`
   - **Folder**: `company/banners`
   - **Width**: 1200px
   - **Height**: 400px

## Step 4: Update Backend .env

Edit `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz12
```

## Step 5: Verify Configuration

### Backend Test:
```bash
cd backend
npm run dev
```

Look for: `✅ Cloudinary configured successfully`

### Test Upload via API:

```bash
# Login and get token
TOKEN=$(curl -s http://localhost:4000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"DemoPass123!"}' \
  | jq -r '.data.token')

# Upload logo (replace path with your image)
curl -X POST http://localhost:4000/api/company/upload-logo \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/logo.png"

# Upload banner
curl -X POST http://localhost:4000/api/company/upload-banner \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/banner.jpg"
```

## Step 6: Test in Browser

1. Login to your app
2. Go to Dashboard
3. If you have a company registered, you should see upload buttons
4. Click "Upload Logo" or "Upload Banner"
5. Select an image file
6. Image should upload to Cloudinary and URL saved to database

## Cloudinary Features Used

### Image Optimization
- Automatic format conversion (WebP for supported browsers)
- Quality optimization
- Responsive image delivery

### Image Transformations
- Resize and crop
- Format conversion
- Quality adjustment
- Compression

### Storage Structure
```
your-cloud-name/
├── company/
│   ├── logos/
│   │   ├── logo_abc123.png
│   │   ├── logo_def456.jpg
│   │   └── ...
│   └── banners/
│       ├── banner_abc123.jpg
│       ├── banner_ghi789.png
│       └── ...
```

## Supported File Formats

### Images:
- JPEG/JPG
- PNG
- GIF
- SVG
- WebP
- BMP

### Max File Size:
- Free tier: 10MB per file
- Can be configured in backend: `MAX_FILE_SIZE=5242880` (5MB)

## Security Best Practices

1. **Never expose API Secret in frontend**
   - Only use Cloud Name and API Key in frontend
   - Keep API Secret in backend .env only

2. **Use Signed Uploads**
   - Current implementation uses backend for uploads (secure)
   - Backend generates signed URLs

3. **Restrict File Types**
   - Backend validates file types (images only)
   - Uses multer for file upload handling

4. **Set Upload Limits**
   - File size limits configured
   - File type restrictions in place

## Cloudinary Dashboard Features

### Media Library
- View all uploaded images
- Search and filter
- Delete old images
- Get image URLs

### Transformations
- Edit images directly in dashboard
- Apply filters and effects
- Generate transformation URLs

### Analytics
- Storage usage
- Bandwidth usage
- Transformation credits
- Request analytics

## Troubleshooting

### Error: "Invalid API credentials"
- Verify Cloud Name, API Key, and API Secret
- Check for typos in .env file
- Restart backend server after updating .env

### Error: "File too large"
- Check MAX_FILE_SIZE in backend/.env
- Default is 5MB (5242880 bytes)
- Cloudinary free tier allows up to 10MB

### Error: "Invalid file type"
- Only images are allowed
- Check file extension (.jpg, .png, etc.)
- Verify MIME type

### Images not appearing
- Check browser console for CORS errors
- Verify image URLs in database
- Check Cloudinary dashboard for uploaded images

## Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

This is sufficient for development and small production deployments.

## Upgrade Options

If you need more:
- **Plus Plan** ($99/month): 85 GB storage, 85 GB bandwidth
- **Advanced Plan** ($249/month): 160 GB storage, 160 GB bandwidth
- **Custom**: Enterprise pricing

## Next Steps

After configuration:
1. Test logo upload functionality
2. Test banner upload functionality
3. Verify images appear correctly in UI
4. Set up automatic image optimization
5. Configure CDN delivery (included with Cloudinary)

## Useful Links

- [Cloudinary Dashboard](https://console.cloudinary.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Transformation Reference](https://cloudinary.com/documentation/image_transformations)
