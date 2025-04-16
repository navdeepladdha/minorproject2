// src/components/patients/AddPatient.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Divider,
  IconButton,
  Chip,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import patientService from '../../services/patientService';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  insuranceProvider: Yup.string(),
  insuranceNumber: Yup.string(),
  bloodType: Yup.string(),
  allergies: Yup.array().of(Yup.string()),
  conditions: Yup.array().of(Yup.string()),
  emergencyContactName: Yup.string(),
  emergencyContactPhone: Yup.string(),
});

const AddPatient = () => {
  const navigate = useNavigate();
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    insuranceProvider: '',
    insuranceNumber: '',
    bloodType: '',
    allergies: [],
    conditions: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await patientService.createPatient(values);
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/patients')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Add New Patient
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, setFieldValue }) => (
            <Form>
              <Grid2 container spacing={3}>
                <Grid2 item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="dateOfBirth"
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={values.gender}
                      label="Gender"
                      onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {touched.gender && errors.gender && (
                      <FormHelperText>{errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Grid2>

                <Grid2 item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid2>

                <Grid2 item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleChange}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid2>

                <Grid2 item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Medical Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="insuranceProvider"
                    name="insuranceProvider"
                    label="Insurance Provider"
                    value={values.insuranceProvider}
                    onChange={handleChange}
                    error={touched.insuranceProvider && Boolean(errors.insuranceProvider)}
                    helperText={touched.insuranceProvider && errors.insuranceProvider}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="insuranceNumber"
                    name="insuranceNumber"
                    label="Insurance Number"
                    value={values.insuranceNumber}
                    onChange={handleChange}
                    error={touched.insuranceNumber && Boolean(errors.insuranceNumber)}
                    helperText={touched.insuranceNumber && errors.insuranceNumber}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="bloodType-label">Blood Type</InputLabel>
                    <Select
                      labelId="bloodType-label"
                      id="bloodType"
                      name="bloodType"
                      value={values.bloodType}
                      label="Blood Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>

                <Grid2 item xs={12}>
                  <FieldArray
                    name="allergies"
                    render={arrayHelpers => (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Allergies
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TextField
                            fullWidth
                            label="Add Allergy"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            sx={{ mr: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => {
                                      if (newAllergy.trim() !== '') {
                                        arrayHelpers.push(newAllergy.trim());
                                        setNewAllergy('');
                                      }
                                    }}
                                    edge="end"
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {values.allergies.map((allergy, index) => (
                            <Chip
                              key={index}
                              label={allergy}
                              onDelete={() => arrayHelpers.remove(index)}
                              color="error"
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  />
                </Grid2>

                <Grid2 item xs={12}>
                  <FieldArray
                    name="conditions"
                    render={arrayHelpers => (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Medical Conditions
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TextField
                            fullWidth
                            label="Add Medical Condition"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            sx={{ mr: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => {
                                      if (newCondition.trim() !== '') {
                                        arrayHelpers.push(newCondition.trim());
                                        setNewCondition('');
                                      }
                                    }}
                                    edge="end"
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {values.conditions.map((condition, index) => (
                            <Chip
                              key={index}
                              label={condition}
                              onDelete={() => arrayHelpers.remove(index)}
                              color="warning"
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  />
                </Grid2>

                <Grid2 item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Emergency Contact
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="emergencyContactName"
                    name="emergencyContactName"
                    label="Emergency Contact Name"
                    value={values.emergencyContactName}
                    onChange={handleChange}
                  />
                </Grid2>

                <Grid2 item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    label="Emergency Contact Phone"
                    value={values.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </Grid2>

                <Grid2 item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/patients')}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Patient'}
                    </Button>
                  </Box>
                </Grid2>
              </Grid2>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AddPatient;