import React from 'react';
import styles from './WelcomeHeader.module.css';

const WelcomeHeader: React.FC = () => {
  return (
    <header className={styles.welcomeHeader}>
      <h1 className={styles.logoTitle}>Inner DNA</h1>
      <p className={styles.subtitle}>Build Your Personality Tower</p>
    </header>
  );
};

export default WelcomeHeader;
