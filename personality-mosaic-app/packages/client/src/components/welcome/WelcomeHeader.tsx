import React from 'react';
import styles from './WelcomeHeader.module.css';

const WelcomeHeader: React.FC = () => {
  return (
    <header className={styles.welcomeHeader}>
      <h1 className={styles.logoTitle}>Personality Mosaic</h1>
      <p className={styles.subtitle}>Build a personalized tower that reveals your personality type, motivations, and growth path</p>
    </header>
  );
};

export default WelcomeHeader;
