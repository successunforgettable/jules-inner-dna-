// Content of Stone.tsx - Updated with GDS variable for whileHover boxShadow
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Stone.module.css';
import clsx from 'clsx';
import CheckmarkIcon from '../../assets/icons/CheckmarkIcon';

export interface StoneProps {
  id: string;
  content: string[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  gradientStyle: string;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
  ariaLabel: string;
  isDisabled?: boolean;
}

const Stone: React.FC<StoneProps> = ({ // Corrected component name
  id,
  content,
  isSelected,
  onSelect,
  gradientStyle,
  sizeContext = 'desktop',
  ariaLabel,
  isDisabled = false,
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(id);
    }
  };

  // A helper to convert CSS ms time to seconds for Framer Motion, if needed.
  // This is a bit of an over-optimization for this step, as direct values are fine.
  // const getDurationInSeconds = (cssVarName: string, defaultValue: number): number => {
  //   if (typeof window !== 'undefined') { // Ensure it runs only in browser context
  //     try {
  //       const value = getComputedStyle(document.documentElement).getPropertyValue(cssVarName);
  //       if (value.endsWith('ms')) return parseFloat(value) / 1000;
  //       if (value.endsWith('s')) return parseFloat(value);
  //     } catch (e) { /* Fallback if var not found or parsing error */ }
  //   }
  //   return defaultValue;
  // };
  // const shortDuration = getDurationInSeconds('--animation-duration-short', 0.25);

  return (
    <motion.div
      className={clsx(
        styles.stone,
        styles[sizeContext],
        isSelected && styles.selected,
        isDisabled && styles.disabled
      )}
      style={{ background: gradientStyle }}
      onClick={handleClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && !isDisabled && handleClick()}
      role="button"
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      whileHover={!isDisabled ? {
        scale: 1.05,
        boxShadow: "var(--shadow-interactive-hover)" // UPDATED to use GDS variable
      } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={styles.contentWrapper}>
        {content.map((line, index) => (
          <span key={index} className={styles.textLine}>{line}</span>
        ))}
      </div>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className={styles.checkmarkIconWrapper}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }} // Using 0.25s (250ms), aligns with --animation-duration-short
          >
            <CheckmarkIcon className={styles.checkmarkIcon} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Stone; // Corrected export name
```
