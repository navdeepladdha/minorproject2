// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchAdminData } from '../services/api';
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
  AlertTitle
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const AdminDashboard = () => {
  // Initialize with empty arrays to prevent mapping errors
  const [data, setData] = useState({
    staff: [],
    departments: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAdminData();
        setData(result);
      } catch (err) {
        setError('Failed to load admin data');
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

  // Helper function to determine status chip color
  const getStatusColor = (status) => {
    if (status === 'Active') return 'success';
    if (status === 'On Leave') return 'warning';
    return 'error';
  };

  // Helper function to determine alert severity and icon
  const getAlertProps = (type) => {
    switch (type) {
      case 'critical':
        return { severity: 'error', icon: <ErrorIcon /> };
      case 'warning':
        return { severity: 'warning', icon: <WarningIcon /> };
      case 'info':
      default:
        return { severity: 'info', icon: <InfoIcon /> };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Staff List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Staff Directory
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.staff && data.staff.length > 0 ? (
                    data.staff.map((person) => (
                      <TableRow key={person.id} hover>
                        <TableCell>{person.name}</TableCell>
                        <TableCell>{person.role}</TableCell>
                        <TableCell>{person.department}</TableCell>
                        <TableCell>
                          <Chip 
                            label={person.status} 
                            color={getStatusColor(person.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No staff data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Department Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Department Stats
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell>Staff Count</TableCell>
                    <TableCell>Patients</TableCell>
                    <TableCell>Budget</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.departments && data.departments.length > 0 ? (
                    data.departments.map((dept) => (
                      <TableRow key={dept.id} hover>
                        <TableCell>{dept.name}</TableCell>
                        <TableCell>{dept.staffCount}</TableCell>
                        <TableCell>{dept.patientCount}</TableCell>
                        <TableCell>${dept.budget.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No department data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* System Alerts */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          System Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.alerts && data.alerts.length > 0 ? (
            data.alerts.map((alert) => {
              const { severity } = getAlertProps(alert.type);
              return (
                <Alert key={alert.id} severity={severity} variant="outlined">
                  <AlertTitle>{alert.title}</AlertTitle>
                  {alert.message}
                </Alert>
              );
            })
          ) : (
            <Typography align="center" color="text.secondary">
              No system alerts
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          Administrative Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Button 
              variant="contained" 
              fullWidth
              color="primary"
              sx={{ p: 1.5 }}
            >
              Manage Users
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button 
              variant="contained" 
              fullWidth
              color="success"
              sx={{ p: 1.5 }}
            >
              System Settings
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button 
              variant="contained" 
              fullWidth
              color="secondary"
              sx={{ p: 1.5 }}
            >
              View Reports
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button 
              variant="contained" 
              fullWidth
              color="warning"
              sx={{ p: 1.5 }}
            >
              Audit Logs
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;