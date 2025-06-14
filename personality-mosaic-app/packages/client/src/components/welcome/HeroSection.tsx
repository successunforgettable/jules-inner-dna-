import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <motion.div
        className={styles.towerPreviewPlaceholder}
        animate={{
          y: ["-5px", "5px", "-5px"], // Floating effect
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          // yoyo: Infinity, // yoyo is implicit with array values for animate
        }}
      >
        <svg width="300" height="400" aria-label="Animated Tower Preview">
          <rect width="300" height="400" fill="var(--ui-accent-secondary)" />
        </svg>
      </motion.div>
      <div className={styles.descriptionContainer}>
        <p className={styles.descriptionText}>
          Welcome to Inner DNA! Embark on a visual journey to construct your unique personality tower.
          Each choice, from foundational stones to intricate details, contributes to a personalized structure
          reflecting your core traits, operational states, and how you navigate the world.
          Discover your architectural self.
        </p>
        <p className={styles.timeEstimate}>
          Estimated time to complete: 5-7 minutes
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
