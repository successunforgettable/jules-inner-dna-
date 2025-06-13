import React from 'react';
import styles from './WelcomeHeader.module.css';

const WelcomeHeaderNew: React.FC = () => { // Renamed
  return (
    <header className={styles.welcomeHeader}>
      <h1 className={styles.logoTitle}>Inner DNA</h1> {/* UPDATED */}
      <p className={styles.subtitle}>Build Your Personality Tower</p>
    </header>
  );
};

export default WelcomeHeaderNew; // Renamed
