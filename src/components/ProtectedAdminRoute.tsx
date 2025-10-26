// components/ProtectedAdminRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin, Alert, Button } from 'antd';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth(); // Get loading state
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert
          message="Access Denied"
          description="You don't have permission to access the admin dashboard. Please contact an administrator."
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;