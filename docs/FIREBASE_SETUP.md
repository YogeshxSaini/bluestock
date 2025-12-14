# Firebase Configuration Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `company-registration-app`
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
3. Enable **Phone** (for SMS verification):
   - Click on "Phone"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Get Firebase Admin SDK Credentials (Backend)

1. Go to **Project Settings** (gear icon) → **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file (e.g., `firebase-admin-sdk.json`)
4. Extract these values:
   ```json
   {
     "project_id": "your-project-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
   }
   ```

## Step 4: Get Firebase Client SDK Config (Frontend)

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `company-registration-web`
5. Copy the config object:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   }
   ```

## Step 5: Update Backend .env

Edit `backend/.env`:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

**Important**: 
- Keep the quotes around FIREBASE_PRIVATE_KEY
- Keep the `\n` characters for line breaks in the private key
- Don't commit this file to Git!

## Step 6: Update Frontend .env

Edit `frontend/.env`:

```env
# Firebase Client SDK Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...
```

## Step 7: Verify Configuration

### Backend Test:
```bash
cd backend
npm run dev
```

Look for: `✅ Firebase initialized successfully`

### Frontend Test:
Open browser console and check for Firebase initialization logs.

## Troubleshooting

### Error: "Failed to parse private key"
- Make sure the private key is wrapped in quotes in .env
- Ensure `\n` characters are present (not actual line breaks)
- Copy the entire key including BEGIN/END markers

### Error: "Firebase app not initialized"
- Check that all required env variables are set
- Restart the dev server after updating .env
- Verify project ID matches in both backend and frontend

## Testing Email Verification

1. Register a new user
2. Check Firebase Console → Authentication → Users
3. User should appear with "Email not verified" status
4. Implement email verification flow in your app

## Testing Phone Verification (Optional)

1. Add phone number to user profile
2. Request verification code via Firebase
3. Verify the code to mark phone as verified

## Security Notes

- Never commit `.env` files to Git
- Keep service account JSON file secure
- Add `.env` to `.gitignore`
- Use environment-specific Firebase projects (dev/staging/prod)

## Next Steps

After configuration:
1. Test user registration with email verification
2. Test phone number verification
3. Implement password reset flow
4. Add social auth providers (Google, GitHub, etc.) if needed
