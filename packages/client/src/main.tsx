// TODO: Ensure Stripe packages are installed:
// pnpm install @stripe/stripe-js @stripe/react-stripe-js
// TODO: Ensure react-ga4 is installed:
// pnpm install react-ga4

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/variables.css'; // Assuming this is where global variables are
import './styles/globals.css';   // Assuming this is where global styles are
import { initGA } from './lib/analytics'; // Import GA init function

initGA(); // Initialize GA4 on application startup

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
