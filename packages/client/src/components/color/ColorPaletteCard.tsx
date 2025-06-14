// Content of ColorPaletteCard.tsx - Updated with GDS variable
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ColorPaletteCard.module.css';
import clsx from 'clsx';
import CheckmarkIcon from '../../assets/icons/CheckmarkIcon';

export interface ColorPaletteCardProps {
  id: string | number;
  stateName: string;
  description: string;
  gradientStyle: string;
  isSelected: boolean;
  onSelect: (id: string | number) => void;
  isDisabled?: boolean;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
  // TODO: Spec 4.2.1 mentions "color swatches specific to each state".
  // This would require passing an array of colors and rendering them as child elements,
  // which is a structural change beyond the current scope. The card currently displays one overall gradient.
}

const ColorPaletteCard: React.FC<ColorPaletteCardProps> = ({ // Corrected component name
  id,
  stateName,
  description,
  gradientStyle,
  isSelected,
  onSelect,
  isDisabled = false,
  sizeContext = 'desktop',
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(id);
    }
  };

  return (
    <motion.div
      className={clsx(
        styles.paletteCard,
        styles[sizeContext],
        isSelected && styles.selected,
        isDisabled && styles.disabled
      )}
      style={{ background: gradientStyle }}
      onClick={handleClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && !isDisabled && handleClick()}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${stateName}: ${description}`}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      whileHover={!isDisabled ? {
        scale: 1.03, // Spec 4.2.1: Scale to 1.03x
        boxShadow: "var(--shadow-interactive-hover)" // UPDATED to use GDS variable
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className={styles.textContainer}>
        <h3 className={styles.stateName}>{stateName}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className={styles.checkmarkIconWrapper}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }} // Aligns with --animation-duration-short
          >
            <CheckmarkIcon className={styles.checkmarkIcon} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ColorPaletteCard; // Corrected export name
```
