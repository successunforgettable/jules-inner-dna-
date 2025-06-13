// Footer.tsx - Updated with "Inner DNA" and Link components
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerContainer}>
        <p className={styles.copyrightText}>
          &copy; {currentYear} Inner DNA. All rights reserved. {/* UPDATED */}
        </p>
        <div className={styles.footerLinks}>
          <Link to="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
          <Link to="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
