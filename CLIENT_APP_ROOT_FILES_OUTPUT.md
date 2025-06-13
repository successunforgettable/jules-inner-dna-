## Client Application Root Files (`main.tsx` and `App.tsx`)

This document contains the content of the main client application entry point (`main.tsx`) and the root `App` component (`App.tsx`), which includes the router configuration.

---
**File Path:** `packages/client/src/main.tsx`
---
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

// Import Global Styles - Order can be important
import './styles/variables.css'; // Define CSS Custom Properties (GDS Tokens) first
import './styles/globals.css';   // Apply base global styles, typography, resets
import './App.css';              // App-specific shell styles (if any)
import './index.css';            // Lowest level global styles, or #root specific (if any)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

---
**File Path:** `packages/client/src/App.tsx`
---
```tsx
import React from 'react'; // React import for older setups, not strictly needed with new JSX transform
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WelcomePage from './pages/WelcomePage';
import FoundationPage from './pages/Assessment/FoundationPage';
import BuildingBlocksPage from './pages/Assessment/BuildingBlocksPage';
import ColorPalettePage from './pages/Assessment/ColorPalettePage';
import DetailElementsPage from './pages/Assessment/DetailElementsPage';
import ResultsPage from './pages/Assessment/ResultsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import './App.css'; // For any App-shell specific styles not in Layout

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />

        {/*
          Login and Register routes could be added here if they become separate pages:
          e.g., <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
          Currently, they are modals triggered from WelcomePage or Header.
        */}

        {/* Protected Assessment Routes & User Profile */}
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

        {/* Fallback for undefined routes (404 Not Found) */}
        <Route
            path="*"
            element={
                <div style={{ padding: "var(--space-xl)", textAlign: "center", marginTop: "var(--space-xxl)"}}>
                    <h1 style={{fontSize: "var(--font-size-display-large-mobile)", marginBottom: "var(--space-md)"}}>404</h1>
                    <h2 style={{fontSize: "var(--font-size-heading-h1-mobile)", marginBottom: "var(--space-sm)"}}>Page Not Found</h2>
                    <p style={{fontSize: "var(--font-size-body-large-mobile)"}}>Sorry, the page you are looking for does not exist.</p>
                    {/* Consider adding a Link to home: <Link to="/">Go Home</Link> */}
                </div>
            }
        />
      </Routes>
    </Layout>
  );
}

export default App;
```

This markdown contains the requested client application root files.
```
