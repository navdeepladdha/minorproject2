import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAdminData, createDepartment } from '../services/api';
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
  AlertTitle,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({
    staff: [],
    departments: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    staffCount: 0,
    patientCount: 0,
    budget: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching admin data with token:', currentUser?.token);
        const result = await fetchAdminData(currentUser?.token);
        console.log('Admin data received:', result);
        setData(result);
      } catch (err) {
        setError('Failed to load admin data');
        console.error('Admin data error:', err);
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

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setDepartmentForm({ name: '', staffCount: 0, patientCount: 0, budget: 0 });
  };

  const handleDepartmentChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating department:', departmentForm);
      await createDepartment(departmentForm, currentUser?.token);
      const result = await fetchAdminData(currentUser?.token);
      setData(result);
      handleModalClose();
    } catch (err) {
      setError('Failed to create department');
      console.error('Department creation error:', err);
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

  const getStatusColor = (status) => {
    if (status === 'Active') return 'success';
    if (status === 'On Leave') return 'warning';
    return 'error';
  };

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
                      <TableRow key={dept._id} hover>
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

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
          System Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.alerts && data.alerts.length > 0 ? (
            data.alerts.map((alert) => {
              const { severity, icon } = getAlertProps(alert.type);
              return (
                <Alert key={alert.id} severity={severity} icon={icon} variant="outlined">
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
              onClick={handleModalOpen}
            >
              Create Department
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              color="success"
              sx={{ p: 1.5 }}
              disabled
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
              disabled
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
              disabled
            >
              Audit Logs
            </Button>
          </Grid>
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
            Create Department
          </Typography>
          <Box component="form" onSubmit={handleDepartmentSubmit}>
            <TextField
              fullWidth
              label="Department Name"
              name="name"
              value={departmentForm.name}
              onChange={handleDepartmentChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Staff Count"
              name="staffCount"
              type="number"
              value={departmentForm.staffCount}
              onChange={handleDepartmentChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Patient Count"
              name="patientCount"
              type="number"
              value={departmentForm.patientCount}
              onChange={handleDepartmentChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Budget"
              name="budget"
              type="number"
              value={departmentForm.budget}
              onChange={handleDepartmentChange}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Create
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

export default AdminDashboard;