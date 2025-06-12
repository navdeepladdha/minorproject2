import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchDoctorDashboard, fetchPatientDetails, createPrescription, updateLeaveStatus } from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const prescriptionValidationSchema = yup.object({
  patientId: yup.string().required('Patient is required'),
  medication: yup.string().required('Medication is required'),
  dosage: yup.string().required('Dosage is required'),
  instructions: yup.string().required('Instructions are required'),
});

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({ patients: [], appointments: [], leaves: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching doctor data with token:', currentUser?.token);
        const result = await fetchDoctorDashboard(currentUser?.token);
        console.log('Doctor data received:', result);
        setData({
          patients: result.patients || [],
          appointments: result.appointments || [],
          leaves: result.leaves || [], // Include leaves
        });
      } catch (err) {
        setError('Failed to load doctor data');
        console.error('Doctor data error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      loadData();
    } else {
      setError('No authentication token available');
      setLoading(false);
    }
  }, [currentUser]);

  const handleViewPatient = async (patientId) => {
    try {
      console.log('Fetching patient details for ID:', patientId);
      const patient = await fetchPatientDetails(patientId, currentUser?.token);
      console.log('Patient details received:', patient);
      setSelectedPatient(patient);
      setModalOpen(true);
    } catch (err) {
      setError('Failed to load patient details');
      console.error('Patient details error:', err);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  const handlePrescriptionModalOpen = () => {
    setPrescriptionModalOpen(true);
  };

  const handlePrescriptionModalClose = () => {
    setPrescriptionModalOpen(false);
    prescriptionFormik.resetForm();
  };

  const handleLeaveStatusUpdate = async (leaveId, status) => {
    try {
      await updateLeaveStatus(leaveId, status, currentUser?.token);
      const result = await fetchDoctorDashboard(currentUser?.token);
      setData({
        patients: result.patients || [],
        appointments: result.appointments || [],
        leaves: result.leaves || [],
      });
    } catch (err) {
      setError(`Failed to update leave status: ${err.response?.data?.message || err.message}`);
      console.error('Leave status update error:', err);
    }
  };

  const prescriptionFormik = useFormik({
    initialValues: {
      patientId: '',
      medication: '',
      dosage: '',
      instructions: '',
    },
    validationSchema: prescriptionValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('Creating prescription:', values);
        await createPrescription(values, currentUser?.token);
        console.log('Prescription created successfully');
        setPrescriptionModalOpen(false);
        prescriptionFormik.resetForm();
        const result = await fetchDoctorDashboard(currentUser?.token);
        setData({
          patients: result.patients || [],
          appointments: result.appointments || [],
          leaves: result.leaves || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create prescription');
        console.error('Prescription error:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Doctor Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              My Patients
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Diagnosis</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.patients && data.patients.length > 0 ? (
                    data.patients.map((patient) => (
                      <TableRow key={patient._id} hover>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.diagnosis || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewPatient(patient._id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No patients available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Today's Appointments
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.appointments && data.appointments.length > 0 ? (
                    data.appointments.map((appointment) => (
                      <TableRow key={appointment._id} hover>
                        <TableCell>{appointment.patient}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No appointments scheduled
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Nurse Leave Applications
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nurse</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.leaves && data.leaves.length > 0 ? (
                    data.leaves.map((leave) => (
                      <TableRow key={leave._id} hover>
                        <TableCell>{leave.nurseName || 'N/A'}</TableCell>
                        <TableCell>{leave.startDate}</TableCell>
                        <TableCell>{leave.endDate}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>{leave.status}</TableCell>
                        <TableCell>
                          {leave.status === 'pending' && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleLeaveStatusUpdate(leave._id, 'approved')}
                                sx={{ mr: 1 }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleLeaveStatusUpdate(leave._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No leave applications available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ p: 1.5 }}
              disabled
            >
              View Medical Records
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="success"
              sx={{ p: 1.5 }}
              onClick={handlePrescriptionModalOpen}
            >
              Create Prescription
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              sx={{ p: 1.5 }}
              disabled
            >
              Order Lab Tests
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="warning"
              sx={{ p: 1.5 }}
              disabled
            >
              Schedule Follow-up
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Patient Details
          </Typography>
          {selectedPatient && (
            <Box>
              <TextField
                fullWidth
                label="Name"
                value={selectedPatient.name}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Age"
                value={selectedPatient.age}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Diagnosis"
                value={selectedPatient.diagnosis || 'N/A'}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Department"
                value={selectedPatient.department || 'N/A'}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Status"
                value={selectedPatient.status}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleModalClose}>
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      <Modal open={prescriptionModalOpen} onClose={handlePrescriptionModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Prescription
          </Typography>
          <Box component="form" onSubmit={prescriptionFormik.handleSubmit}>
            <FormControl
              fullWidth
              margin="normal"
              error={prescriptionFormik.touched.patientId && Boolean(prescriptionFormik.errors.patientId)}
            >
              <InputLabel id="patient-label">Patient</InputLabel>
              <Select
                labelId="patient-label"
                id="patientId"
                name="patientId"
                value={prescriptionFormik.values.patientId}
                label="Patient"
                onChange={prescriptionFormik.handleChange}
              >
                <MenuItem value="">Select Patient</MenuItem>
                {data.patients.map((patient) => (
                  <MenuItem key={patient._id} value={patient._id}>
                    {patient.name}
                  </MenuItem>
                ))}
              </Select>
              {prescriptionFormik.touched.patientId && prescriptionFormik.errors.patientId && (
                <FormHelperText>{prescriptionFormik.errors.patientId}</FormHelperText>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Medication"
              name="medication"
              value={prescriptionFormik.values.medication}
              onChange={prescriptionFormik.handleChange}
              error={prescriptionFormik.touched.medication && Boolean(prescriptionFormik.errors.medication)}
              helperText={prescriptionFormik.touched.medication && prescriptionFormik.errors.medication}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Dosage"
              name="dosage"
              value={prescriptionFormik.values.dosage}
              onChange={prescriptionFormik.handleChange}
              error={prescriptionFormik.touched.dosage && Boolean(prescriptionFormik.errors.dosage)}
              helperText={prescriptionFormik.touched.dosage && prescriptionFormik.errors.dosage}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Instructions"
              name="instructions"
              value={prescriptionFormik.values.instructions}
              onChange={prescriptionFormik.handleChange}
              error={prescriptionFormik.touched.instructions && Boolean(prescriptionFormik.errors.instructions)}
              helperText={prescriptionFormik.touched.instructions && prescriptionFormik.errors.instructions}
              margin="normal"
              multiline
              rows={3}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" type="submit" disabled={prescriptionFormik.isSubmitting}>
                Submit
              </Button>
              <Button variant="outlined" onClick={handlePrescriptionModalClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DoctorDashboard;