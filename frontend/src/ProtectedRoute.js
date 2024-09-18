import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ element }) => {
  const { user } = useUser();

  console.log(user)
  return user ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;