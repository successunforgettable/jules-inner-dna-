import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../contexts/store/useAuthStore';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const user = useAuthStore((state) => state.user); // For role-based access
  const location = useLocation();

  // TODO: Implement admin role check for /admin routes if spec requires role differentiation.
  // Example future check:
  // const isAdminRoute = location.pathname.startsWith('/admin');
  // const userRole = user?.role; // Assuming 'role' is part of UserProfile
  // if (isAdminRoute && userRole !== 'admin') {
  //   // Redirect to a 'Not Authorized' page or home page
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  if (!isAuthenticated) {
    // Redirect them to the / (welcome) page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />; // Render child routes/components if authenticated
};

export default ProtectedRoute;
