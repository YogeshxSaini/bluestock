import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VerifyEmailPage from '../pages/VerifyEmailPage';

jest.mock('../api/auth', () => ({
  __esModule: true,
  default: {
    verifyEmail: jest.fn(),
  },
}));

const authAPI = require('../api/auth').default;

const store = configureStore({ reducer: (state = { auth: { user: null } }) => state });

describe('VerifyEmailPage', () => {
  it('renders success when verification succeeds', async () => {
    authAPI.verifyEmail.mockResolvedValueOnce({ data: { success: true } });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/verify-email', search: '?userId=123' }]}>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Verifying Your Email/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Email Verified Successfully!/i)).toBeInTheDocument();
    });
  });

  it('shows manual verification when userId is missing', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/verify-email' }]}>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Verify Your Email/i)).toBeInTheDocument();
      expect(screen.getByText(/We sent a verification link/i)).toBeInTheDocument();
    });
  });
});
