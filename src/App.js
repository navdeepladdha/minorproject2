import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';


// Layouts
import MainLayout from './components/layout/MainLayout';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Main components
import Dashboard from './components/dashboard/Dashboard';
import PatientsList from './components/patients/PatientsList';
import PatientDetails from './components/patients/PatientDetails';
import AppointmentsList from './components/appointments/AppointmentsList';
import MedicalRecordsList from './components/medical-records/MedicalRecordsList';
import MedicalRecordDetails from './components/medical-records/MedicalRecordDetails';

// Context
import { AuthProvider } from './contexts/AuthContext';


// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  // Simple auth check - replace with proper auth logic later
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="patients/:id" element={<PatientDetails />} />
              <Route path="appointments" element={<AppointmentsList />} />
              <Route path="medical-records" element={<MedicalRecordsList />} />
              <Route path="medical-records/:id" element={<MedicalRecordDetails />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;