import React, { createContext, useState, useEffect } from 'react';
import { loginUser, getCurrentUser, registerUser } from '../services/api';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      console.log('Initializing auth with token:', token, 'and role:', role);

      if (token && role) {
        try {
          const user = await getCurrentUser(token);
          console.log('Current user fetched:', user);
          setCurrentUser({ ...user, token, role });
        } catch (err) {
          console.error('Error fetching current user:', err);
          setCurrentUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async ({ email, password, role }) => {
    try {
      // Password is sent as plain text here because the server will handle comparison
      // with the hashed password stored in the database
      const response = await loginUser({ email, password, role });
      console.log('AuthContext login response:', response);
      const token = response?.token || response?.data?.token;
      if (token) {
        const user = { email, role, token };
        setCurrentUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setError(null);
        return { success: true, user };
      } else {
        throw new Error('Invalid login response: No token received');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      // Hash the password before sending to the API
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Ensure we're passing all required fields from the form
      const registrationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword, // Use the hashed password
        role: userData.role,
        // Include additional fields for doctors
        ...(userData.role === 'doctor' && {
          specialization: userData.specialization,
          licenseNumber: userData.licenseNumber
        })
      };

      console.log('Sending registration data:', registrationData);
      const response = await registerUser(registrationData);
      console.log('AuthContext register response:', response);
      setError(null);
      return { success: true, message: 'Registration successful. Please log in.' };
    } catch (error) {
      console.error('Register error in AuthContext:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setError(null);
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, register, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;