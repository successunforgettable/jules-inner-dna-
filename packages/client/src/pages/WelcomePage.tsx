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
import useAssessmentStore from '../contexts/store/useAssessmentStore'; // Import assessment store
import { sendGAEvent } from '../../lib/analytics'; // Import GA event sender
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
  const { registerSuccess: registerSuccessAction } = useAuthStore.getState(); // For actions not needing re-render

  // Get assessment completion status
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
    // If assessment is complete, user might prefer to go to results directly after login
    if (isAssessmentComplete) {
      navigate('/assessment/results');
    } else {
      // navigate('/assessment/foundation'); // Or let them choose from Welcome Page
    }
  };

  const handleRegistrationSuccess = () => {
    registerSuccessAction();
    closeRegisterModal();
    openLoginModal();
  };

  const handleBeginOrViewResultsClick = () => {
    if (isAuthenticated) {
      if (isAssessmentComplete) {
        navigate('/assessment/results');
      } else {
        // This is where a new assessment effectively starts or resumes
        sendGAEvent('Assessment', 'Start', 'WelcomePageCTA');
        navigate('/assessment/foundation');
      }
    } else {
      openRegisterModal(); // Or openLoginModal() if returning user is more likely
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
          // Pass down the dynamic button text for the primary CTA
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
