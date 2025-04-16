import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Validation schema for patient form
const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  insuranceProvider: yup.string(),
  insuranceNumber: yup.string(),
  medicalHistory: yup.string(),
});

const PatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Mock data - in a real application, fetch from API
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        dateOfBirth: '1980-05-15',
        gender: 'Male',
        address: '123 Main St, Anytown, USA',
        insuranceProvider: 'BlueCross',
        insuranceNumber: 'BC1234567',
        medicalHistory: 'Hypertension, Diabetes',
        status: 'Active',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '(555) 987-6543',
        dateOfBirth: '1975-09-20',
        gender: 'Female',
        address: '456 Oak Ave, Somewhere, USA',
        insuranceProvider: 'Aetna',
        insuranceNumber: 'AE7654321',
        medicalHistory: 'Asthma',
        status: 'Active',
      },
      {
        id: 3,
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@example.com',
        phone: '(555) 456-7890',
        dateOfBirth: '1990-02-10',
        gender: 'Male',
        address: '789 Pine St, Elsewhere, USA',
        insuranceProvider: 'UnitedHealth',
        insuranceNumber: 'UH9876543',
        medicalHistory: 'None',
        status: 'Inactive',
      },
      {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@example.com',
        phone: '(555) 789-0123',
        dateOfBirth: '1985-11-30',
        gender: 'Female',
        address: '321 Elm St, Nowhere, USA',
        insuranceProvider: 'Cigna',
        insuranceNumber: 'CI1357924',
        medicalHistory: 'Allergies',
        status: 'Active',
      },
      {
        id: 5,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        phone: '(555) 012-3456',
        dateOfBirth: '1972-07-25',
        gender: 'Male',
        address: '654 Maple St, Anyplace, USA',
        insuranceProvider: 'Kaiser',
        insuranceNumber: 'KP2468013',
        medicalHistory: 'Heart condition',
        status: 'Active',
      },
    ];
    setPatients(mockPatients);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPatient = (id) => {
    navigate(`/patients/${id}`);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    formik.setValues({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      insuranceProvider: patient.insuranceProvider || '',
      insuranceNumber: patient.insuranceNumber || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = (patient) => {
    setConfirmDelete(patient);
  };

  const handleConfirmDelete = () => {
    // In a real app, make an API call to delete
    setPatients(patients.filter(p => p.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      insuranceProvider: '',
      insuranceNumber: '',
      medicalHistory: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editingPatient) {
        // Update existing patient
        const updatedPatients = patients.map(p => 
          p.id === editingPatient.id ? { ...p, ...values } : p
        );
        setPatients(updatedPatients);
      } else {
        // Add new patient
        const newPatient = {
          id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
          ...values,
          status: 'Active',
        };
        setPatients([...patients, newPatient]);
      }
      setOpenDialog(false);
    },
  });

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.phone.includes(searchTerm);
  });

  // Calculate pagination
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - filteredPatients.length) 
    : 0;

  const visiblePatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Patients
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddPatient}
          >
            Add Patient
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          placeholder="Search patients by name, email, or phone..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePatients.map((patient) => (
                <TableRow
                  hover
                  key={patient.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {`${patient.firstName} ${patient.lastName}`}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.dateOfBirth}</TableCell>
                  <TableCell>
                    <Chip 
                      label={patient.status} 
                      color={patient.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="view"
                      onClick={() => handleViewPatient(patient.id)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="edit"
                      onClick={() => handleEditPatient(patient)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleDeleteClick(patient)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="gender"
                  name="gender"
                  label="Gender"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  helperText={formik.touched.gender && formik.errors.gender}
                  margin="normal"
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </TextField>
              </Grid2>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="insuranceProvider"
                  name="insuranceProvider"
                  label="Insurance Provider"
                  value={formik.values.insuranceProvider}
                  onChange={formik.handleChange}
                  error={formik.touched.insuranceProvider && Boolean(formik.errors.insuranceProvider)}
                  helperText={formik.touched.insuranceProvider && formik.errors.insuranceProvider}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="insuranceNumber"
                  name="insuranceNumber"
                  label="Insurance Number"
                  value={formik.values.insuranceNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.insuranceNumber && Boolean(formik.errors.insuranceNumber)}
                  helperText={formik.touched.insuranceNumber && formik.errors.insuranceNumber}
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  id="medicalHistory"
                  name="medicalHistory"
                  label="Medical History"
                  multiline
                  rows={4}
                  value={formik.values.medicalHistory}
                  onChange={formik.handleChange}
                  error={formik.touched.medicalHistory && Boolean(formik.errors.medicalHistory)}
                  helperText={formik.touched.medicalHistory && formik.errors.medicalHistory}
                  margin="normal"
                />
              </Grid2>
            </Grid2>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingPatient ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete patient {confirmDelete?.firstName} {confirmDelete?.lastName}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientsList;