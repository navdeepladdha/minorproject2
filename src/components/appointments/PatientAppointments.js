import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientAppointments } from '../../services/appointmentService';
import { format } from 'date-fns';

const PatientAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { patientId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getPatientAppointments(patientId);
        setAppointments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleAddAppointment = () => {
    navigate(`/patients/${patientId}/appointments/add`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Patient Appointments
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddAppointment}
        >
          Add Appointment
        </Button>
      </Box>

      {appointments.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No appointments found for this patient.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(new Date(appointment.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(appointment.date), 'hh:mm a')}
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.status} 
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/appointments/${appointment.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default PatientAppointmentsList;