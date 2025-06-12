import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password || !role) {
      setLocalError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password, role });
      const response = await login({ email, password, role });
      console.log('Login response:', response);
      if (response.success) {
        const targetPath = `/${response.user.role}-dashboard`;
        console.log('Navigating to:', targetPath);
        setTimeout(() => {
          navigate(targetPath);
          console.log('Navigation executed');
        }, 200);
      } else {
        setLocalError('Login was not successful');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setLocalError(errorMessage);
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChatBotClick = () => {
    window.open('http://localhost:8501', '_blank');
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left Side Branding Section */}
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          background: 'linear-gradient(135deg, #e3f2fd 30%, #bbdefb 90%)',
          display: { xs: 'none', sm: 'flex' }, // Hide on extra small screens
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          textAlign: 'center',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <LocalHospitalIcon sx={{ fontSize: 100, color: '#1976d2', mb: 3, animation: 'pulse 2s infinite' }} />
        <Typography variant="h3" fontWeight="bold" sx={{ color: '#0d47a1', mb: 1 }}>
          Dr. Nav
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, color: '#1565c0' }}>
          Your Trusted EHR Assistant
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: '#1e88e5', maxWidth: '80%' }}>
          Empowering doctors, nurses, and staff with seamless access to health records for better patient care.
        </Typography>
      </Grid>

      {/* Right Side Login Form */}
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Fade in timeout={500}>
          <Box
            sx={{
              my: { xs: 4, sm: 8 },
              mx: { xs: 2, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
              HealthTech EHR
            </Typography>
            <Typography component="h2" variant="h6" sx={{ mt: 1, color: '#1565c0' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Please enter your credentials to access the system
            </Typography>

            {(error || localError) && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error || localError}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!localError && !email}
                helperText={!!localError && !email ? 'Email is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#1976d2' },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!localError && !password}
                helperText={!!localError && !password ? 'Password is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#1976d2' },
                  },
                }}
              />
              <FormControl fullWidth margin="normal" error={!!localError && !role}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                  required
                  sx={{
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                  }}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
                {!!localError && !role && (
                  <Typography variant="caption" color="error">
                    Role is required
                  </Typography>
                )}
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember Me"
                sx={{ mt: 1, mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                  transition: 'background-color 0.3s ease',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

              {/* ChatBot Button */}
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.5,
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  '&:hover': { borderColor: '#388e3c', color: '#388e3c', bgcolor: '#f1f8e9' },
                  transition: 'all 0.3s ease',
                }}
                onClick={handleChatBotClick}
              >
                Want an early diagnosis? Use our ChatBot
              </Button>

              <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                <Grid item>
                  <Link to="/forgot-password" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    <Typography variant="body2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                      Forgot password?
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                      <Typography component="span" variant="body2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                        Sign up
                      </Typography>
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Grid>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Grid>
  );
};

export default Login;