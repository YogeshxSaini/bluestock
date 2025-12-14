import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('✅ Firebase initialized');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

/**
 * Create user with email and password
 */
export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Send email verification
 */
export const sendEmailVerification = async (user) => {
  try {
    await firebaseSendEmailVerification(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign out
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get current user's ID token
 */
export const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }
  const token = await user.getIdToken();
  return token;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (user, profile) => {
  try {
    await updateProfile(user, profile);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Setup reCAPTCHA verifier for phone authentication
 */
export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
    });
  }
  return window.recaptchaVerifier;
};

/**
 * Send OTP to phone number
 */
export const sendPhoneOTP = async (phoneNumber) => {
  try {
    const appVerifier = setupRecaptcha('recaptcha-container');
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Verify phone OTP
 */
export const verifyPhoneOTP = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
export default app;
