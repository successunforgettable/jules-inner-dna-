import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../contexts/store/useAuthStore';

interface ProtectedRouteProps {
  // children?: React.ReactNode; // For older versions of react-router or different patterns
  // Instead of children, React Router v6 uses <Outlet /> for nested routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the home page (which has login/register modals)
    // or to a dedicated /login page if you have one.
    // Pass the current location so that after login, they can be redirected back.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />; // Renders the child route's element if authenticated
};

export default ProtectedRoute;
