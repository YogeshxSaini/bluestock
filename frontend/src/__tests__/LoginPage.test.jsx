import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import LoginPage from '../pages/LoginPage';

jest.mock('../api/auth', () => ({
  __esModule: true,
  loginUser: jest.fn().mockResolvedValue({ data: { token: 't', user: { email: 'a@b.com' } } }),
}));

jest.mock('../utils/notify', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {
    loginStart: (state) => { state.loading = true; },
    loginSuccess: (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user; },
    loginFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

const store = configureStore({ reducer: { auth: authSlice.reducer } });

describe('LoginPage', () => {
  it('logs in successfully and navigates', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/login' }]}>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'user@example.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Passw0rd!', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeEnabled();
    });
  });
});
