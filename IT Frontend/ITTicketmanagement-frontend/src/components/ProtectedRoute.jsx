import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppState } from '../contexts/AppStateContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { state } = useAppState();
  const { currentUser: user, isAuthenticated } = state;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

