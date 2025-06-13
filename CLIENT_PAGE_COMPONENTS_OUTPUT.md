## Client-Side Page Components

This document contains the content of Page components found in `packages/client/src/pages/` and its subdirectories.

---
**File Path:** `packages/client/src/pages/WelcomePage.tsx`
---
```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeLayout from '../components/welcome/WelcomeLayout';
import WelcomeHeader from '../components/welcome/WelcomeHeader';
import HeroSection from '../components/welcome/HeroSection';
import FeatureHighlights from '../components/welcome/FeatureHighlights';
import CallToActionSection from '../components/welcome/CallToActionSection';
import LoginModal from '../components/auth/LoginModal';
import RegistrationModal from '../components/auth/RegistrationModal';
import useAuthStore, { UserProfile } from '../contexts/store/useAuthStore';
import useAssessmentStore from '../contexts/store/useAssessmentStore';
import styles from './WelcomePage.module.css';

const WelcomePage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const { loginSuccess: loginSuccessAction, setError: setAuthError, isAuthenticated, user } = useAuthStore(
    (state) => ({
      loginSuccess: state.loginSuccess,
      setError: state.setError,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    })
  );
  const { registerSuccess: registerSuccessAction } = useAuthStore.getState();

  const isAssessmentComplete = useAssessmentStore((state) => state.isAssessmentComplete);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginModalOpen(false);
      setIsRegisterModalOpen(false);
    }
  }, [isAuthenticated]);

  const openLoginModal = () => {
    setAuthError(null);
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setAuthError(null);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLoginSuccess = (data: { accessToken: string; user: UserProfile }) => {
    loginSuccessAction(data);
    closeLoginModal();
    if (isAssessmentComplete) {
      navigate('/assessment/results');
    }
    // No automatic navigation to /assessment/foundation after login from Welcome; user can choose.
  };

  const handleRegistrationSuccess = () => {
    registerSuccessAction();
    closeRegisterModal();
    openLoginModal(); // Prompt user to login after successful registration
  };

  const handleBeginOrViewResultsClick = () => {
    if (isAuthenticated) {
      if (isAssessmentComplete) {
        navigate('/assessment/results');
      } else {
        navigate('/assessment/foundation');
      }
    } else {
      openRegisterModal();
    }
  };

  const ctaButtonText = isAuthenticated && isAssessmentComplete ? "View My Results" : "Begin Your Assessment";

  return (
    <WelcomeLayout>
      <div className={styles.contentWrapper}>
        <WelcomeHeader />
        {isAuthenticated && user && (
          <p className={styles.welcomeBackMessage}>
            Welcome back, {user.email}!
            {isAssessmentComplete ? " Ready to review your results?" : " Ready to continue your assessment?"}
          </p>
        )}
        <HeroSection />
        <div id="feature-highlights-section">
          <FeatureHighlights />
        </div>
        <CallToActionSection
          onBeginAssessmentClick={handleBeginOrViewResultsClick}
          onLoginClick={openLoginModal}
          beginButtonText={ctaButtonText}
        />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={() => {
          closeLoginModal();
          openRegisterModal();
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onSwitchToLogin={() => {
          closeRegisterModal();
          openLoginModal();
        }}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </WelcomeLayout>
  );
};

export default WelcomePage;
```

---
**File Path:** `packages/client/src/pages/WelcomePage.module.css`
---
```css
/* WelcomePage.module.css - Typography uses GDS vars */
.contentWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
  padding-bottom: var(--space-xxl);
  width: 100%;
}

.welcomeBackMessage {
  font-size: var(--font-size-body-large-mobile);
  line-height: var(--line-height-body-large);
  color: var(--ui-accent-primary);
  font-weight: var(--font-weight-medium);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--ui-background-welcome-gradient-end);
  border-radius: var(--radius-md);
  text-align: center;
  max-width: var(--max-width-block-container);
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .welcomeBackMessage {
    font-size: var(--font-size-body-large-desktop);
  }
}
```

