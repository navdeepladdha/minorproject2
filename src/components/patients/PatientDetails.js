// src/components/patients/PatientDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2,
  Button,
  Tabs,
  Tab,
  Divider,
  Paper,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  MedicalServices as MedicalIcon,
  Medication as MedicationIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import patientService from '../../services/patientService';
import medicalRecordService from '../../services/medicalRecordService';
import appointmentService from '../../services/appointmentService';
import MedicalRecordsList from '../medical-records/MedicalRecordsList';
import PatientAppointments from '../appointments/PatientAppointments';
import PatientMedications from '../medical-records/PatientMedications';
import PatientVitals from '../medical-records/PatientVitals';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientData = await patientService.getPatientById(id);
        setPatient(patientData);
        
        const recordsData = await medicalRecordService.getPatientRecords(id);
        setMedicalRecords(recordsData);
        
        const appointmentsData = await appointmentService.getAllAppointments({ patientId: id });
        setAppointments(appointmentsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditPatient = () => {
    navigate(`/patients/edit/${id}`);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeletePatient = async () => {
    try {
      await patientService.deletePatient(id);
      handleDeleteDialogClose();
      navigate('/patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleAddMedicalRecord = () => {
    navigate(`/medical-records/add?patientId=${id}`);
  };

  const handleAddAppointment = () => {
    navigate(`/appointments/add?patientId=${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Patient not found</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/patients')}
            sx={{ mt: 2 }}
          >
            Back to Patients
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patients')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Patient Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEditPatient}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteDialogOpen}
        >
          Delete
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {patient.firstName} {patient.lastName}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Patient ID: {patient.patientId || patient._id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date of Birth: {new Date(patient.dateOfBirth).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Gender: {patient.gender}
              </Typography>
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                Phone: {patient.phone}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: {patient.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {patient.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Insurance: {patient.insuranceProvider || 'Not provided'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Blood Type: {patient.bloodType || 'Not recorded'}
              </Typography>
            </Grid2>
          </Grid2>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Medical Alert:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {patient.allergies && patient.allergies.map((allergy, index) => (
                <Chip key={index} label={allergy} color="error" size="small" />
              ))}
              {patient.conditions && patient.conditions.map((condition, index) => (
                <Chip key={index} label={condition} color="warning" size="small" />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="patient details tabs">
          <Tab icon={<DescriptionIcon />} label="Medical Records" />
          <Tab icon={<CalendarIcon />} label="Appointments" />
          <Tab icon={<MedicationIcon />} label="Medications" />
          <Tab icon={<MedicalIcon />} label="Vitals" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMedicalRecord}
          >
            Add Medical Record
          </Button>
        </Box>
        <MedicalRecordsList records={medicalRecords} patientId={id} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAppointment}
          >
            Schedule Appointment
          </Button>
        </Box>
        <PatientAppointments appointments={appointments} patientId={id} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PatientMedications patientId={id} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <PatientVitals patientId={id} />
      </TabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Patient Record
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {patient.firstName} {patient.lastName}'s record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeletePatient} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDetails;