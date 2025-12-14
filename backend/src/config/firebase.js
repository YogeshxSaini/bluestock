import admin from 'firebase-admin';
import config from './index.js';

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Check if required credentials exist
    if (!config.firebase.projectId || !config.firebase.privateKey || !config.firebase.clientEmail) {
      console.warn('⚠️  Firebase credentials not configured. Firebase features will be limited.');
      return null;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        privateKey: config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    return null;
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Decoded token
 */
export const verifyIdToken = async (idToken) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

/**
 * Get user by email from Firebase
 * @param {string} email - User email
 * @returns {Promise<Object>} User record
 */
export const getUserByEmail = async (email) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord;
  } catch (error) {
    throw new Error('User not found in Firebase');
  }
};

/**
 * Create a new Firebase user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} User record
 */
export const createFirebaseUser = async ({ email, password, displayName, phoneNumber }) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      phoneNumber,
      emailVerified: false,
    });
    
    return userRecord;
  } catch (error) {
    throw new Error(`Failed to create Firebase user: ${error.message}`);
  }
};

/**
 * Send email verification link
 * @param {string} email - User email
 * @returns {Promise<string>} Verification link
 */
export const generateEmailVerificationLink = async (email) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const link = await admin.auth().generateEmailVerificationLink(email);
    return link;
  } catch (error) {
    throw new Error('Failed to generate verification link');
  }
};

/**
 * Verify user exists in Firebase and get their UID
 * @param {string} email - User email
 * @returns {Promise<string>} Firebase UID
 */
export const verifyFirebaseUser = async (email) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord.uid;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw new Error(`Failed to verify Firebase user: ${error.message}`);
  }
};

/**
 * Send SMS OTP to phone number
 * Note: Firebase Admin SDK doesn't send SMS directly. This generates a custom token
 * that can be used client-side to verify phone numbers
 * @param {string} uid - Firebase user UID
 * @returns {Promise<string>} Custom token
 */
export const generateCustomToken = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    throw new Error(`Failed to generate custom token: ${error.message}`);
  }
};

/**
 * Verify phone number OTP (Note: Firebase Admin SDK doesn't directly verify OTP,
 * this should be handled client-side. This is a placeholder for the workflow.)
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise<boolean>} Verification result
 */
export const verifyPhoneNumber = async (phoneNumber, otp) => {
  // In a real implementation, this would validate the OTP through Firebase
  // For now, this is a placeholder that should be implemented client-side
  console.log(`Phone verification for ${phoneNumber} with OTP ${otp}`);
  return true;
};

export default {
  initializeFirebase,
  verifyIdToken,
  getUserByEmail,
  createFirebaseUser,
  generateEmailVerificationLink,
  verifyFirebaseUser,
  generateCustomToken,
  verifyPhoneNumber,
};
