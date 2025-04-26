// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchDoctorData } from '../services/api';
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
  Alert
} from '@mui/material';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDoctorData();
        setData(result);
      } catch (err) {
        setError('Failed to load doctor data');
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Doctor Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Patient List */}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.patients.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Appointments */}
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
                  {data.appointments.map((appointment) => (
                    <TableRow key={appointment.id} hover>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

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
              View Medical Records
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button 
              variant="contained" 
              fullWidth
              color="success"
              sx={{ p: 1.5 }}
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
            >
              Schedule Follow-up
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DoctorDashboard;