import React from 'react';
import styles from './WelcomeLayout.module.css';

interface WelcomeLayoutProps {
  children: React.ReactNode;
}

const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({ children }) => {
  return (
    <div className={styles.welcomeLayout}>
      <div className={styles.maxWidthContainer}>
        {children}
      </div>
    </div>
  );
};

export default WelcomeLayout;
