import React from 'react';
import styles from './Header.module.css';
// import { Link } from 'react-router-dom'; // Will be used when routing is set up

// Placeholder for authentication status (to be replaced by actual auth context/store)
const isAuthenticated = false;

const Header: React.FC = () => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContainer}>
        {/* <Link to="/" className={styles.logoTitle}>Inner DNA</Link> */}
        <a href="/" className={styles.logoTitle}>Inner DNA</a> {/* Placeholder Link */}

        <nav className={styles.navigation}>
          {isAuthenticated ? (
            <>
              {/* <Link to="/profile" className={styles.navLink}>My Profile</Link> */}
              {/* <Link to="/logout" className={styles.navLink}>Logout</Link> */}
              <a href="/profile" className={styles.navLink}>My Profile</a> {/* Placeholder Link */}
              <a href="/logout" className={styles.navLink}>Logout</a> {/* Placeholder Link */}
            </>
          ) : (
            <>
              {/* <Link to="/login" className={styles.navLink}>Login</Link> */}
              {/* <Link to="/register" className={styles.navLink}>Register</Link> */}
              <a href="/login" className={styles.navLink}>Login</a> {/* Placeholder Link */}
              <a href="/register" className={styles.navLink}>Register</a> {/* Placeholder Link */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
