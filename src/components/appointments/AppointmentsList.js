// src/components/appointments/AppointmentsList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid2,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import appointmentService from '../../services/appointmentService';

const statusColors = {
  'Scheduled': 'primary',
  'Completed': 'success',
  'Cancelled': 'error',
  'No-Show': 'warning',
  'In Progress': 'info',
};

const AppointmentsList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [filterDate, filterStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filterDate) {
        params.date = filterDate.toISOString().split('T')[0];
      }
      
      if (filterStatus) {
        params.status = filterStatus;
      }
      
      const data = await appointmentService.getAllAppointments(params);
      setAppointments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    navigate(`/appointments/${selectedAppointment._id}`);
    handleMenuClose();
  };

  const handleEditAppointment = () => {
    navigate(`/appointments/edit/${selectedAppointment._id}`);
    handleMenuClose();
  };

  const handleDeleteAppointment = async () => {
    try {
      await appointmentService.deleteAppointment(selectedAppointment._id);
      fetchAppointments();
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.toLowerCase();
    const doctorName = `${appointment.doctor?.firstName || ''} ${appointment.doctor?.lastName || ''}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      patientName.includes(searchTermLower) ||
      doctorName.includes(searchTermLower) ||
      appointment.purpose?.toLowerCase().includes(searchTermLower)
    );
  });

  const formatAppointmentTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/add')}
        >
          New Appointment
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
                variant="outlined"
                size="small"
              />
            </Grid2>
            <Grid2 item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Filter by Date"
                  value={filterDate}
                  onChange={(newValue) => setFilterDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  clearable
                />
              </LocalizationProvider>
            </Grid2>
            <Grid2 item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="small"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="No-Show">No-Show</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 item xs={12} md={2}>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<FilterIcon />}
                onClick={fetchAppointments}
              >
                Filter
              </Button>
            </Grid2>
          </Grid2>

          </CardContent>
          </Card>

          </Box>

);
};

export default AppointmentsList;