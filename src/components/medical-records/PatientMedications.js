import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Grid2, Typography, Paper, CircularProgress, Chip, Box, FormControl, InputLabel, Select 
} from '@mui/material';
import { formatDate } from '../../utils/dateUtils';

const PatientMedications = ({ patientId }) => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    prescribedBy: '',
    instructions: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/patients/${patientId}/medications`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch medications');
        }
        
        const data = await response.json();
        setMedications(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patient medications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchMedications();
    }
  }, [patientId]);

  const handleOpenModal = (medication = null) => {
    if (medication) {
      setCurrentMedication(medication);
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        startDate: medication.startDate.substring(0, 10), // Format YYYY-MM-DD for input
        endDate: medication.endDate ? medication.endDate.substring(0, 10) : '',
        prescribedBy: medication.prescribedBy,
        instructions: medication.instructions,
        status: medication.status
      });
    } else {
      setCurrentMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().substring(0, 10),
        endDate: '',
        prescribedBy: '',
        instructions: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMedication(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = currentMedication
        ? `/api/medications/${currentMedication.id}`
        : `/api/patients/${patientId}/medications`;
        
      const method = currentMedication ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${currentMedication ? 'update' : 'add'} medication`);
      }
      
      const result = await response.json();
      
      if (currentMedication) {
        setMedications(prev => prev.map(med => 
          med.id === currentMedication.id ? result : med
        ));
      } else {
        setMedications(prev => [...prev, result]);
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error saving medication:', err);
      // Handle error - could set error state and display in modal
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete medication');
      }
      
      setMedications(prev => prev.filter(med => med.id !== id));
    } catch (err) {
      console.error('Error deleting medication:', err);
      // Handle error - could set error state and display in UI
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      'active': <Chip label="Active" color="success" size="small" />,
      'discontinued': <Chip label="Discontinued" color="error" size="small" />,
      'completed': <Chip label="Completed" color="default" size="small" />,
      'paused': <Chip label="Paused" color="warning" size="small" />
    };
    
    return statusMap[status] || <Chip label={status} color="primary" size="small" />;
  };

  if (loading && medications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && medications.length === 0) {
    return (
      <Paper sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error loading medications</Typography>
        <Typography>{error}</Typography>
      </Paper>
    );
  }

  return (
    <Card elevation={1}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Patient Medications</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Add Medication
          </Button>
        </Box>

        {medications.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography color="textSecondary">No medications found for this patient</Typography>
            <Button sx={{ mt: 2 }} variant="outlined" onClick={() => handleOpenModal()}>
              Add First Medication
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="medications table">
              <TableHead>
                <TableRow>
                  <TableCell>Medication</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medications.map((medication) => (
                  <TableRow key={medication.id} hover>
                    <TableCell>{medication.name}</TableCell>
                    <TableCell>{medication.dosage}</TableCell>
                    <TableCell>{medication.frequency}</TableCell>
                    <TableCell>{formatDate(medication.startDate)}</TableCell>
                    <TableCell>{medication.endDate ? formatDate(medication.endDate) : '-'}</TableCell>
                    <TableCell>{getStatusChip(medication.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleOpenModal(medication)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="error" 
                          onClick={() => handleDelete(medication.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentMedication ? 'Edit Medication' : 'Add New Medication'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid2>
              
              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid2>

              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  placeholder="e.g. Twice daily"
                  required
                  margin="normal"
                />
              </Grid2>
              
              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prescribed By"
                  name="prescribedBy"
                  value={formData.prescribedBy}
                  onChange={handleInputChange}
                  placeholder="Doctor's name"
                  margin="normal"
                />
              </Grid2>

              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid2>
              
              <Grid2 item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date (if applicable)"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid2>

              <Grid2 item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="discontinued">Discontinued</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="paused">Paused</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Special instructions for patient"
                  margin="normal"
                />
              </Grid2>
            </Grid2>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {currentMedication ? 'Update' : 'Add'} Medication
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PatientMedications;