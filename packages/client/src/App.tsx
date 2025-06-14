import { Suspense, lazy, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
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

  return (
    <Layout>
      <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<AnimatedPage><WelcomePage /></AnimatedPage>} />
            <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicyPage /></AnimatedPage>} />
            <Route path="/terms-of-service" element={<AnimatedPage><TermsPage /></AnimatedPage>} />

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
  );
}

export default App;
