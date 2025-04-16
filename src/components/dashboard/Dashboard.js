import React, { useState, useEffect } from 'react';
import {
  Grid2,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from '@mui/material';
import {
  PeopleAlt as PatientsIcon,
  Event as AppointmentsIcon,
  AssignmentTurnedIn as RecordsIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Mock data - in a real app, fetch from API
  const [stats, setStats] = useState({
    totalPatients: 1248,
    appointmentsToday: 42,
    pendingReports: 15,
    recentActivities: 87,
  });

  const [recentPatients, setRecentPatients] = useState([
    { id: 1, name: 'Sarah Johnson', age: 45, lastVisit: '2023-02-15', issue: 'Annual checkup' },
    { id: 2, name: 'Michael Chen', age: 32, lastVisit: '2023-02-14', issue: 'Respiratory infection' },
    { id: 3, name: 'Emily Rodriguez', age: 28, lastVisit: '2023-02-12', issue: 'Pregnancy follow-up' },
    { id: 4, name: 'David Kim', age: 56, lastVisit: '2023-02-10', issue: 'Hypertension management' },
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, patientName: 'Robert Wilson', time: '09:00 AM', date: '2023-02-16', type: 'Follow-up' },
    { id: 2, patientName: 'Jennifer Lopez', time: '10:30 AM', date: '2023-02-16', type: 'Consultation' },
    { id: 3, patientName: 'Samantha Lee', time: '01:15 PM', date: '2023-02-16', type: 'Laboratory Test' },
    { id: 4, patientName: 'Thomas Brown', time: '03:45 PM', date: '2023-02-16', type: 'Vaccination' },
  ]);

  // Chart data
  const patientData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Patients',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const appointmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Appointments',
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Statistics',
      },
    },
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={3}>
        {/* Stats Cards */}
        <Grid2 item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PatientsIcon />
              </Avatar>
              <Typography component="h2" variant="h6" color="primary">
                Total Patients
              </Typography>
            </Box>
            <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.totalPatients}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              as of today
            </Typography>
          </Paper>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <AppointmentsIcon />
              </Avatar>
              <Typography component="h2" variant="h6" color="secondary">
                Today's Appointments
              </Typography>
            </Box>
            <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.appointmentsToday}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              appointments today
            </Typography>
          </Paper>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <RecordsIcon />
              </Avatar>
              <Typography component="h2" variant="h6" color="warning.main">
                Pending Reports
              </Typography>
            </Box>
            <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.pendingReports}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              need your attention
            </Typography>
          </Paper>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                <NotificationsIcon />
              </Avatar>
              <Typography component="h2" variant="h6" color="info.main">
                Recent Activities
              </Typography>
            </Box>
            <Typography component="p" variant="h3" sx={{ flexGrow: 1, mt: 2 }}>
              {stats.recentActivities}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              in the last 24 hours
            </Typography>
          </Paper>
        </Grid2>

        {/* Charts */}
        <Grid2 item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Patient Growth
            </Typography>
            <Line options={chartOptions} data={patientData} />
          </Paper>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Trends
            </Typography>
            <Line options={chartOptions} data={appointmentData} />
          </Paper>
        </Grid2>

        {/* Recent Patients */}
        <Grid2 item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Recent Patients" 
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {recentPatients.map((patient) => (
                  <React.Fragment key={patient.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{patient.name.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={patient.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {patient.age} years old
                            </Typography>
                            {` — ${patient.issue} (Last visit: ${patient.lastVisit})`}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>

        {/* Upcoming Appointments */}
        <Grid2 item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Upcoming Appointments" 
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {upcomingAppointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{appointment.patientName.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.patientName}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {appointment.time}, {appointment.date}
                            </Typography>
                            {` — ${appointment.type}`}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;