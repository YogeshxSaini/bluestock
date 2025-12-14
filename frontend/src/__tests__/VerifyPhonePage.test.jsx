import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VerifyPhonePage from '../pages/VerifyPhonePage';

jest.mock('../api/auth', () => ({
  __esModule: true,
  default: {
    verifyMobileOTP: jest.fn(),
  },
}));

jest.mock('../utils/notify', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const authAPI = require('../api/auth').default;

describe('VerifyPhonePage', () => {
  beforeEach(() => {
    window.localStorage.setItem('pendingVerification', JSON.stringify({ userId: 1, mobile_no: '+14155550123' }));
    authAPI.verifyMobileOTP.mockReset();
  });

  it('submits OTP and shows success flow', async () => {
    authAPI.verifyMobileOTP.mockResolvedValueOnce({ data: { success: true } });

    const store = configureStore({ reducer: (state = { auth: { user: null } }) => state });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/verify-phone' }]}>
          <VerifyPhonePage />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByLabelText(/Enter OTP/i);
    fireEvent.change(input, { target: { value: '123456' } });

    const button = screen.getByRole('button', { name: /Verify OTP/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(authAPI.verifyMobileOTP).toHaveBeenCalledWith(1, '123456');
    });
  });
});
