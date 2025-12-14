import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import { toast } from '../utils/notify';
import { registerUser } from '../api/auth';
import { registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';
import { signIn as firebaseSignIn, sendEmailVerification, signOutUser, auth } from '../config/firebase';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    gender: '',
    mobile_no: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clean up any existing Firebase session on mount
  useEffect(() => {
    const cleanupAuth = async () => {
      if (auth.currentUser) {
        console.log('Signing out existing user on registration page load');
        await signOutUser();
      }
    };
    cleanupAuth();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      mobile_no: '+' + value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    dispatch(registerStart());

    try {
      // Step 0: Sign out and clean up any existing user (including anonymous)
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('Cleaning up existing auth session:', currentUser.uid, currentUser.isAnonymous ? '(anonymous)' : '');
        await signOutUser();
      }

      // Step 1: Register user in backend (backend creates Firebase user with phone number)
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registrationData } = formData;
      const response = await registerUser(registrationData);
      dispatch(registerSuccess());
      
      // Step 2: Sign in with Firebase to get the user object for email verification
      let firebaseUser;
      try {
        firebaseUser = await firebaseSignIn(formData.email, formData.password);
        console.log('Signed in to Firebase:', firebaseUser.uid);
      } catch (signInError) {
        console.error('Firebase sign-in failed:', signInError);
        toast('Registration successful but could not sign in to Firebase. Please try logging in.', {
          icon: '⚠️',
        });
      }

      // Step 3: Send email verification (optional, don't fail registration if this fails)
      if (firebaseUser) {
        try {
          await sendEmailVerification(firebaseUser);
          console.log('Email verification sent');
        } catch (emailError) {
          console.error('Email verification send failed:', emailError);
          // Check for rate limit error
          if (emailError.message.includes('too-many-requests')) {
            toast('Too many requests. Please wait a few minutes and verify your email from the verification page.', {
              icon: '⚠️',
            });
          } else {
            toast('Could not send verification email. You can verify later from your account.', {
              icon: '⚠️',
            });
          }
        }
      }
      
      
      // Store user info for verification pages
      if (response.data && response.data.user) {
        localStorage.setItem('pendingVerification', JSON.stringify({
          userId: response.data.user.user_id,
          email: response.data.user.email,
          phone: response.data.user.mobile_no,
          fullName: response.data.user.full_name,
          firebaseUid: response.data.user.firebase_uid,
        }));
      }
      
      // Show appropriate success message
      if (firebaseUser) {
        toast.success('Registration successful! Please check your email for verification.');
      } else {
        toast.success('Registration successful! Please proceed to verify your account.');
      }
      navigate('/verify-email');
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      dispatch(registerFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign up to get started with your company registration
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              name="full_name"
              autoComplete="name"
              autoFocus
              value={formData.full_name}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Box sx={{ mt: 2, mb: 1 }}>
              <PhoneInput
                country={'us'}
                value={formData.mobile_no}
                onChange={handlePhoneChange}
                inputStyle={{ width: '100%' }}
                disabled={isLoading}
              />
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="m">Male</MenuItem>
                <MenuItem value="f">Female</MenuItem>
                <MenuItem value="o">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              helperText="Min 8 characters, 1 uppercase, 1 number, 1 special character"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
        {/* reCAPTCHA container for phone verification */}
        <div id="recaptcha-container"></div>
      </Box>
    </Container>
  );
};

export default RegisterPage;
