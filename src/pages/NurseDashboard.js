import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchNurseData, updatePatientVitals } from '../services/api';
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
  TextField
} from '@mui/material';

const NurseDashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({ patientVitals: [], medications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    patientId: '',
    bp: '',
    temp: '',
    pulse: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching nurse data with token:', currentUser?.token);
        const result = await fetchNurseData(currentUser?.token);
        console.log('Nurse data received:', result);
        setData(result);
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

  const handleModalOpen = (patientId) => {
    setVitalsForm({ patientId, bp: '', temp: '', pulse: '' });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setVitalsForm({ patientId: '', bp: '', temp: '', pulse: '' });
  };

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating vitals:', vitalsForm);
      await updatePatientVitals(vitalsForm.patientId, vitalsForm, currentUser?.token);
      const result = await fetchNurseData(currentUser?.token);
      setData(result);
      handleModalClose();
    } catch (err) {
      setError('Failed to update vitals');
      console.error('Vitals update error:', err);
    }
  };

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
                        <TableCell>{vital.patient}</TableCell>
                        <TableCell>{vital.bp}</TableCell>
                        <TableCell>{vital.temp}</TableCell>
                        <TableCell>{vital.pulse}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleModalOpen(vital.patient)}
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
            borderRadius: 2
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
              <Button variant="outlined" onClick={handleModalClose}>
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