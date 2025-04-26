// src/pages/StaffDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchStaffData } from '../services/api';
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
  Alert
} from '@mui/material';

const StaffDashboard = () => {
  // Initialize with empty arrays to prevent mapping errors
  const [data, setData] = useState({
    tasks: [],
    registrations: [],
    schedule: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchStaffData();
        setData(result);
      } catch (err) {
        setError('Failed to load staff data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  // Helper function to determine priority chip color
  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'error';
    if (priority === 'Medium') return 'warning';
    return 'success';
  };

  // Helper function to determine status chip color
  const getStatusColor = (status) => {
    if (status === 'Completed') return 'success';
    if (status === 'In Progress' || status === 'Pending') return 'info';
    if (status === 'Urgent') return 'error';
    return 'default';
  };

  // Helper function to determine visit type chip color
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
    </Box>
  );
};

export default StaffDashboard;