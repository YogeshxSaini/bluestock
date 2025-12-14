import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterPage from '../pages/RegisterPage';

jest.mock('../api/auth', () => ({
  __esModule: true,
  registerUser: jest.fn().mockResolvedValue({ data: { user: { user_id: 1, email: 'x@y.com', mobile_no: '+14155550123', full_name: 'X Y' } } }),
}));

jest.mock('../utils/notify', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

const store = configureStore({ reducer: (state = { auth: { user: null } }) => state });

describe('RegisterPage', () => {
  it('registers successfully and stores pending verification', async () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/register' }]}>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User', name: 'full_name' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'user@example.com', name: 'email' } });
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    fireEvent.change(passwordInput, { target: { value: 'Passw0rd!', name: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Passw0rd!', name: 'confirmPassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      const pv = window.localStorage.getItem('pendingVerification');
      expect(pv).toBeTruthy();
    });
  });
});
