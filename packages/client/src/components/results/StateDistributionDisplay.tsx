import React from 'react';
import styles from './StateDistributionDisplay.module.css';

export interface StateDistributionDisplayProps {
  distribution: {
    primaryStateName: string;
    primaryPercentage: number;
    secondaryStateName: string;
    secondaryPercentage: number;
  };
  paletteColors: { // Actual hex/CSS var strings for the selected palettes' primary colors
    primary: string;
    secondary: string;
  };
  title?: string;
}

const StateDistributionDisplay: React.FC<StateDistributionDisplayProps> = ({
  distribution,
  paletteColors,
  title,
}) => {
  const {
    primaryStateName, primaryPercentage,
    secondaryStateName, secondaryPercentage
  } = distribution;

  // Ensure percentages are within 0-100 for safety
  const primPercent = Math.max(0, Math.min(primaryPercentage, 100));
  const secPercent = Math.max(0, Math.min(secondaryPercentage, 100));

  // Style for the primary segment of the bar
  const primaryStyle: React.CSSProperties = {
    width: `${primPercent}%`,
    backgroundColor: paletteColors.primary, // Use the actual color string
  };

  // Style for the secondary segment of the bar
  const secondaryStyle: React.CSSProperties = {
    width: `${secPercent}%`,
    backgroundColor: paletteColors.secondary, // Use the actual color string
  };

  return (
    <div className={styles.stateDistributionContainer}>
      {title && <h3 className={styles.displayTitle}>{title}</h3>}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.colorSwatch} style={{ backgroundColor: paletteColors.primary }} />
          <span className={styles.stateName}>{primaryStateName}:</span>
          <span className={styles.percentage}>{primPercent}%</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.colorSwatch} style={{ backgroundColor: paletteColors.secondary }} />
          <span className={styles.stateName}>{secondaryStateName}:</span>
          <span className={styles.percentage}>{secPercent}%</span>
        </div>
      </div>
      <div className={styles.distributionBar}>
        <div className={styles.barSegmentPrimary} style={primaryStyle} role="presentation" />
        <div className={styles.barSegmentSecondary} style={secondaryStyle} role="presentation" />
      </div>
    </div>
  );
};

export default StateDistributionDisplay;
