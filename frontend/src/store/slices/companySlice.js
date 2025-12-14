import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  // Multi-step form state
  registrationStep: 0,
  formData: {
    company_name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    website: '',
    industry: '',
    founded_date: '',
    description: '',
    social_links: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
  },
  logoPreview: null,
  bannerPreview: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
    nextStep: (state) => {
      state.registrationStep += 1;
    },
    previousStep: (state) => {
      state.registrationStep = Math.max(0, state.registrationStep - 1);
    },
    setLogoPreview: (state, action) => {
      state.logoPreview = action.payload;
    },
    setBannerPreview: (state, action) => {
      state.bannerPreview = action.payload;
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.registrationStep = 0;
      state.logoPreview = null;
      state.bannerPreview = null;
    },
    companyLoadingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    companyLoadingEnd: (state) => {
      state.isLoading = false;
    },
    companyError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCompanyProfile,
  updateFormData,
  setRegistrationStep,
  nextStep,
  previousStep,
  setLogoPreview,
  setBannerPreview,
  resetFormData,
  companyLoadingStart,
  companyLoadingEnd,
  companyError,
  clearCompanyError,
} = companySlice.actions;

export default companySlice.reducer;

// Selectors
export const selectCompany = (state) => state.company;
export const selectCompanyProfile = (state) => state.company.profile;
export const selectFormData = (state) => state.company.formData;
export const selectRegistrationStep = (state) => state.company.registrationStep;
