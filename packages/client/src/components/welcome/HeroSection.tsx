import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  // TODO (Accessibility): Consider using useReducedMotion() from Framer Motion
  // to disable or simplify the floating animation if prefers-reduced-motion is active.
  // Example:
  // const shouldReduceMotion = useReducedMotion();
  // const yAnimation = shouldReduceMotion ? ["0px", "0px"] : ["-5px", "5px", "-5px"];
  // animate={{ y: yAnimation }}

  return (
    <section className={styles.heroSection}>
      <motion.div
        className={styles.towerPreviewPlaceholder}
        animate={{
          y: ["-5px", "5px", "-5px"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <p>Animated Tower Preview (300x400)</p>
      </motion.div>
      <div className={styles.descriptionContainer}>
        <p className={styles.descriptionText}>
          Welcome to Inner DNA! Embark on a visual journey to construct your unique personality tower. {/* UPDATED */}
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
