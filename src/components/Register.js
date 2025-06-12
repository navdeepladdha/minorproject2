import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Validation schema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required'),
  lastName: yup
    .string()
    .required('Last name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup
    .string()
    .oneOf(['admin', 'doctor', 'nurse', 'staff'], 'Invalid role')
    .required('Role is required'),
  specialization: yup
    .string()
    .when('role', {
      is: 'doctor',
      then: (schema) => schema.required('Specialization is required for doctors'),
      otherwise: (schema) => schema.optional()
    }),
  licenseNumber: yup
    .string()
    .when('role', {
      is: 'doctor',
      then: (schema) => schema.required('License number is required for doctors'),
      otherwise: (schema) => schema.optional()
    }),
  agreeTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions')
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
      specialization: '',
      licenseNumber: '',
      agreeTerms: false
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLocalError('');
      setIsSubmitting(true);
      
      try {
        // Log the exact data being sent for registration
        console.log('Register attempt with data:', values);
        
        const result = await register(values);
        console.log('Register response:', result);
        
        if (result.success) {
          setRegistrationSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          setLocalError(result.error || 'Registration failed for an unknown reason');
        }
      } catch (err) {
        console.error('Register error:', err);
        
        // Better error message handling
        let errorMessage = 'Registration failed. Please try again.';
        
        if (err.message && err.message.includes('firstName') && err.message.includes('lastName')) {
          errorMessage = 'First name and last name are required.';
        } else if (err.message && err.message.includes('duplicate key')) {
          errorMessage = 'A user with this email already exists.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setLocalError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid 
        item 
        xs={false} 
        sm={false} 
        md={6} 
        sx={{ 
          bgcolor: '#2484E4',
          color: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem'
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ 
            fontWeight: 700, 
            mb: 2
          }}
        >
          Healthcare Information at Your Fingertips
        </Typography>
        
        <Typography
          variant="h6"
          sx={{ mb: 6 }}
        >
          Securely access and manage patient records with our comprehensive EHR system
          designed for healthcare professionals.
        </Typography>
        
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            p: 3,
            borderRadius: 2,
            maxWidth: '90%'
          }}
        >
          <Typography
            variant="body1"
            component="p"
            sx={{ 
              fontStyle: 'italic',
              mb: 2
            }}
          >
            "This EHR system has streamlined our patient management process
            and improved our overall efficiency."
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#1565C0',
                width: 40,
                height: 40,
                mr: 2
              }}
            >
              DN
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dr. NAV
              </Typography>
              <Typography variant="body2">
                Chief Medical Officer
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      
      <Grid 
        item 
        xs={12} 
        sm={12} 
        md={6} 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'white',
          p: { xs: 2, sm: 4 }
        }}
      >
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 4
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: '#2484E4', 
                width: 56, 
                height: 56,
                mb: 2
              }}
            >
              <LocalHospitalIcon />
            </Avatar>
            
            <Typography component="h1" variant="h4" fontWeight="bold" textAlign="center">
              HealthTech EHR
            </Typography>
            
            <Typography variant="h6" textAlign="center" sx={{ my: 1 }}>
              Create an Account
            </Typography>
            
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Please enter your information to register
            </Typography>
          </Box>
          
          {registrationSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting to login...
            </Alert>
          ) : (
            <Box
              component="form"
              noValidate
              onSubmit={formik.handleSubmit}
              sx={{ mt: 2 }}
            >
              {localError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {localError}
                </Alert>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl 
                    fullWidth 
                    required 
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    disabled={isSubmitting}
                  >
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={formik.values.role}
                      label="Role"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="admin">Administrator</MenuItem>
                      <MenuItem value="doctor">Doctor</MenuItem>
                      <MenuItem value="nurse">Nurse</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                    </Select>
                    {formik.touched.role && formik.errors.role && (
                      <FormHelperText>{formik.errors.role}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                {formik.values.role === 'doctor' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="specialization"
                        label="Medical Specialization"
                        name="specialization"
                        value={formik.values.specialization}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                        helperText={formik.touched.specialization && formik.errors.specialization}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="licenseNumber"
                        label="License Number"
                        name="licenseNumber"
                        value={formik.values.licenseNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
                        helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
                        disabled={isSubmitting}
                      />
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeTerms"
                        checked={formik.values.agreeTerms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        color="primary"
                        disabled={isSubmitting}
                      />
                    }
                    label="I agree to the terms and conditions"
                  />
                  {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                    <FormHelperText error>{formik.errors.agreeTerms}</FormHelperText>
                  )}
                </Grid>
              </Grid>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5, 
                  bgcolor: '#2484E4',
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#1976d2'
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'REGISTER'
                )}
              </Button>
              
              <Grid container justifyContent="center">
                <Grid item>
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#2484E4', 
                      textDecoration: 'none', 
                      fontWeight: 500 
                    }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default Register;