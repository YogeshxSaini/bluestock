// Mock Firebase for tests
export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

export const signIn = jest.fn();
export const signUp = jest.fn();
export const signOutUser = jest.fn();
export const sendEmailVerification = jest.fn();
export const sendPhoneOTP = jest.fn();
export const verifyPhoneOTP = jest.fn();
export const onAuthStateChange = jest.fn(() => jest.fn()); // Returns unsubscribe function
export const generateCustomToken = jest.fn();

export default {
  auth,
  signIn,
  signUp,
  signOutUser,
  sendEmailVerification,
  sendPhoneOTP,
  verifyPhoneOTP,
  onAuthStateChange,
  generateCustomToken,
};
