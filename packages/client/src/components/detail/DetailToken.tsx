import React from 'react';
import { motion } from 'framer-motion';
import styles from './DetailToken.module.css';
import clsx from 'clsx';

export interface DetailTokenProps {
  id: string | number;
  gradientStyle: string;
  isPlaced?: boolean; // If true, it might have different styling or no animation
  onClick?: (id: string | number) => void;
  isDraggable?: boolean; // For potential future DnD, not used in click model
  title?: string; // For aria-label or tooltip
}

const DetailToken: React.FC<DetailTokenProps> = ({
  id,
  gradientStyle,
  isPlaced = false,
  onClick,
  isDraggable = false, // Not used in click model
  title = "Detail Token"
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  // Animation for unplaced tokens in the pool
  const unplacedAnimation = {
    scale: [1, 1.08, 1, 1.08, 1], // Subtle pulse
    transition: {
      duration: 2.5,
      ease: "easeInOut",
      repeat: Infinity,
      delay: Math.random() * 0.5 // Stagger animations slightly
    }
  };

  return (
    <motion.div
      className={clsx(styles.detailToken, isPlaced && styles.placed)}
      style={{ background: gradientStyle }}
      onClick={handleClick}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && handleClick()}
      role="button" // If clickable
      aria-label={title}
      tabIndex={onClick ? 0 : -1}
      // Conditionally apply animation only if not placed and not being dragged (for future)
      animate={!isPlaced && !isDraggable ? unplacedAnimation : {}}
      // Framer motion drag props (for future DnD consideration)
      // drag={isDraggable}
      // dragConstraints={{ current: refToDragBounds }} // Example
      // whileDrag={{ scale: 1.1, boxShadow: "var(--shadow-modal)" }}
    >
      {/* Tokens are primarily visual, may not contain text */}
    </motion.div>
  );
};

export default DetailToken;
