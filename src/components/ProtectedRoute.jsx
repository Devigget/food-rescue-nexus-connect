
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If allowedUserTypes is empty or if user type is in allowedUserTypes
  if (
    allowedUserTypes.length === 0 || 
    (userProfile && allowedUserTypes.includes(userProfile.userType))
  ) {
    return children;
  }

  // User type not allowed to access this route
  return <Navigate to="/dashboard" />;
};

export default ProtectedRoute;
