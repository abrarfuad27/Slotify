// Abrar Mohammad Fuad; 261083785
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

// ProtectedRoute component to wrap routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show nothing while checking authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/userLogin" replace />;
  }

  // If user is authenticated, render the children
  return children;
};

// For routes that should only be accessible when NOT logged in
export const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show nothing while checking authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/memberDashboard" replace />;
  }

  // If not logged in, render the children
  return children;
};