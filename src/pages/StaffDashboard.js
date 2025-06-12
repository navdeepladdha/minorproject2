import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchStaffDashboard } from '../services/api';
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
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import axios from 'axios';

const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({
    tasks: [],
    registrations: [],
    schedule: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient', // Default role for patients
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false); // Added for loading state

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching staff data with token:', currentUser?.token);
        const result = await fetchStaffDashboard(currentUser?.token);
        setData({
          tasks: result.registrations.map((reg, index) => ({
            id: index + 1,
            name: `Process registration for ${reg.patientName}`,
            priority: reg.status === 'Urgent' ? 'High' : 'Medium',
            dueDate: reg.date,
            status: reg.status,
          })),
          registrations: result.registrations,
          schedule: result.appointments.map((appt, index) => ({
            id: index + 1,
            time: appt.time,
            patient: appt.patient,
            doctor: appt.doctorId || 'Unassigned',
            room: appt.room || 'N/A',
            visitType: appt.visitType || 'Follow-up',
          })),
        });
      } catch (err) {
        setError('Failed to load staff data');
        console.error('Staff data error:', err);
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

  // Handle dialog open/close
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormError(null);
    setFormSuccess(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'patient', // Reset to default role
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormError(null);
    setFormSuccess(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleRegisterPatient = async () => {
    setFormError(null);
    setFormSuccess(null);
    setSubmitting(true);

    // Client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      setFormError('All fields are required.');
      setSubmitting(false);
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFormSuccess('Patient registered successfully!');
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
      // Refresh dashboard data
      const result = await fetchStaffDashboard(currentUser?.token);
      setData({
        tasks: result.registrations.map((reg, index) => ({
          id: index + 1,
          name: `Process registration for ${reg.patientName}`,
          priority: reg.status === 'Urgent' ? 'High' : 'Medium',
          dueDate: reg.date,
          status: reg.status,
        })),
        registrations: result.registrations,
        schedule: result.appointments.map((appt, index) => ({
          id: index + 1,
          time: appt.time,
          patient: appt.patient,
          doctor: appt.doctorId || 'Unassigned',
          room: appt.room || 'N/A',
          visitType: appt.visitType || 'Follow-up',
        })),
      });
    } catch (err) {
      console.error('Patient registration error:', err);
      const errorMessage =
        err.response?.data?.message?.includes('duplicate key error')
          ? 'This email is already registered.'
          : err.response?.data?.message?.includes('validation failed')
          ? 'Invalid input data. Please check all fields.'
          : 'Failed to register patient. Please try again.';
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Helper functions for chip colors
  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'error';
    if (priority === 'Medium') return 'warning';
    return 'success';
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress' || status === 'Pending') return 'info';
    if (status === 'Urgent') return 'error';
    return 'default';
  };

  const getVisitTypeColor = (type) => {
    if (type === 'New Patient') return 'primary';
    if (type === 'Follow-up') return 'success';
    if (type === 'Urgent') return 'error';
    return 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Staff Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              My Tasks
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.tasks && data.tasks.length > 0 ? (
                    data.tasks.map((task) => (
                      <TableRow key={task.id} hover>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.priority}
                            color={getPriorityColor(task.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            color={getStatusColor(task.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No tasks available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Patient Registration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Recent Registrations
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.registrations && data.registrations.length > 0 ? (
                    data.registrations.map((reg) => (
                      <TableRow key={reg.id} hover>
                        <TableCell>{reg.patientName}</TableCell>
                        <TableCell>{reg.date}</TableCell>
                        <TableCell>{reg.department}</TableCell>
                        <TableCell>
                          <Chip
                            label={reg.status}
                            color={getStatusColor(reg.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No recent registrations
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Today's Schedule */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Today's Schedule
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Visit Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.schedule && data.schedule.length > 0 ? (
                data.schedule.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.patient}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>{appointment.room}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.visitType}
                        color={getVisitTypeColor(appointment.visitType)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No appointments scheduled for today
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Quick Actions */}
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
              onClick={handleOpenDialog}
            >
              Register Patient
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="success"
              sx={{ p: 1.5 }}
            >
              Update Records
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              sx={{ p: 1.5 }}
            >
              Manage Appointments
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="warning"
              sx={{ p: 1.5 }}
            >
              Check Insurance
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Registration Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Patient</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          {formSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {formSuccess}
            </Alert>
          )}
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ 'aria-label': 'First Name' }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ 'aria-label': 'Last Name' }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ 'aria-label': 'Email' }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ 'aria-label': 'Password' }}
          />
          {/* Role is hardcoded as 'patient' and not shown in the UI */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleRegisterPatient}
            variant="contained"
            color="primary"
            disabled={submitting || formSuccess}
          >
            {submitting ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffDashboard;