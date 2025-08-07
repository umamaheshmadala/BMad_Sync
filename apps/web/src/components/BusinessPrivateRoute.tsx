import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const BusinessPrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, isBusiness } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user || !isBusiness) {
    return <Navigate to="/business-login" replace />;
  }

  return children;
};

export default BusinessPrivateRoute;
