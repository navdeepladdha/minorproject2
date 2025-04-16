import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Avatar,
  Button,
  TextField,
  Grid2,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
    .required('Role is required'),
  specialization: yup
    .string()
    .when('role', {
      is: 'doctor',
      then: yup.string().required('Specialization is required for doctors')
    }),
  licenseNumber: yup
    .string()
    .when('role', {
      is: 'doctor',
      then: yup.string().required('License number is required for doctors')
    }),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

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
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await register(values);
        if (result.success) {
          navigate('/login');
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again later.');
      }
    },
  });

  return (
    <Grid2 container component="main" sx={{ height: '100vh' }}>
      <Grid2
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random/?healthcare)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid2 item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create an Account
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={formik.handleSubmit}
              sx={{ mt: 3 }}
            >
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Grid2>
                <Grid2 item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid2>
                <Grid2 item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </Grid2>
                <Grid2 item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  />
                </Grid2>
                <Grid2 item xs={12}>
                  <FormControl fullWidth required error={formik.touched.role && Boolean(formik.errors.role)}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={formik.values.role}
                      label="Role"
                      onChange={formik.handleChange}
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
                </Grid2>
                
                {formik.values.role === 'doctor' && (
                  <>
                    <Grid2 item xs={12}>
                      <TextField
                        fullWidth
                        id="specialization"
                        label="Medical Specialization"
                        name="specialization"
                        value={formik.values.specialization}
                        onChange={formik.handleChange}
                        error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                        helperText={formik.touched.specialization && formik.errors.specialization}
                      />
                    </Grid2>
                    <Grid2 item xs={12}>
                      <TextField
                        fullWidth
                        id="licenseNumber"
                        label="License Number"
                        name="licenseNumber"
                        value={formik.values.licenseNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
                        helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
                      />
                    </Grid2>
                  </>
                )}
              </Grid2>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid2 container justifyContent="flex-end">
                <Grid2 item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid2>
              </Grid2>
            </Box>
          </Box>
        </Container>
      </Grid2>
    </Grid2>
  );
};

export default Register;