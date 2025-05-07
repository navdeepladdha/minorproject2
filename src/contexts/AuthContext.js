import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token)
        .then((data) => {
          if (data.success) {
            setCurrentUser({
              ...data.user,
              token,
              name: `${data.user.firstName} ${data.user.lastName}`
            });
          }
        })
        .catch((err) => console.error('Failed to fetch current user:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password, role }) => {
    setError('');
    try {
      const data = await loginUser({ email, password, role });
      if (data.success) {
        localStorage.setItem('token', data.token);
        const userData = await getCurrentUser(data.token);
        if (userData.success) {
          const user = {
            ...userData.user,
            token: data.token,
            name: `${userData.user.firstName} ${userData.user.lastName}`
          };
          setCurrentUser(user);
          return { success: true, user };
        }
        throw new Error('Failed to fetch user data');
      }
      setError(data.message || 'Login failed');
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      throw err;
    }
  };

  const register = async (userData) => {
    setError('');
    try {
      const data = await registerUser(userData);
      if (data.success) {
        localStorage.setItem('token', data.token);
        const userData = await getCurrentUser(data.token);
        if (userData.success) {
          const user = {
            ...userData.user,
            token: data.token,
            name: `${userData.user.firstName} ${userData.user.lastName}`
          };
          setCurrentUser(user);
          return { success: true, user };
        }
        throw new Error('Failed to fetch user data');
      }
      setError(data.message || 'Registration failed');
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setError('');
  };

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading, error, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);