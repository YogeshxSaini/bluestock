import '@testing-library/jest-dom';

// Simple localStorage mock helpers if needed
// (Jest's JSDOM provides localStorage, but we can ensure it's clean between tests)
beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch (_e) {
    // Ignore errors
  }
});
