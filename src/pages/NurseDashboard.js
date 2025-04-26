// src/pages/NurseDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchNurseData } from '../services/api';
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
  Alert
} from '@mui/material';

const NurseDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchNurseData();
        setData(result);
      } catch (err) {
        setError('Failed to load nurse data');
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
        Nurse Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Patient Vitals */}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.patientVitals.map((patient, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{patient.patient}</TableCell>
                      <TableCell>{patient.bp}</TableCell>
                      <TableCell>{patient.temp}</TableCell>
                      <TableCell>{patient.pulse}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Medications */}
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
                  {data.medications.map((med, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{med.patient}</TableCell>
                      <TableCell>{med.medication}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.schedule}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Care Tasks */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Care Tasks
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Alice Johnson</Typography>
                <Typography variant="body2">Check vitals at 2:00 PM</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pb: 2, pr: 2 }}>
                <Button variant="contained" color="success" size="small">Complete</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Bob Miller</Typography>
                <Typography variant="body2">Administer medication at 3:30 PM</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pb: 2, pr: 2 }}>
                <Button variant="contained" color="success" size="small">Complete</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Carol Davis</Typography>
                <Typography variant="body2">Assist with physical therapy at 4:00 PM</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pb: 2, pr: 2 }}>
                <Button variant="contained" color="success" size="small">Complete</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>All Patients</Typography>
                <Typography variant="body2">Evening medication rounds at 6:00 PM</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', pb: 2, pr: 2 }}>
                <Button variant="contained" color="success" size="small">Complete</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NurseDashboard;