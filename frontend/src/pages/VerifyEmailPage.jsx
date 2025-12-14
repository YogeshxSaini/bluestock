import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EmailIcon from '@mui/icons-material/Email';
import authAPI from '../api/auth';
import { auth, onAuthStateChange, sendEmailVerification } from '../config/firebase';
import toast from '../utils/notify';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [verificationState, setVerificationState] = useState('loading'); // loading, success, error, manual
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const hasVerifiedRef = useRef(false); // Track if we've already processed verification

  // Get user info from pending verification
  const pendingVerification = localStorage.getItem('pendingVerification');
  const userInfo = user || (pendingVerification ? JSON.parse(pendingVerification) : null);

  useEffect(() => {
    const userId = searchParams.get('userId');

    // If no userId in URL, show manual verification interface
    if (!userId) {
      setVerificationState('manual');
      
      // Listen for Firebase auth state changes
      const unsubscribe = onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser && !hasVerifiedRef.current) {
          await firebaseUser.reload();
          if (firebaseUser.emailVerified) {
            hasVerifiedRef.current = true; // Mark as verified to prevent duplicate processing
            setVerificationState('success');
            
            // Update backend
            try {
              if (userInfo?.userId) {
                await authAPI.verifyEmail(userInfo.userId);
              }
            } catch (error) {
              console.error('Failed to update backend verification:', error);
            }
            
            toast.success('Email verified successfully!');
            
            // Auto-navigate after a delay
            setTimeout(() => {
              navigate('/verify-phone');
            }, 1500);
          }
        }
      });

      return () => unsubscribe();
    }

    // URL-based verification
    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(userId);
        if (response.data.success) {
          setVerificationState('success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
        } else {
          setVerificationState('error');
          setErrorMessage(response.data.message || 'Verification failed');
        }
      } catch (error) {
        setVerificationState('error');
        setErrorMessage(
          error.response?.data?.message ||
          'Failed to verify email. The link may be invalid or expired.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate, userInfo?.userId]);

  const handleCheckVerification = async () => {
    if (hasVerifiedRef.current) {
      // Already verified, just navigate
      navigate('/verify-phone');
      return;
    }

    setCheckingStatus(true);
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        toast.error('No user session found. Please try logging in again.');
        setCheckingStatus(false);
        return;
      }

      await firebaseUser.reload();
      
      if (firebaseUser.emailVerified) {
        hasVerifiedRef.current = true; // Mark as verified
        setVerificationState('success');
        toast.success('Email verified successfully!');
        
        // Update backend
        try {
          if (userInfo?.userId) {
            await authAPI.verifyEmail(userInfo.userId);
          }
        } catch (backendError) {
          console.error('Backend verification update failed:', backendError);
          // Don't block the flow if backend update fails
        }
        
        // Automatically navigate to phone verification after a brief delay
        setTimeout(() => {
          navigate('/verify-phone');
        }, 1500);
      } else {
        toast.info('Email not verified yet. Please check your inbox and click the verification link.');
        setCheckingStatus(false);
      }
    } catch (error) {
      console.error('Verification check error:', error);
      toast.error('Failed to check verification status. Please try again.');
      setCheckingStatus(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser && !firebaseUser.emailVerified) {
        await sendEmailVerification(firebaseUser);
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/verify-phone');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          {verificationState === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Verifying Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait while we verify your email address...
              </Typography>
            </>
          )}

          {verificationState === 'manual' && (
            <>
              <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Verify Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                We sent a verification link to your email address.
              </Typography>
              {userInfo?.email && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 'bold' }}>
                  {userInfo.email}
                </Typography>
              )}

              <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                Please check your inbox and click the verification link. After verifying, click the
                &quot;I&apos;ve Verified&quot; button below.
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckVerification}
                  disabled={checkingStatus}
                  startIcon={checkingStatus ? <CircularProgress size={20} /> : null}
                >
                  {checkingStatus ? 'Checking...' : "I've Verified My Email"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                >
                  {resendLoading ? <CircularProgress size={24} /> : 'Resend Verification Email'}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={handleContinue}
                  sx={{ mt: 2 }}
                >
                  Continue to Phone Verification
                </Button>
              </Box>
            </>
          )}

          {verificationState === 'success' && (
            <>
              <CheckCircleOutlineIcon
                sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom color="success.main">
                Email Verified Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchParams.get('userId') 
                  ? 'Your email has been verified. You will be redirected to the login page shortly.'
                  : 'Your email has been verified! You can now proceed to verify your phone number.'}
              </Typography>
              {searchParams.get('userId') ? (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Redirecting to login in 3 seconds...
                  </Alert>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login', { replace: true })}
                  >
                    Go to Login Now
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleContinue}
                >
                  Continue to Phone Verification
                </Button>
              )}
            </>
          )}

          {verificationState === 'error' && (
            <>
              <ErrorOutlineIcon
                sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom color="error">
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The verification link may be invalid, expired, or already used.
                Please try logging in or request a new verification email.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login', { replace: true })}
                >
                  Go to Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register', { replace: true })}
                >
                  Register Again
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;
