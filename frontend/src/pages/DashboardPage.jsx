import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { toast } from '../utils/notify';
import { selectUser } from '../store/slices/authSlice';
import { setCompanyProfile } from '../store/slices/companySlice';
import { getCompanyProfile, updateCompanyProfile, uploadCompanyLogo, uploadCompanyBanner } from '../api/company';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [hasCompany, setHasCompany] = useState(false);

  // Fetch company profile
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: getCompanyProfile,
    retry: false,
  });

  useEffect(() => {
    if (data?.data?.company) {
      dispatch(setCompanyProfile(data.data.company));
      setHasCompany(true);
    } else if (data !== undefined) {
      // Data is loaded but no company found
      setHasCompany(false);
    } else if (error) {
      setHasCompany(false);
    }
  }, [data, error, dispatch]);

  const companyProfile = data?.data?.company;
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    company_name: '',
    industry: '',
    city: '',
    state: '',
    website: '',
    description: '',
  });
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    if (companyProfile) {
      setEditValues({
        company_name: companyProfile.company_name || '',
        industry: companyProfile.industry || '',
        city: companyProfile.city || '',
        state: companyProfile.state || '',
        website: companyProfile.website || '',
        description: companyProfile.description || '',
      });
    }
  }, [companyProfile]);

  const handleEditSave = async () => {
    try {
      const updates = { ...editValues };
      const resp = await updateCompanyProfile(updates);
      if (resp.data?.success && resp.data?.data?.company) {
        dispatch(setCompanyProfile(resp.data.data.company));
        toast.success('Company profile updated');
        setEditOpen(false);
      } else {
        toast.error(resp.data?.message || 'Failed to update');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to update');
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return toast.error('Select a logo file first');
    setUploading(true);
    try {
      const resp = await uploadCompanyLogo(logoFile);
      if (resp.data?.success && resp.data?.data?.company) {
        dispatch(setCompanyProfile(resp.data.data.company));
        toast.success('Logo uploaded');
        setLogoFile(null);
      } else {
        toast.error(resp.data?.message || 'Failed to upload logo');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) return toast.error('Select a banner file first');
    setUploading(true);
    try {
      const resp = await uploadCompanyBanner(bannerFile);
      if (resp.data?.success && resp.data?.data?.company) {
        dispatch(setCompanyProfile(resp.data.data.company));
        toast.success('Banner uploaded');
        setBannerFile(null);
      } else {
        toast.error(resp.data?.message || 'Failed to upload banner');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  // Show loading state immediately
  if (isLoading) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* User Info Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h6">User Profile</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  <strong>Name:</strong> {user?.full_name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Mobile:</strong> {user?.mobile_no}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Email Verified: {user?.is_email_verified ? '✓ Yes' : '✗ No'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mobile Verified: {user?.is_mobile_verified ? '✓ Yes' : '✗ No'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Company Info Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h6">Company Profile</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : hasCompany && companyProfile ? (
                  <>
                    <Typography variant="body1">
                      <strong>Company:</strong> {companyProfile.company_name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Industry:</strong> {companyProfile.industry}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {companyProfile.city}, {companyProfile.state}
                    </Typography>
                    {companyProfile.logo_url && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2"><strong>Logo:</strong></Typography>
                        <img src={companyProfile.logo_url} alt="Company Logo" style={{ maxWidth: '180px', borderRadius: 8 }} />
                      </Box>
                    )}
                    {companyProfile.banner_url && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2"><strong>Banner:</strong></Typography>
                        <img src={companyProfile.banner_url} alt="Company Banner" style={{ maxWidth: '100%', borderRadius: 8 }} />
                      </Box>
                    )}
                    {companyProfile.website && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Website:</strong>{' '}
                        <a href={companyProfile.website} target="_blank" rel="noopener noreferrer">
                          {companyProfile.website}
                        </a>
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button variant="contained" onClick={() => setEditOpen(true)}>Edit Profile</Button>
                      <Button variant="outlined" component="label" disabled={uploading}>
                        Select Logo
                        <input type="file" hidden accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                      </Button>
                      <Button variant="contained" onClick={handleUploadLogo} disabled={uploading || !logoFile}>
                        {uploading ? <CircularProgress size={20} /> : 'Upload Logo'}
                      </Button>
                      <Button variant="outlined" component="label" disabled={uploading}>
                        Select Banner
                        <input type="file" hidden accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                      </Button>
                      <Button variant="contained" onClick={handleUploadBanner} disabled={uploading || !bannerFile}>
                        {uploading ? <CircularProgress size={20} /> : 'Upload Banner'}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      You haven&apos;t registered a company yet.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/company/register')}
                    >
                      Register Company
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {!hasCompany && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/company/register')}
                  >
                    Register Company
                  </Button>
                )}
                <Button variant="outlined" onClick={() => navigate('/settings')}>
                  Account Settings
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Company Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Company Profile</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label="Company Name"
              value={editValues.company_name}
              onChange={(e) => setEditValues((v) => ({ ...v, company_name: e.target.value }))}
            />
            <TextField
              label="Industry"
              value={editValues.industry}
              onChange={(e) => setEditValues((v) => ({ ...v, industry: e.target.value }))}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="City"
                value={editValues.city}
                onChange={(e) => setEditValues((v) => ({ ...v, city: e.target.value }))}
              />
              <TextField
                label="State"
                value={editValues.state}
                onChange={(e) => setEditValues((v) => ({ ...v, state: e.target.value }))}
              />
            </Box>
            <TextField
              label="Website"
              value={editValues.website}
              onChange={(e) => setEditValues((v) => ({ ...v, website: e.target.value }))}
            />
            <TextField
              label="Description"
              value={editValues.description}
              onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
              multiline rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardPage;
