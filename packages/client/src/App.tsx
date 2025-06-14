import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />

          {/* Protected Assessment Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/assessment"
            element={<Navigate to="/assessment/foundation" replace />}
          />
          <Route path="/assessment/foundation" element={<FoundationPage />} />
          <Route path="/assessment/building-blocks" element={<BuildingBlocksPage />} />
          <Route path="/assessment/color-palette" element={<ColorPalettePage />} />
          <Route path="/assessment/detail-elements" element={<DetailElementsPage />} />
          <Route path="/assessment/results" element={<ResultsPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback for undefined routes */}
        <Route
            path="*"
            element={
                <div style={{ padding: "var(--space-xl)", textAlign: "center"}}>
                    <h2>404 Not Found</h2>
                    <p>Sorry, the page you are looking for does not exist.</p>
                </div>
            }
        />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
