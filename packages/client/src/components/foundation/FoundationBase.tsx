import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FoundationBase.module.css';
import { StoneProps as IndividualStoneProps } from './Stone';
import clsx from 'clsx';

export interface FoundationBaseProps {
  selectedStones: (IndividualStoneProps | null)[]; // Array of up to 9, null for unselected sets
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const PlacedStone: React.FC<{ stoneData: IndividualStoneProps; index: number; totalStonesOnBase: number; baseRadius: number }> = ({ stoneData, index, totalStonesOnBase, baseRadius }) => {
  // Calculate position on a circle.
  // Angle offset by -PI/2 to start placing from the top (12 o'clock).
  const angle = (index / Math.max(1, totalStonesOnBase)) * 2 * Math.PI - Math.PI / 2;

  // Adjust radius to prevent placed stones from being cut off at the edge of the base.
  // This depends on the size of the PlacedStone itself.
  const placedStoneRadius = parseInt(styles.placedStoneSizeDefault, 10) / 2 || 10; // Get size from CSS variable or default
  const effectiveRadius = baseRadius - placedStoneRadius - 5; // 5px padding from edge

  const x = effectiveRadius * Math.cos(angle);
  const y = effectiveRadius * Math.sin(angle);

  return (
    <motion.div
      className={styles.placedStone}
      style={{
        background: stoneData.gradientStyle || 'var(--ui-accent-secondary)',
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        // transform: 'translate(-50%, -50%)', // Centering is now part of the CSS
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      title={stoneData.content.join(' & ')}
    >
      {/* Minimal content, e.g., first letter or a symbol, or just color */}
      {/* {stoneData.content[0]?.charAt(0).toUpperCase()} */}
    </motion.div>
  );
};

const FoundationBase: React.FC<FoundationBaseProps> = ({
  selectedStones,
  sizeContext = 'desktop',
}) => {
  const actualSelectedStones = selectedStones.filter(s => s !== null) as IndividualStoneProps[];

  // Determine base radius based on size context for PlacedStone positioning
  // These should roughly match half the diameter defined in CSS.
  let baseRadius = 150; // Default for desktop (half of 300-320px)
  if (sizeContext === 'tablet') baseRadius = 120; // Half of 240-250px
  if (sizeContext === 'mobile') baseRadius = 100; // Half of 200-220px


  return (
    <div className={clsx(styles.foundationBaseWrapper, styles[sizeContext])}>
      <div className={styles.baseCircle}>
        <AnimatePresence>
          {actualSelectedStones.map((stone, index) => (
            <PlacedStone
              key={stone.id} // Assuming stone.id is unique for each selected stone
              stoneData={stone}
              index={index}
              totalStonesOnBase={actualSelectedStones.length}
              baseRadius={baseRadius}
            />
          ))}
        </AnimatePresence>
        {actualSelectedStones.length === 0 && (
          <p className={styles.emptyBaseText}>Your Foundation Stones Will Appear Here</p>
        )}
      </div>
    </div>
  );
};

export default FoundationBase;
