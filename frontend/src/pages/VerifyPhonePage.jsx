import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import authAPI from '../api/auth';
import toast from '../utils/notify';
import { sendPhoneOTP, verifyPhoneOTP } from '../config/firebase';
 

const VerifyPhonePage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const useFallback = true; // Use backend OTP by default (constant)
  const [mockOTP, setMockOTP] = useState(null); // Store mock OTP for display
  
  // Get user info from Redux or pending verification
  const pendingVerification = localStorage.getItem('pendingVerification');
  const userInfo = user || (pendingVerification ? JSON.parse(pendingVerification) : null);

  // Auto-send OTP when component mounts
  useEffect(() => {
    if (userInfo && !otpSent) {
      handleSendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInfo?.user_id && !userInfo?.userId) {
      setError('User not found. Please log in again.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = userInfo.user_id || userInfo.userId;
      
      if (useFallback || !confirmationResult) {
        // Verify using backend API
        // Note: apiClient interceptor returns response.data directly
        const response = await authAPI.verifyMobileOTP(userId, otp);
        
        console.log('Backend verification response:', response);
        
        if (response && response.success) {
          toast.success('Phone number verified successfully!');
          
          // Clear pending verification
          localStorage.removeItem('pendingVerification');
          
          // If user came from registration, redirect to login
          // If user is logged in, go to dashboard
          setTimeout(() => {
            if (user) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/login', { replace: true });
            }
          }, 1500);
        } else {
          const errorMessage = response?.message || 'OTP verification failed';
          setError(errorMessage);
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
      } else {
        // Verify using Firebase
        const firebaseUser = await verifyPhoneOTP(confirmationResult, otp);
        console.log('Phone verified with Firebase:', firebaseUser.uid);
        
        // Also verify in backend
        const response = await authAPI.verifyMobileOTP(userId, otp);
        
        if (response && response.success) {
          toast.success('Phone number verified successfully!');
          localStorage.removeItem('pendingVerification');
          
          setTimeout(() => {
            if (user) {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/login', { replace: true });
            }
          }, 1500);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to verify OTP. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const userId = userInfo.user_id || userInfo.userId;
      
      if (useFallback) {
        // Use backend API to send OTP
        const response = await authAPI.sendOTP(userId);
        if (response.data.success) {
          setOtpSent(true);
          toast.success('OTP sent to your mobile number!');
          
          // In development, show and store the mock OTP
          if (response.data.mockOTP) {
            setMockOTP(response.data.mockOTP);
            toast.info(`Development OTP: ${response.data.mockOTP}`, { duration: 10000 });
          }
        }
      } else {
        // Use Firebase Phone Authentication
        const phoneNumber = userInfo.phone || userInfo.mobile_no;
        if (!phoneNumber) {
          throw new Error('Phone number not found');
        }
        
        const result = await sendPhoneOTP(phoneNumber);
        setConfirmationResult(result);
        setOtpSent(true);
        toast.success('OTP sent via Firebase!');
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to send OTP. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await handleSendOTP();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PhoneAndroidIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Verify Phone Number
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter the 6-digit OTP sent to your mobile number
            </Typography>
            {userInfo?.phone && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userInfo.phone}
              </Typography>
            )}
            {userInfo?.mobile_no && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userInfo.mobile_no}
              </Typography>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {mockOTP && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <strong>Development OTP:</strong> {mockOTP}
              <br />
              <Typography variant="caption">
                Use this code for testing. Check backend terminal for OTP logs.
              </Typography>
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Demo Mode:</strong> The OTP will be displayed above after it&apos;s sent.
            In production, real SMS will be sent to your mobile number.
          </Alert>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
              }}
              sx={{ mb: 3 }}
              disabled={loading}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || otp.length !== 6}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Didn&apos;t receive the code?
              </Typography>
              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </Button>
              
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard', { replace: true })}
                disabled={loading}
              >
                Skip for Now
              </Button>
            </Box>
          </form>
        </Paper>
        {/* reCAPTCHA container for Firebase phone verification */}
        <div id="recaptcha-container"></div>
      </Box>
    </Container>
  );
};

export default VerifyPhonePage;
