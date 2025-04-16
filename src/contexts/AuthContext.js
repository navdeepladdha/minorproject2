import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // In a real application, verify the token with your backend
          // const response = await axios.get('/api/auth/me', {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          // setUser(response.data);
          
          // For now, let's simulate a user
          setUser({
            id: 1,
            name: 'Dr. John Doe',
            email: 'john.doe@example.com',
            role: 'doctor'
          });
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // In a real application, make an API call to your backend
      // const response = await axios.post('/api/auth/login', { email, password });
      // const { token, user } = response.data;
      
      // For now, let's simulate a successful login
      const token = 'fake-jwt-token';
      const userData = {
        id: 1,
        name: 'Dr. John Doe',
        email: email,
        role: 'doctor'
      };
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Register function
  const register = async (userData) => {
    try {
      // In a real application, make an API call to your backend
      // const response = await axios.post('/api/auth/register', userData);
      
      // For now, let's simulate a successful registration
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;