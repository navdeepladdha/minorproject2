import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Utility functions
export const calculateAge = (dob) => {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getRelativeTimeString = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

// Auth and user functions
export const getCurrentUser = async (token) => {
  const response = await API.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// Admin functions
export const fetchAdminData = async (token) => {
  const response = await API.get('/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUsers = async (token) => {
  const response = await API.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createDepartment = async (departmentData, token) => {
  const response = await API.post('/admin/departments', departmentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Doctor functions
export const fetchDoctorData = async (token) => {
  const response = await API.get('/doctor/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPatientDetails = async (patientId, token) => {
  const response = await API.get(`/doctor/patients/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createPrescription = async (prescriptionData, token) => {
  const response = await API.post('/doctor/prescriptions', prescriptionData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Nurse functions
export const fetchNurseData = async (token) => {
  const response = await API.get('/nurse/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePatientVitals = async (patientId, vitalsData, token) => {
  const response = await API.put(`/nurse/patients/${patientId}/vitals`, vitalsData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Staff functions
export const fetchStaffData = async (token) => {
  const response = await API.get('/staff/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Patient functions
export const registerPatient = async (patientData, token) => {
  const response = await API.post('/patients', patientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};