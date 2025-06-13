import React, { useMemo } from 'react';
import styles from './DistributionSlider.module.css';
import { PaletteInfo } from '../../lib/colorPaletteData';
import clsx from 'clsx';

interface DistributionSliderProps {
  // Expects exactly two selected palettes
  selectedPalettes: [PaletteInfo | null, PaletteInfo | null];
  distribution: number; // Percentage for the first palette (0-100), second is 100-distribution
  onDistributionChange: (newPrimaryPercentage: number) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const DistributionSlider: React.FC<DistributionSliderProps> = ({
  selectedPalettes,
  distribution, // Represents percentage of the first palette (paletteA)
  onDistributionChange,
  sizeContext = 'desktop',
}) => {
  const paletteA = selectedPalettes[0];
  const paletteB = selectedPalettes[1];

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDistributionChange(parseInt(event.target.value, 10));
  };

  // Create the gradient for the slider track based on the two selected palettes
  const sliderTrackGradient = useMemo(() => {
    if (!paletteA || !paletteB) {
      // Default gradient if one or both palettes are missing (should not happen if component is rendered correctly)
      return 'linear-gradient(to right, var(--ui-border-container-empty), var(--ui-border-container-empty))';
    }
    // Use the actual gradientStyle from palette for a more representative blend
    // This is complex as gradients can have multiple stops.
    // Simplification: use primary representative colors from PaletteInfo if available,
    // or fallback to a simpler interpretation of their gradientStyle.
    // For now, let's assume paletteA.gradientStyle and paletteB.gradientStyle are simple enough
    // to be used in a combined gradient, or we extract their dominant colors.
    // A very simplified approach:
    const colorA = paletteA.primaryColor || 'var(--ui-accent-secondary)'; // Fallback
    const colorB = paletteB.primaryColor || 'var(--ui-text-secondary)';   // Fallback

    return `linear-gradient(to right, ${colorA} 0%, ${colorA} ${distribution}%, ${colorB} ${distribution}%, ${colorB} 100%)`;
  }, [paletteA, paletteB, distribution]);


  if (!paletteA || !paletteB) {
    return <div className={styles.placeholder}>Select two palettes to define their distribution.</div>;
  }

  const percentageA = distribution;
  const percentageB = 100 - distribution;

  return (
    <div className={clsx(styles.sliderContainerWrapper, styles[sizeContext])}>
      <div className={styles.paletteLabels}>
        <span className={styles.paletteLabelA}>{paletteA.stateName}: {percentageA}%</span>
        <span className={styles.paletteLabelB}>{paletteB.stateName}: {percentageB}%</span>
      </div>
      <div className={styles.sliderTrackContainer}>
        <input
          type="range"
          min="0"
          max="100"
          step="1" // Or 5 for coarser adjustments
          value={distribution}
          onChange={handleSliderChange}
          className={styles.slider}
          style={{ background: sliderTrackGradient }} // Apply dynamic gradient to track
          aria-label={`Distribution between ${paletteA.stateName} and ${paletteB.stateName}`}
        />
      </div>
    </div>
  );
};

export default DistributionSlider;
