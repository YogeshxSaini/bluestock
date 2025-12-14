import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '../pages/DashboardPage';
import companyReducer from '../store/slices/companySlice';

jest.mock('../api/company', () => ({
  __esModule: true,
  getCompanyProfile: jest.fn().mockResolvedValue({ data: { company: { company_name: 'Acme Co', industry: 'Tech', city: 'SF', state: 'CA', website: 'https://acme.example' } } }),
  updateCompanyProfile: jest.fn().mockResolvedValue({ data: { success: true, data: { company: { company_name: 'Acme Co', industry: 'Tech', city: 'SF', state: 'CA' } } } }),
  uploadCompanyLogo: jest.fn().mockResolvedValue({ data: { success: true, data: { company: { logo_url: 'https://img.example/logo.png' } } } }),
  uploadCompanyBanner: jest.fn().mockResolvedValue({ data: { success: true, data: { company: { banner_url: 'https://img.example/banner.png' } } } }),
}));

jest.mock('../utils/notify', () => ({
  __esModule: true,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const companyAPI = require('../api/company');

describe('Dashboard uploads', () => {
  it('enables upload buttons after file selection and calls APIs', async () => {
    const store = configureStore({
      reducer: {
        company: companyReducer,
        auth: (state = { user: { full_name: 'User', email: 'u@example.com', mobile_no: '+14155550123', is_email_verified: true, is_mobile_verified: true } }) => state,
      },
    });

    const qc = new QueryClient();

    const { container } = render(
      <Provider store={store}>
        <QueryClientProvider client={qc}>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );

    // Wait for company profile to load
    await waitFor(() => {
      expect(screen.getByText(/Company Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Acme Co/i)).toBeInTheDocument();
    });

    // Select files first to keep buttons enabled with text
    const selectLogoBtn = screen.getByRole('button', { name: /Select Logo/i });
    const logoInput = selectLogoBtn.querySelector('input[type="file"]');
    const logoFile = new File(['logo-bytes'], 'logo.png', { type: 'image/png' });
    fireEvent.change(logoInput, { target: { files: [logoFile] } });

    const uploadLogoBtn = Array.from(container.querySelectorAll('button')).find((b) => /Upload Logo/i.test(b.textContent || ''));

    // Select a banner file
    const selectBannerBtn = screen.getByRole('button', { name: /Select Banner/i });
    const bannerInput = selectBannerBtn.querySelector('input[type="file"]');
    const bannerFile = new File(['banner-bytes'], 'banner.png', { type: 'image/png' });
    fireEvent.change(bannerInput, { target: { files: [bannerFile] } });

    // MUI may render disabled buttons without accessible name; find by text then get button
    const uploadBannerBtnEl = Array.from(container.querySelectorAll('button')).find((b) => /Upload Banner/i.test(b.textContent || ''));

    // Click banner upload first, then logo upload to avoid shared uploading state conflicts
    fireEvent.click(uploadBannerBtnEl);
    await waitFor(() => {
      expect(companyAPI.uploadCompanyBanner).toHaveBeenCalled();
    });

    fireEvent.click(uploadLogoBtn);
    await waitFor(() => {
      expect(companyAPI.uploadCompanyLogo).toHaveBeenCalled();
    });

    // Both APIs should have been called by now
  });
});
