import axios from 'axios';

// Create a consistent API configuration with proper error handling
const API = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_BACKEND_PORT || 5001}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for better debugging
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`, 
      config.data ? `with data: ${JSON.stringify(config.data)}` : '');
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('API loginUser error:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    if (!userData.firstName || !userData.lastName) {
      console.warn('Missing required fields in registration data:', userData);
    }
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('API registerUser error:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      sentData: userData
    });
    if (error.response?.data && typeof error.response.data === 'string' && 
        error.response.data.includes('<!DOCTYPE')) {
      console.error('Server returned HTML instead of JSON. Backend server might be down or misconfigured.');
    }
    throw error.response?.data || error;
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await API.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API getCurrentUser error:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Fetch admin data
export const fetchAdminData = async (token) => {
  try {
    const [staffResponse, departmentsResponse, alertsResponse] = await Promise.all([
      API.get('/staff', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => {
        console.error('Error fetching staff data:', err.response?.data || err.message);
        throw err;
      }),
      API.get('/departments', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => {
        console.error('Error fetching departments data:', err.response?.data || err.message);
        throw err;
      }),
      API.get('/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => {
        console.error('Error fetching alerts data:', err.response?.data || err.message);
        throw err;
      }),
    ]);

    return {
      staff: staffResponse.data,
      departments: departmentsResponse.data,
      alerts: alertsResponse.data,
    };
  } catch (error) {
    console.error('Error fetching admin data:', error.response?.data || error.message);
    throw error;
  }
};

// Create department
export const createDepartment = async (departmentData, token) => {
  try {
    const response = await API.post('/departments', departmentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API createDepartment error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Fetch doctor dashboard
export const fetchDoctorDashboard = async (token) => {
  try {
    const response = await API.get('/doctor/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API fetchDoctorDashboard error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Fetch patient details
export const fetchPatientDetails = async (patientId, token) => {
  try {
    const response = await API.get(`/doctor/patients/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API fetchPatientDetails error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Create prescription
export const createPrescription = async (prescriptionData, token) => {
  try {
    const response = await API.post('/doctor/prescriptions', prescriptionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API createPrescription error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Fetch nurse dashboard
export const fetchNurseDashboard = async (token) => {
  try {
    const response = await API.get('/nurse/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API fetchNurseDashboard error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Update vitals
export const updateVitals = async (patientId, vitalsData, token) => {
  try {
    const response = await API.put(`/nurse/patients/${patientId}/vitals`, vitalsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API updateVitals error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Fetch staff dashboard
export const fetchStaffDashboard = async (token) => {
  try {
    const response = await API.get('/staff/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API fetchStaffDashboard error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Create patient
export const createPatient = async (patientData, token) => {
  try {
    const response = await API.post('/patients', patientData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API createPatient error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      url: error.config?.url
    });
    throw error.response?.data || error;
  }
};

// Submit leave application
export const submitLeaveApplication = async (leaveData, token) => {
  try {
    const response = await API.post('/leaves', leaveData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API submitLeaveApplication error:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      sentData: leaveData,
    });
    throw error.response?.data || error;
  }
};

// Update leave status
export const updateLeaveStatus = async (leaveId, status, token) => {
  try {
    const response = await API.put(`/leaves/${leaveId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('API updateLeaveStatus error:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw error.response?.data || error;
  }
};