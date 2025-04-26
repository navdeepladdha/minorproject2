// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser } from '../services/api';

// 1. Create the AuthContext
export const AuthContext = createContext();

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on app initialization
    const savedUser = localStorage.getItem('ehrUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const response = await loginUser(username, password, role);

      if (response.success) {
        setCurrentUser(response.user);
        localStorage.setItem('ehrUser', JSON.stringify(response.user));
        return response.user;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ehrUser');
  };

  const hasRole = (roles) => {
    if (!currentUser) return false;

    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }

    return currentUser.role === roles;
  };

  const value = {
    currentUser,
    login,
    logout,
    hasRole,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create and export useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
