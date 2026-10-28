import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const trainer = localStorage.getItem('trainerUser');
  if (!trainer) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
