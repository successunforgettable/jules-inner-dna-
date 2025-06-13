// Header.tsx - Updated with "Inner DNA" and Link components
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import useAuthStore from '../../contexts/store/useAuthStore';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import LinkButton from '../common/buttons/LinkButton';

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutUser = useAuthStore((state) => state.logout);
  const isAssessmentComplete = useAssessmentStore((state) => state.isAssessmentComplete);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    useAssessmentStore.getState().resetAssessment();
    navigate('/');
  };

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logoTitle}>Inner DNA</Link> {/* UPDATED */}

        <nav className={styles.navigation}>
          {isAuthenticated ? (
            <>
              {isAssessmentComplete ? (
                <Link to="/assessment/results" className={styles.navLink}>View Results</Link>
              ) : (
                <Link to="/assessment/foundation" className={styles.navLink}>Start/Continue Assessment</Link>
              )}
              <Link to="/profile" className={styles.navLink}>My Profile</Link>
              <LinkButton onClick={handleLogout} className={styles.navLink}>
                Logout
              </LinkButton>
            </>
          ) : (
            <>
              <Link to="/" className={styles.navLink}>Login / Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
