import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WelcomePage from './pages/WelcomePage';
import FoundationPage from './pages/Assessment/FoundationPage';
import BuildingBlocksPage from './pages/Assessment/BuildingBlocksPage';
import ColorPalettePage from './pages/Assessment/ColorPalettePage'; // Import new page
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function AppNew() { // Renamed component
  return (
    <Layout>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<WelcomePage />} />

        {/* Protected Assessment Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/assessment"
            element={<Navigate to="/assessment/foundation" replace />}
          />
          <Route path="/assessment/foundation" element={<FoundationPage />} />
          <Route path="/assessment/building-blocks" element={<BuildingBlocksPage />} />
          <Route path="/assessment/color-palette" element={<ColorPalettePage />} />
          {/* Add routes for other assessment phases here:
              <Route path="/assessment/detail-elements" element={<DetailElementsPage />} />
              <Route path="/assessment/results" element={<ResultsPage />} />
          */}
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
    </Layout>
  );
}

export default AppNew;
