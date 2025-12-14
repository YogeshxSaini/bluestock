import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
} from '@mui/material';
import { toast } from '../utils/notify';
import DashboardLayout from '../components/DashboardLayout';
import {
  selectFormData,
  selectRegistrationStep,
  updateFormData,
  nextStep,
  previousStep,
  resetFormData,
  setLogoPreview,
  setBannerPreview,
} from '../store/slices/companySlice';
import { registerCompany, uploadCompanyLogo, uploadCompanyBanner } from '../api/company';

const steps = ['Company Details', 'Address Information', 'Additional Info'];

const CompanyRegistrationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const formData = useSelector(selectFormData);
  const activeStep = useSelector(selectRegistrationStep);
  const logoPreview = useSelector((state) => state.company.logoPreview);
  const bannerPreview = useSelector((state) => state.company.bannerPreview);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData,
  });

  const handleNext = (data) => {
    dispatch(updateFormData(data));
    if (activeStep === steps.length - 1) {
      handleFinalSubmit();
    } else {
      dispatch(nextStep());
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      await registerCompany(formData);
      toast.success('Company registered successfully!');

      // Upload selected images after successful registration
      if (logoFile) {
        try {
          await uploadCompanyLogo(logoFile);
          toast.success('Logo uploaded');
        } catch (e) {
          toast.error(e.message || 'Failed to upload logo');
        }
      }
      if (bannerFile) {
        try {
          await uploadCompanyBanner(bannerFile);
          toast.success('Banner uploaded');
        } catch (e) {
          toast.error(e.message || 'Failed to upload banner');
        }
      }

      // Invalidate company profile query to force refetch
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      
      dispatch(resetFormData());
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to register company');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="company_name"
                control={control}
                rules={{ required: 'Company name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Name"
                    error={!!errors.company_name}
                    helperText={errors.company_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="industry"
                control={control}
                rules={{ required: 'Industry is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Industry"
                    error={!!errors.industry}
                    helperText={errors.industry?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Website"
                    placeholder="https://example.com"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label">
                Select Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setLogoFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      dispatch(setLogoPreview(url));
                    } else {
                      dispatch(setLogoPreview(null));
                    }
                  }}
                />
              </Button>
              {logoPreview && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">Logo Preview:</Typography>
                  <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '160px', borderRadius: 8 }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label">
                Select Banner
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setBannerFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      dispatch(setBannerPreview(url));
                    } else {
                      dispatch(setBannerPreview(null));
                    }
                  }}
                />
              </Button>
              {bannerPreview && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">Banner Preview:</Typography>
                  <img src={bannerPreview} alt="Banner Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </Box>
              )}
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="city"
                control={control}
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="state"
                control={control}
                rules={{ required: 'State is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="State"
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Country"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="postal_code"
                control={control}
                rules={{ required: 'Postal code is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Postal Code"
                    error={!!errors.postal_code}
                    helperText={errors.postal_code?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="founded_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Founded Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Description"
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Register Your Company
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit(handleNext)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || isLoading}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Submit'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default CompanyRegistrationPage;