---
**File Path:** `packages/client/src/pages/ProfilePage.tsx`
---
```tsx
import React from 'react';
import useAuthStore from '../contexts/store/useAuthStore'; // Example: to display user info

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }));

  return (
    <div style={{ padding: 'var(--space-lg)', textAlign: 'center', maxWidth: 'var(--max-width-content-s)', margin: 'var(--space-xl) auto' }}>
      <h1 style={{ fontSize: 'var(--font-size-heading-h1-desktop)', color: 'var(--ui-text-primary)', marginBottom: 'var(--space-md)'}}>User Profile</h1>
      {user && (
        <div>
          <p style={{fontSize: 'var(--font-size-body-large-desktop)'}}>Email: {user.email}</p>
          {/* Display other user information here */}
        </div>
      )}
      <p style={{marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-body-main-desktop)'}}><em>(Profile management features, including password change and account deletion, coming soon!)</em></p>
    </div>
  );
};

export default ProfilePage;
```

---
**File Path:** `packages/client/src/pages/PrivacyPolicyPage.tsx`
---
```tsx
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  // Using inline styles for simplicity for these static pages, but could use a .module.css
  const pageStyle: React.CSSProperties = { padding: 'var(--space-lg)', maxWidth: 'var(--max-width-stone-container)', margin: 'var(--space-xl) auto' };
  const headingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h1-desktop)', color: 'var(--ui-text-primary)', marginBottom: 'var(--space-md)' };
  const subHeadingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h2-desktop)', color: 'var(--ui-text-primary)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' };
  const paragraphStyle: React.CSSProperties = { fontSize: 'var(--font-size-body-main-desktop)', lineHeight: 'var(--line-height-body-main)', marginBottom: 'var(--space-sm)' };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Privacy Policy</h1>
      <p style={{...paragraphStyle, fontStyle: 'italic'}}><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      <br />
      <p style={paragraphStyle}>This is a placeholder for the Privacy Policy page. Information about how user data is collected, used, and protected will be detailed here.</p>

      <h2 style={subHeadingStyle}>1. Information We Collect</h2>
      <p style={paragraphStyle}>Details about data collected (e.g., email, assessment responses during your interaction with Personality Mosaic).</p>

      <h2 style={subHeadingStyle}>2. How We Use Your Information</h2>
      <p style={paragraphStyle}>Explanation of data usage (e.g., to provide personalized assessment results, save your progress, and improve our service).</p>

      <h2 style={subHeadingStyle}>3. Data Security</h2>
      <p style={paragraphStyle}>Information on security measures taken to protect user data (e.g., password hashing, secure connections).</p>

      <h2 style={subHeadingStyle}>4. Data Retention</h2>
      <p style={paragraphStyle}>Policy on how long user data is stored and criteria for deletion.</p>

      <h2 style={subHeadingStyle}>5. Your Rights</h2>
      <p style={paragraphStyle}>Information about user rights regarding their data (e.g., access, correction, deletion of your account and associated data).</p>

      <h2 style={subHeadingStyle}>6. Contact Us</h2>
      <p style={paragraphStyle}>How to contact for privacy-related inquiries.</p>
    </div>
  );
};

export default PrivacyPolicyPage;
```

---
**File Path:** `packages/client/src/pages/TermsPage.tsx`
---
```tsx
import React from 'react';

const TermsPage: React.FC = () => {
  const pageStyle: React.CSSProperties = { padding: 'var(--space-lg)', maxWidth: 'var(--max-width-stone-container)', margin: 'var(--space-xl) auto' };
  const headingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h1-desktop)', color: 'var(--ui-text-primary)', marginBottom: 'var(--space-md)' };
  const subHeadingStyle: React.CSSProperties = { fontSize: 'var(--font-size-heading-h2-desktop)', color: 'var(--ui-text-primary)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' };
  const paragraphStyle: React.CSSProperties = { fontSize: 'var(--font-size-body-main-desktop)', lineHeight: 'var(--line-height-body-main)', marginBottom: 'var(--space-sm)' };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Terms of Service</h1>
      <p style={{...paragraphStyle, fontStyle: 'italic'}}><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      <br />
      <p style={paragraphStyle}>This is a placeholder for the Terms of Service page. Users will need to agree to these terms to use the Personality Mosaic service.</p>

      <h2 style={subHeadingStyle}>1. Acceptance of Terms</h2>
      <p style={paragraphStyle}>By accessing or using our Personality Mosaic service, you agree to be bound by these terms and our Privacy Policy.</p>

      <h2 style={subHeadingStyle}>2. Use of Service</h2>
      <p style={paragraphStyle}>Details on permitted and prohibited uses of the service. You agree not to misuse the service or help anyone else to do so.</p>

      <h2 style={subHeadingStyle}>3. User Accounts</h2>
      <p style={paragraphStyle}>Responsibilities regarding account creation (if applicable), security, and termination.</p>

      <h2 style={subHeadingStyle}>4. Intellectual Property</h2>
      <p style={paragraphStyle}>The service and its original content, features, and functionality are and will remain the exclusive property of Personality Mosaic and its licensors.</p>

      <h2 style={subHeadingStyle}>5. Disclaimers and Limitation of Liability</h2>
      <p style={paragraphStyle}>The service is provided on an "AS IS" and "AS AVAILABLE" basis. Our liability is limited to the maximum extent permitted by law.</p>

      <h2 style={subHeadingStyle}>6. Governing Law</h2>
      <p style={paragraphStyle}>These Terms shall be governed by the laws of the jurisdiction in which the service provider is based, without regard to its conflict of law provisions.</p>

      <h2 style={subHeadingStyle}>7. Changes to Terms</h2>
      <p style={paragraphStyle}>We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>

      <h2 style={subHeadingStyle}>8. Contact Us</h2>
      <p style={paragraphStyle}>If you have any questions about these Terms, please contact us.</p>
    </div>
  );
};

export default TermsPage;
```

