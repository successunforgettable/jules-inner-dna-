import React, { useState, useEffect } from 'react';
import WelcomeLayout from '../components/welcome/WelcomeLayout';
import WelcomeHeader from '../components/welcome/WelcomeHeader';
import HeroSection from '../components/welcome/HeroSection';
import FeatureHighlights from '../components/welcome/FeatureHighlights';
import CallToActionSection from '../components/welcome/CallToActionSection';
import LoginModal from '../components/auth/LoginModal';
import RegistrationModal from '../components/auth/RegistrationModal';
import useAuthStore, { UserProfile } from '../contexts/store/useAuthStore'; // Import the store and UserProfile type
import styles from './WelcomePage.module.css';

const WelcomePage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Get actions and state from useAuthStore
  const loginSuccess = useAuthStore((state) => state.loginSuccess);
  const registerSuccess = useAuthStore((state) => state.registerSuccess);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // For potential UI changes

  // Example: Close modals if user becomes authenticated through other means (e.g. auto-login via persisted state)
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginModalOpen(false);
      setIsRegisterModalOpen(false);
    }
  }, [isAuthenticated]);

  const openLoginModal = () => {
    setError(null); // Clear previous errors
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setError(null); // Clear previous errors
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleApiCallStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoginSubmit = async (apiCall: () => Promise<{ accessToken: string; user: UserProfile }>) => {
    handleApiCallStart();
    try {
      const data = await apiCall();
      loginSuccess(data); // Update Zustand store
      closeLoginModal();
    } catch (err: any) {
      // Error is typically set within the modal's API call logic,
      // but we can also set a general error or use setError from store here.
      // For now, assuming modal handles displaying specific errors.
      // setError(err.message || 'Login failed');
      console.error("Login failed on Welcome Page:", err);
      // setError will be called within the modal itself using the store directly or via prop
    } finally {
      // setLoading(false); // Also handled within modal or by store based on setError
    }
  };

  const handleRegisterSubmit = async (apiCall: () => Promise<any>) => {
    handleApiCallStart();
    try {
      await apiCall();
      registerSuccess(); // Update Zustand store
      closeRegisterModal();
      // Optionally, prompt user to login or auto-open login modal
      openLoginModal(); // Example: open login after successful registration
    } catch (err:any) {
      // setError(err.message || 'Registration failed');
      console.error("Registration failed on Welcome Page:", err);
    } finally {
      // setLoading(false);
    }
  };


  // The actual API call logic will be within LoginModal and RegistrationModal.
  // WelcomePage will just handle the success/failure callbacks to update global state.

  return (
    <WelcomeLayout>
      <div className={styles.contentWrapper}>
        <WelcomeHeader />
        <HeroSection />
        <div id="feature-highlights-section">
          <FeatureHighlights />
        </div>
        <CallToActionSection
          onBeginAssessmentClick={isAuthenticated ? () => console.log("Navigate to assessment") : openRegisterModal}
          onLoginClick={isAuthenticated ? () => console.log("Navigate to profile/logout") : openLoginModal}
        />
         {isAuthenticated && <p>Welcome back, {useAuthStore.getState().user?.email}!</p>}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={() => {
          closeLoginModal();
          openRegisterModal();
        }}
        // Pass a function that LoginModal can call on successful API response
        // This function will then interact with the auth store.
        onLoginSuccess={(data) => {
          loginSuccess(data); // Update store
          closeLoginModal();  // Close modal
        }}
      />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onSwitchToLogin={() => {
          closeRegisterModal();
          openLoginModal();
        }}
        // Pass a function for successful registration
        onRegistrationSuccess={() => {
          registerSuccess(); // Update store (mainly clears loading/error)
          closeRegisterModal();
          // Optionally: show a message "Registration successful! Please login."
          // Then open login modal:
          openLoginModal();
        }}
      />
    </WelcomeLayout>
  );
};

export default WelcomePage;
