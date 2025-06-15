import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for Quick Links
import styles from './AdminDashboardPage.module.css';
import PrimaryButton from '../../components/common/buttons/PrimaryButton'; // For Quick Links if styled as buttons

const AdminDashboardPage: React.FC = () => {
  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <p className={styles.welcomeText}>Welcome to the Admin Dashboard. Select a section to manage or view key statistics below.</p>

      {/* Summary Statistics Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Total Users</h3>
            <p className={styles.statValue}>[123]</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Assessments Completed</h3>
            <p className={styles.statValue}>[456]</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Pending Moderation</h3>
            <p className={styles.statValue}>[12]</p>
          </div>
          {/* Add more stat cards as needed */}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Links</h2>
        <div className={styles.quickLinksContainer}>
          <PrimaryButton
            onClick={() => console.log('Navigate to User Management')}
            // className={styles.quickLinkItem} // PrimaryButton does not take className directly, wrap if needed
            aria-label="Manage Users"
          >
            <Link to="/admin/users" className={styles.buttonLink}>Manage Users</Link>
          </PrimaryButton>
          <PrimaryButton
            onClick={() => console.log('Navigate to Content Management')}
            // className={styles.quickLinkItem}
            aria-label="Manage Content (Placeholder)"
          >
            {/* This Link can be added once the route exists */}
            {/* <Link to="/admin/content-management" className={styles.buttonLink}>Manage Content</Link> */}
            Manage Content (Placeholder)
          </PrimaryButton>
          {/* Add more quick links as needed */}
        </div>
      </section>
    </div>
  );
};
export default AdminDashboardPage;
