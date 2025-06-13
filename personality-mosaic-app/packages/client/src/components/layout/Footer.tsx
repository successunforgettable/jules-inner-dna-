import React from 'react';
import styles from './Footer.module.css';
// import { Link } from 'react-router-dom'; // For future routing

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContainer}>
        <p className={styles.copyrightText}>
          &copy; {currentYear} Inner DNA. All rights reserved.
        </p>
        <div className={styles.footerLinks}>
          {/* Placeholder Links - will be replaced with <Link> from react-router-dom */}
          <a href="/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
          <a href="/terms-of-service" className={styles.footerLink}>Terms of Service</a>
          {/* <Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link> */}
          {/* <Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
