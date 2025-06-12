import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    currentUser,
    allowedRoles,
    currentPath: location.pathname,
  });

  if (!isAuthenticated || !currentUser) {
    console.warn('Not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === currentUser.role.toLowerCase())) {
    console.warn(`Role ${currentUser.role} not allowed, redirecting to /${currentUser.role}-dashboard`);
    return <Navigate to={`/${currentUser.role.toLowerCase()}-dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;