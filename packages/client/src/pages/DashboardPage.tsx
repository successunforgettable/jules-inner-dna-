import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../contexts/store/useAuthStore'; // Adjusted path based on common structure
import PrimaryButton from '../components/common/buttons/PrimaryButton';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.name || user?.email || 'User';

  // Placeholder for loading state if user data is fetched async on this page
  // For now, assumes user data is already available from useAuthStore after login/refresh
  if (!user) {
    return (
        <div className={styles.dashboardPage}>
            <h1 className={styles.welcomeMessage}>Welcome!</h1>
            <p className={styles.placeholderText}>Loading user information or please log in to view your dashboard.</p>
            {/* Optionally, include a Link to login page if not automatically redirected by ProtectedRoute */}
        </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <h1 className={styles.welcomeMessage}>Welcome back, {displayName}!</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          <PrimaryButton
            onClick={() => console.log('Start New Inner DNA Assessment clicked')} // Placeholder action
            size="large"
          >
            Start New Inner DNA Assessment
          </PrimaryButton>
          {/* TODO: Conditionally show this link based on assessment history (e.g., if userProfile.assessments.length > 0) */}
          <Link to="/assessment/results" className={styles.actionLink}>
            View My Latest Report
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        {/* TODO: Replace with actual list of recent assessments or activity feed */}
        <p className={styles.placeholderText}>Your recent assessment activity will appear here.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        {/* TODO: Replace with actual statistics from user profile or aggregated assessment data */}
        <p className={styles.placeholderText}>Total Assessments Taken: [X]</p>
        <p className={styles.placeholderText}>Last Assessment Date: [Date]</p>
      </section>
    </div>
  );
};

export default DashboardPage;
