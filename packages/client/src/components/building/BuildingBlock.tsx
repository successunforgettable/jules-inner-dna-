// Content of BuildingBlock.tsx - Updated with GDS variable
import React from 'react';
import { motion } from 'framer-motion';
import styles from './BuildingBlock.module.css';
import clsx from 'clsx';

export interface BuildingBlockProps {
  id: string;
  content: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  textureVariation?: string;
  gradientStyle?: string;
  isDisabled?: boolean;
  ariaLabel?: string;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const BuildingBlock: React.FC<BuildingBlockProps> = ({ // Corrected component name
  id,
  content,
  isSelected,
  onSelect,
  textureVariation,
  gradientStyle,
  isDisabled = false,
  ariaLabel,
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
        styles.buildingBlock,
        styles[sizeContext],
        textureVariation && styles[textureVariation],
        isSelected && styles.selected,
        isDisabled && styles.disabled
      )}
      style={{ background: gradientStyle }}
      onClick={handleClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && !isDisabled && handleClick()}
      role="button"
      aria-pressed={isSelected}
      aria-label={ariaLabel || content}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      whileHover={!isDisabled ? {
        scale: 1.03,
        boxShadow: "var(--shadow-interactive-hover)" // UPDATED to use GDS variable
      } : {}}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      <span className={styles.contentText}>{content}</span>
    </motion.div>
  );
};

export default BuildingBlock; // Corrected export name
```
