import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { toast } from '../utils/notify';
import DashboardLayout from '../components/DashboardLayout';
import { selectUser, updateUser } from '../store/slices/authSlice';
import { setCompanyProfile } from '../store/slices/companySlice';
import { getCompanyProfile, updateCompanyProfile } from '../api/company';
import authAPI from '../api/auth';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [name, setName] = useState(user?.full_name || '');
  const [savingUser, setSavingUser] = useState(false);
  const [phone, setPhone] = useState(user?.mobile_no || '');
  const [savingPhone, setSavingPhone] = useState(false);

  // Sync local state with Redux user state
  useEffect(() => {
    if (user?.full_name) setName(user.full_name);
    if (user?.mobile_no) setPhone(user.mobile_no);
  }, [user]);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdValues, setPwdValues] = useState({ current_password: '', new_password: '' });
  const [changingPwd, setChangingPwd] = useState(false);
  const [companyEditOpen, setCompanyEditOpen] = useState(false);
  const [companyValues, setCompanyValues] = useState({
    company_name: '',
    industry: '',
    city: '',
    state: '',
    website: '',
    description: '',
  });

  const { data: companyData } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: getCompanyProfile,
    retry: false,
  });

  const company = companyData?.data?.company || null;

  const handleSaveUser = async () => {
    if (!name || name.trim().length < 2) {
      return toast.error('Please enter a valid name');
    }
    setSavingUser(true);
    try {
      const resp = await authAPI.updateProfile({ full_name: name });
      if (resp?.success && resp?.data?.user) {
        dispatch(updateUser(resp.data.user));
        toast.success('Profile updated');
      } else {
        toast.error(resp?.message || 'Failed to update');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to update');
    } finally {
      setSavingUser(false);
    }
  };

  const handleSavePhone = async () => {
    if (!phone || phone.trim().length < 5) {
      return toast.error('Enter a valid phone with country code');
    }
    setSavingPhone(true);
    try {
      const resp = await authAPI.updatePhone(phone.trim());
      if (resp?.success && resp?.data?.user) {
        dispatch(updateUser(resp.data.user));
        toast.success('Phone updated');
      } else {
        toast.error(resp?.message || 'Failed to update phone');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to update phone');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleChangePassword = async () => {
    const { current_password, new_password } = pwdValues;
    if (!current_password || !new_password) {
      return toast.error('Fill both current and new password');
    }
    setChangingPwd(true);
    try {
      const resp = await authAPI.changePassword({ current_password, new_password });
      if (resp?.success) {
        toast.success('Password changed');
        setPwdValues({ current_password: '', new_password: '' });
        setPwdOpen(false);
      } else {
        toast.error(resp?.message || 'Failed to change password');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  const openCompanyEdit = () => {
    if (!company) return toast.error('No company profile found');
    setCompanyValues({
      company_name: company.company_name || '',
      industry: company.industry || '',
      city: company.city || '',
      state: company.state || '',
      website: company.website || '',
      description: company.description || '',
    });
    setCompanyEditOpen(true);
  };

  const saveCompanyEdit = async () => {
    try {
      const resp = await updateCompanyProfile({ ...companyValues });
      if (resp?.success && resp?.data?.company) {
        dispatch(setCompanyProfile(resp.data.company));
        toast.success('Company profile updated');
        setCompanyEditOpen(false);
      } else {
        toast.error(resp?.message || 'Failed to update');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to update');
    }
  };
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Account</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Button variant="contained" onClick={handleSaveUser} disabled={savingUser}>
                  {savingUser ? 'Saving...' : 'Save Name'}
                </Button>
                <TextField label="Mobile (+E.164)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button variant="outlined" onClick={handleSavePhone} disabled={savingPhone}>
                  {savingPhone ? 'Saving...' : 'Save Mobile'}
                </Button>
                <Divider sx={{ my: 1 }} />
                <Button variant="text" onClick={() => setPwdOpen(true)}>Change Password</Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Company</Typography>
              <Divider sx={{ mb: 2 }} />
              {company ? (
                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Typography variant="body2"><strong>Name:</strong> {company.company_name}</Typography>
                  <Typography variant="body2"><strong>Industry:</strong> {company.industry}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {company.city}, {company.state}</Typography>
                  <Button variant="contained" onClick={openCompanyEdit}>Edit Company</Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No company profile found.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={companyEditOpen} onClose={() => setCompanyEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Company Name" value={companyValues.company_name} onChange={(e) => setCompanyValues((v) => ({ ...v, company_name: e.target.value }))} />
            <TextField label="Industry" value={companyValues.industry} onChange={(e) => setCompanyValues((v) => ({ ...v, industry: e.target.value }))} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="City" value={companyValues.city} onChange={(e) => setCompanyValues((v) => ({ ...v, city: e.target.value }))} />
              <TextField label="State" value={companyValues.state} onChange={(e) => setCompanyValues((v) => ({ ...v, state: e.target.value }))} />
            </Box>
            <TextField label="Website" value={companyValues.website} onChange={(e) => setCompanyValues((v) => ({ ...v, website: e.target.value }))} />
            <TextField label="Description" value={companyValues.description} onChange={(e) => setCompanyValues((v) => ({ ...v, description: e.target.value }))} multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveCompanyEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField type="password" label="Current Password" value={pwdValues.current_password} onChange={(e) => setPwdValues((v) => ({ ...v, current_password: e.target.value }))} />
            <TextField type="password" label="New Password" value={pwdValues.new_password} onChange={(e) => setPwdValues((v) => ({ ...v, new_password: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword} disabled={changingPwd}>
            {changingPwd ? 'Saving...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default SettingsPage;
