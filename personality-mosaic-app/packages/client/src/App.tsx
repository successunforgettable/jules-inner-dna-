import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WelcomePage from './pages/WelcomePage';
import AssessmentPage from './pages/AssessmentPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Layout> {/* Layout component wraps all page content providing Header and Footer */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        {/* Add routes for Login and Register pages if they become separate pages */}
        {/* e.g., <Route path="/login" element={<LoginPage />} /> */}
        {/* e.g., <Route path="/register" element={<RegisterPage />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/assessment" element={<AssessmentPage />} />
          {/* Add other protected routes here, e.g., /profile, /results/:id */}
        </Route>

        {/* Fallback for undefined routes (Optional: Create a NotFoundPage component) */}
        <Route path="*" element={<div><h2>404 Not Found</h2><p>Sorry, the page you are looking for does not exist.</p></div>} />
      </Routes>
    </Layout>
  );
}

export default App;
