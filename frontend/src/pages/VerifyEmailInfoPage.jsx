import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import InfoIcon from '@mui/icons-material/Info';

const VerifyEmailInfoPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const pendingVerification = localStorage.getItem('pendingVerification');
    if (pendingVerification) {
      setUserInfo(JSON.parse(pendingVerification));
    } else {
      // If no pending verification, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleProceedToPhone = () => {
    navigate('/verify-phone');
  };

  const handleSkipToLogin = () => {
    localStorage.removeItem('pendingVerification');
    navigate('/login');
  };

  // Resend email functionality removed

  if (!userInfo) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EmailIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Welcome, {userInfo.fullName}!
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Your account has been created successfully!
            </Typography>
            <Typography variant="body2">
              Email: <strong>{userInfo.email}</strong>
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Next Steps:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="1. Email Verification"
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block">
                      We&apos;ve sent a verification email to <strong>{userInfo.email}</strong>
                    </Typography>
                    <Typography variant="body2" component="span" display="block" sx={{ mt: 1 }}>
                      Click the link in the email to verify your account.
                    </Typography>
                  </>
                }
              />
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem>
              <ListItemIcon>
                <PhoneAndroidIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="2. Phone Verification"
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block">
                      Verify your mobile number: <strong>{userInfo.phone}</strong>
                    </Typography>
                    <Typography variant="body2" component="span" display="block" sx={{ mt: 1 }}>
                      You can do this now or later from your dashboard.
                    </Typography>
                  </>
                }
              />
            </ListItem>
          </List>

          <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 3, mb: 3 }}>
            <Typography variant="body2">
              <strong>Demo Mode:</strong> Email verification links are simulated. In production,
              configure an email provider to send real verification emails. For phone verification, any 6-digit code will work.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            

            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneAndroidIcon />}
              onClick={handleProceedToPhone}
              fullWidth
            >
              Verify Phone Number Now
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleSkipToLogin}
              fullWidth
            >
              Skip for Now - Go to Login
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              📧 <strong>Didn&apos;t receive the email?</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              • Check your spam/junk folder
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • Make sure the email address is correct
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              • You can request a new verification email after logging in
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailInfoPage;