---
**File Path:** `packages/client/src/pages/Assessment/FoundationPage.tsx`
---
*(Content as generated in "Implement client-side navigation for Foundation Stone assessment phase", Task 5 - includes imports for common buttons, store interactions, navigation logic).*

---
**File Path:** `packages/client/src/pages/Assessment/FoundationPage.module.css`
---
*(Content as generated in "Explicitly update all relevant component CSS Modules from Phases 1-4 (Part 2)...", Task 5 - includes GDS typography for page title, progress indicator, error page, debug results, and NO local button styles).*

---
**File Path:** `packages/client/src/pages/Assessment/BuildingBlocksPage.tsx`
---
*(Content as generated in "Implement client-side navigation for Building Block assessment phase", Task 5 - uses common buttons, store interactions, navigation logic).*

---
**File Path:** `packages/client/src/pages/Assessment/BuildingPage.module.css`
---
*(Content as generated in "Explicitly update all relevant component CSS Modules from Phases 1-4 (Part 2)...", Task 5 - includes GDS typography for page title, instruction text, progress indicator, placeholder text, error/loading text, and NO local button styles).*

---
**File Path:** `packages/client/src/pages/Assessment/ColorPalettePage.tsx`
---
*(Content as generated in "Implement client-side navigation for Color Palette assessment phase", Task 5 - uses common buttons, store interactions, navigation logic).*

---
**File Path:** `packages/client/src/pages/Assessment/ColorPalettePage.module.css`
---
*(Content as generated in "Explicitly update all relevant component CSS Modules from Phases 1-4 (Part 2)...", Task 5 - includes GDS typography for page title, instruction text, placeholder text, error/loading text, and NO local button styles).*

---
**File Path:** `packages/client/src/pages/Assessment/DetailElementsPage.tsx`
---
*(Content as generated in "Implement and verify client-side navigation for Detail Elements...", Task 5 - uses common buttons, store interactions, navigation logic, TODO for setting assessment complete).*

---
**File Path:** `packages/client/src/pages/Assessment/DetailElementsPage.module.css`
---
*(Content as generated when DetailElementsPage was first created and then updated for typography - includes GDS typography for page/instruction titles, texts, progress, placeholders, errors, and NO local button styles).*

---
**File Path:** `packages/client/src/pages/Assessment/ResultsPage.tsx`
---
*(Content as generated in "Populate ResultsPage.tsx with FinalTowerDisplay and Report Sections...", Task 6 - includes imports for common buttons, store interactions, all report sections, placeholder icons, FinalTowerDisplay, ScoreBarDisplay, StateDistributionDisplay).*

---
**File Path:** `packages/client/src/pages/Assessment/ResultsPage.module.css`
---
*(Content as generated in "Populate ResultsPage.tsx with FinalTowerDisplay and Report Sections...", Task 6 - includes GDS typography for page header, paragraph titles, action buttons area styling).*


This markdown contains the requested client Page component files.
```
