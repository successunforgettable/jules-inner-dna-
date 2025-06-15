import React, { useEffect, Suspense, lazy, ReactNode } from 'react'; // Added React and useEffect
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import useAuthStore from './contexts/store/useAuthStore'; // Import auth store
import RouteChangeTracker from './components/common/RouteChangeTracker'; // Import GA Tracker
import './App.css';

// Lazy load page components
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const FoundationPage = lazy(() => import('./pages/Assessment/FoundationPage'));
const BuildingBlocksPage = lazy(() => import('./pages/Assessment/BuildingBlocksPage'));
const ColorPalettePage = lazy(() => import('./pages/Assessment/ColorPalettePage'));
const DetailElementsPage = lazy(() => import('./pages/Assessment/DetailElementsPage'));
const ResultsPage = lazy(() => import('./pages/Assessment/ResultsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/Admin/UserManagementPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));

// Wrapper for page animations
const AnimatedPage: React.FC<{ children: ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 /* Corresponds to --duration-300 */ }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    // Attempt to refresh token on initial app load
    useAuthStore.getState().refreshAuthStatus();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <> {/* Changed to Fragment to include RouteChangeTracker alongside Layout */}
      <RouteChangeTracker />
      <Layout>
        <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<AnimatedPage><WelcomePage /></AnimatedPage>} />
            <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicyPage /></AnimatedPage>} />
            <Route path="/terms-of-service" element={<AnimatedPage><TermsPage /></AnimatedPage>} />
            <Route path="/reset-password" element={<AnimatedPage><ResetPasswordPage /></AnimatedPage>} />
            <Route path="/subscribe" element={<AnimatedPage><SubscriptionPage /></AnimatedPage>} />
            <Route path="/payment" element={<AnimatedPage><PaymentPage /></AnimatedPage>} /> {/* Simple route for now, can add /:planId later */}

            {/* Protected Assessment Routes */}
            {/* The ProtectedRoute itself is not animated as a page, but its children are */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/assessment"
                element={<Navigate to="/assessment/foundation" replace />}
              />
              <Route path="/assessment/foundation" element={<AnimatedPage><FoundationPage /></AnimatedPage>} />
              <Route path="/assessment/building-blocks" element={<AnimatedPage><BuildingBlocksPage /></AnimatedPage>} />
              <Route path="/assessment/color-palette" element={<AnimatedPage><ColorPalettePage /></AnimatedPage>} />
              <Route path="/assessment/detail-elements" element={<AnimatedPage><DetailElementsPage /></AnimatedPage>} />
              <Route path="/assessment/results" element={<AnimatedPage><ResultsPage /></AnimatedPage>} />

              <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
              <Route path="/dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
              <Route path="users" element={<AnimatedPage><UserManagementPage /></AnimatedPage>} />
              {/* Add other admin sub-routes here, wrapped with AnimatedPage */}
            </Route>

            {/* Fallback for undefined routes */}
            <Route
              path="*"
              element={
                <AnimatedPage>
                  <div style={{ padding: "var(--space-8)", textAlign: "center" }}> {/* Updated to use new spacing var */}
                    <h2>404 Not Found</h2>
                    <p>Sorry, the page you are looking for does not exist.</p>
                  </div>
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
    </>
  );
}

export default App;
