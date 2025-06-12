import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchNurseDashboard, updateVitals, submitLeaveApplication } from '../services/api';
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
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Modal,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Validation schema for leave application
const leaveValidationSchema = yup.object({
  startDate: yup.date().required('Start date is required'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  reason: yup.string().required('Reason is required').min(5, 'Reason must be at least 5 characters'),
});

const NurseDashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({ patientVitals: [], medications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    patient: '',
    bp: '',
    temp: '',
    pulse: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching nurse data with token:', currentUser?.token);
        const result = await fetchNurseDashboard(currentUser?.token);
        console.log('Nurse data received:', result);
        const vitals = Array.isArray(result?.vitals) ? result.vitals : [];
        const tasks = Array.isArray(result?.tasks) ? result.tasks : [];
        setData({
          patientVitals: vitals.map((vital) => ({
            ...vital,
            patient: vital.patient,
            bp: vital.bp,
            temp: vital.temp,
            pulse: vital.pulse,
          })),
          medications: tasks.map((task) => ({
            patient: task.patientId,
            medication: task.name,
            dosage: 'N/A',
            schedule: task.dueDate,
          })),
        });
      } catch (err) {
        setError('Failed to load nurse data');
        console.error('Nurse data error:', err);
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

  // Vitals Modal Handlers
  const handleVitalsModalOpen = (patient) => {
    setVitalsForm({ patient, bp: '', temp: '', pulse: '' });
    setVitalsModalOpen(true);
  };

  const handleVitalsModalClose = () => {
    setVitalsModalOpen(false);
    setVitalsForm({ patient: '', bp: '', temp: '', pulse: '' });
  };

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating vitals:', vitalsForm);
      const { patient, bp, temp, pulse } = vitalsForm;
      await updateVitals(patient, { bp, temp, pulse }, currentUser?.token);
      const result = await fetchNurseDashboard(currentUser?.token);
      const vitals = Array.isArray(result?.vitals) ? result.vitals : [];
      const tasks = Array.isArray(result?.tasks) ? result.tasks : [];
      setData({
        patientVitals: vitals.map((vital) => ({
          ...vital,
          patient: vital.patient,
          bp: vital.bp,
          temp: vital.temp,
          pulse: vital.pulse,
        })),
        medications: tasks.map((task) => ({
          patient: task.patientId,
          medication: task.name,
          dosage: 'N/A',
          schedule: task.dueDate,
        })),
      });
      handleVitalsModalClose();
    } catch (err) {
      setError('Failed to update vitals');
      console.error('Vitals update error:', err);
    }
  };

  // Leave Modal Handlers
  const handleLeaveModalOpen = () => {
    setLeaveModalOpen(true);
  };

  const handleLeaveModalClose = () => {
    setLeaveModalOpen(false);
    leaveFormik.resetForm();
  };

  // Formik for leave application
  const leaveFormik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      reason: '',
    },
    validationSchema: leaveValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log('Submitting leave application:', values);
        await submitLeaveApplication(values, currentUser?.token);
        leaveFormik.setStatus({ success: 'Leave application submitted successfully!' });
        setTimeout(() => {
          handleLeaveModalClose();
        }, 1500);
      } catch (err) {
        leaveFormik.setStatus({ error: err.response?.data?.message || 'Failed to submit leave application.' });
        console.error('Leave application error:', err);
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
        Nurse Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Patient Vitals
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Blood Pressure</TableCell>
                    <TableCell>Temperature</TableCell>
                    <TableCell>Pulse</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.patientVitals && data.patientVitals.length > 0 ? (
                    data.patientVitals.map((vital) => (
                      <TableRow key={vital._id} hover>
                        <TableCell>{vital.patient || 'N/A'}</TableCell>
                        <TableCell>{vital.bp || 'N/A'}</TableCell>
                        <TableCell>{vital.temp || 'N/A'}</TableCell>
                        <TableCell>{vital.pulse || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleVitalsModalOpen(vital.patient)}
                          >
                            Update Vitals
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No vitals data available
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
              Medication Schedule
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Schedule</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.medications && data.medications.length > 0 ? (
                    data.medications.map((med, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{med.patient}</TableCell>
                        <TableCell>{med.medication}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.schedule}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No medication schedule available
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
          Care Tasks
        </Typography>
        <Grid container spacing={2}>
          {data.medications && data.medications.length > 0 ? (
            data.medications.map((med, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {med.patient}
                    </Typography>
                    <Typography variant="body2">
                      Administer {med.medication} at {med.schedule}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', pb: 2, pr: 2 }}>
                    <Button variant="contained" color="success" size="small" disabled>
                      Complete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography align="center" color="text.secondary" sx={{ width: '100%' }}>
              No care tasks available
            </Typography>
          )}
        </Grid>
      </Paper>

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
              onClick={handleLeaveModalOpen}
            >
              Request Leave
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Modal open={vitalsModalOpen} onClose={handleVitalsModalClose}>
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
            Update Patient Vitals
          </Typography>
          <Box component="form" onSubmit={handleVitalsSubmit}>
            <TextField
              fullWidth
              label="Blood Pressure"
              name="bp"
              value={vitalsForm.bp}
              onChange={handleVitalsChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Temperature"
              name="temp"
              value={vitalsForm.temp}
              onChange={handleVitalsChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Pulse"
              name="pulse"
              value={vitalsForm.pulse}
              onChange={handleVitalsChange}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
              <Button variant="outlined" onClick={handleVitalsModalClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={leaveModalOpen} onClose={handleLeaveModalClose}>
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
            Request Leave
          </Typography>
          {leaveFormik.status?.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {leaveFormik.status.error}
            </Alert>
          )}
          {leaveFormik.status?.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {leaveFormik.status.success}
            </Alert>
          )}
          <Box component="form" onSubmit={leaveFormik.handleSubmit}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={leaveFormik.values.startDate}
              onChange={leaveFormik.handleChange}
              error={leaveFormik.touched.startDate && Boolean(leaveFormik.errors.startDate)}
              helperText={leaveFormik.touched.startDate && leaveFormik.errors.startDate}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={leaveFormik.values.endDate}
              onChange={leaveFormik.handleChange}
              error={leaveFormik.touched.endDate && Boolean(leaveFormik.errors.endDate)}
              helperText={leaveFormik.touched.endDate && leaveFormik.errors.endDate}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={leaveFormik.values.reason}
              onChange={leaveFormik.handleChange}
              error={leaveFormik.touched.reason && Boolean(leaveFormik.errors.reason)}
              helperText={leaveFormik.touched.reason && leaveFormik.errors.reason}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={leaveFormik.isSubmitting || leaveFormik.status?.success}
              >
                {leaveFormik.isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleLeaveModalClose}
                disabled={leaveFormik.isSubmitting}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default NurseDashboard;