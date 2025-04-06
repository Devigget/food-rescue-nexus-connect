
import React from 'react';

// This component just passes through children without any protection
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;
