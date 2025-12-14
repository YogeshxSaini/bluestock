import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SettingsPage from '../pages/SettingsPage';

jest.mock('../api/auth', () => ({
  __esModule: true,
  default: {
    updateProfile: jest.fn(),
  },
}));

jest.mock('../api/company', () => ({
  __esModule: true,
  getCompanyProfile: jest.fn().mockResolvedValue({ data: { company: { company_name: 'Acme', industry: 'Tech', city: 'SF', state: 'CA' } } }),
  updateCompanyProfile: jest.fn().mockResolvedValue({ data: { success: true, data: { company: { company_name: 'Acme', industry: 'Tech', city: 'SF', state: 'CA' } } } }),
}));

jest.mock('../utils/notify', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

const authAPI = require('../api/auth').default;
const companyAPI = require('../api/company');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: { id: 1, full_name: 'User Name', email: 'u@example.com' }, token: 't' },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },
  },
});

const companySlice = createSlice({
  name: 'company',
  initialState: { profile: null },
  reducers: {
    setCompanyProfile: (state, action) => { state.profile = action.payload; },
  },
});

const store = configureStore({ reducer: { auth: authSlice.reducer, company: companySlice.reducer } });
const qc = new QueryClient();

describe('SettingsPage', () => {
  it('updates user name via API and Redux', async () => {
    authAPI.updateProfile.mockResolvedValueOnce({ data: { success: true, data: { user: { id: 1, full_name: 'Updated Name', email: 'u@example.com' } } } });

    render(
      <Provider store={store}>
        <QueryClientProvider client={qc}>
          <MemoryRouter>
            <SettingsPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(authAPI.updateProfile).toHaveBeenCalledWith({ full_name: 'Updated Name' });
    });
  });

  it('opens company edit dialog and saves', async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={qc}>
          <MemoryRouter>
            <SettingsPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    // Wait for profile fetch
    await waitFor(() => {
      // Target the 'Company' section header specifically
      const headings = screen.getAllByText(/Company/i);
      expect(headings.length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /Edit Company/i }));

    const companyNameInput = screen.getByLabelText(/Company Name/i);
    fireEvent.change(companyNameInput, { target: { value: 'Acme Updated' } });

    const saveBtn = screen.getByRole('button', { name: /^Save$/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(companyAPI.updateCompanyProfile).toHaveBeenCalled();
    });
  });
});
