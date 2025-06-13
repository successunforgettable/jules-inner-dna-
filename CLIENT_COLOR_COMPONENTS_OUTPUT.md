## Client-Side Color Palette Experience Components

This document contains the content of components related to the Color Palette selection experience, found in `packages/client/src/components/color/`.

---
**File Path:** `packages/client/src/components/color/ColorPaletteCard.tsx`
---
```tsx
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
}

const ColorPaletteCard: React.FC<ColorPaletteCardProps> = ({
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

  // TODO (Accessibility): Consider useReducedMotion() for checkmark animation
  // const shouldReduceMotion = useReducedMotion();
  // const checkmarkTransition = shouldReduceMotion ? { duration: 0.01 } : { duration: 0.25 };


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
        scale: 1.05,
        boxShadow: "var(--shadow-interactive-hover)"
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

export default ColorPaletteCard;
```

---
**File Path:** `packages/client/src/components/color/ColorPaletteCard.module.css`
---
```css
/* ColorPaletteCard.module.css - Typography uses GDS vars */
.paletteCard {
  display: flex; flex-direction: column; justify-content: space-between;
  padding: var(--space-md); border: 2px solid var(--ui-border-interactive);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-block);
  cursor: pointer; position: relative; overflow: hidden;
  color: var(--ui-text-on-dark); /* Default, assuming gradients are generally dark enough */
  transition: transform var(--animation-duration-short) ease-out,
              box-shadow var(--animation-duration-short) ease-out,
              opacity var(--animation-duration-medium) ease,
              border-color var(--animation-duration-short) ease-in-out; /* Added border-color */
}
.mobile { width: 100%; min-height: 80px; flex-direction: row; align-items: center; justify-content: flex-start; gap: var(--space-md); }
.tablet { width: 180px; height: 110px; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.desktop { width: 200px; height: 120px; flex-direction: column; justify-content: center; align-items: center; text-align: center; }

.textContainer { display: flex; flex-direction: column; gap: var(--space-xxs); z-index: 1; }
.mobile .textContainer { text-align: left; }

.stateName { /* Body Large (semibold) */
  font-size: var(--font-size-body-large-mobile);
  line-height: var(--line-height-body-large);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 0; /* Override global heading margin */
}
.description { /* Caption for mobile, Body Small for desktop/tablet */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-regular);
  opacity: 0.85;
  margin-bottom: 0; /* Override global p margin */
}

.tablet .stateName,
.desktop .stateName {
  font-size: var(--font-size-body-large-desktop);
}
.tablet .description,
.desktop .description {
  font-size: var(--font-size-body-small-desktop);
  line-height: var(--line-height-body-small);
}

.selected {
  border-color: var(--ui-accent-primary);
  box-shadow: 0 0 15px 4px var(--ui-accent-primary), var(--shadow-block);
  /* transform: scale(1.02); /* Framer motion handles hover scale, selected scale can be subtle if desired */
}
/* .selected:hover { transform: scale(1.07); } /* Framer motion handles hover scale */

.disabled {
  opacity: 0.5; cursor: not-allowed;
  background: var(--ui-border-container-empty);
  color: var(--ui-text-secondary);
  border-color: transparent;
  box-shadow: none;
}

.checkmarkIconWrapper {
  position: absolute; top: var(--space-xs); right: var(--space-xs);
  background-color: rgba(var(--ui-accent-primary-rgb), 0.6);
  border-radius: var(--radius-circular); padding: 3px;
  display: flex; align-items: center; justify-content: center;
  z-index: 2; border: 1px solid rgba(var(--ui-text-on-dark-rgb),0.6);
}
.checkmarkIcon { width: 16px; height: 16px; color: var(--ui-text-on-dark); stroke-width: 3; }

.mobile .checkmarkIconWrapper {
  top: 50%; transform: translateY(-50%);
  right: var(--space-sm);
}
```

---
**File Path:** `packages/client/src/components/color/PaletteSelector.tsx`
---
```tsx
import React from 'react';
import ColorPaletteCard, { ColorPaletteCardProps } from './ColorPaletteCard';
import styles from './PaletteSelector.module.css';
import { PaletteInfo, PaletteInfoForDisplay } from '../../lib/colorPaletteData';

export interface PaletteSelectorProps {
  palettesData: PaletteInfoForDisplay[]; // Expects type-specific data now
  selectedPaletteIds: (string | number)[];
  onPaletteSelect: (id: string | number) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const PaletteSelector: React.FC<PaletteSelectorProps> = ({
  palettesData,
  selectedPaletteIds,
  onPaletteSelect,
  sizeContext = 'desktop',
}) => {
  const maxSelections = 2;

  return (
    <div className={styles.paletteSelectorContainer}>
      {palettesData.map((palette) => {
        const isSelected = selectedPaletteIds.includes(palette.id);
        const isDisabled = selectedPaletteIds.length >= maxSelections && !isSelected;

        // Map PaletteInfoForDisplay to ColorPaletteCardProps
        const cardProps: ColorPaletteCardProps = {
          id: palette.id,
          stateName: palette.stateName,
          description: palette.description, // This is now type-specific
          gradientStyle: palette.gradientStyle, // This is now type-specific (potentially)
          isSelected: isSelected,
          onSelect: onPaletteSelect,
          isDisabled: isDisabled,
          sizeContext: sizeContext,
        };

        return <ColorPaletteCard key={palette.id} {...cardProps} />;
      })}
    </div>
  );
};

export default PaletteSelector;
```

---
**File Path:** `packages/client/src/components/color/PaletteSelector.module.css`
---
```css
/* PaletteSelector.module.css */
.paletteSelectorContainer {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: var(--max-width-palette-container);
  margin: 0 auto;
  padding: var(--space-sm);
}

@media (min-width: 600px) {
  .paletteSelectorContainer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-lg);
  }
}

@media (min-width: 900px) {
  .paletteSelectorContainer {
    /* Max width for 3 desktop cards by default if GDS var --max-width-palette-container is set for that */
    /* Or adjust grid for 5 items if desired: grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
    /* max-width: calc( (200px * 5) + (var(--space-lg) * 4) ); /* If wanting all 5 in a row */
  }
}
```

---
**File Path:** `packages/client/src/components/color/DistributionSlider.tsx`
---
```tsx
import React, { useMemo } from 'react';
import styles from './DistributionSlider.module.css';
import { PaletteInfo, PaletteInfoForDisplay } from '../../lib/colorPaletteData'; // Use PaletteInfoForDisplay
import clsx from 'clsx';

interface DistributionSliderProps {
  selectedPalettes: [PaletteInfoForDisplay | null, PaletteInfoForDisplay | null];
  distribution: number;
  onDistributionChange: (newPrimaryPercentage: number) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const DistributionSlider: React.FC<DistributionSliderProps> = ({
  selectedPalettes,
  distribution,
  onDistributionChange,
  sizeContext = 'desktop',
}) => {
  const paletteA = selectedPalettes[0];
  const paletteB = selectedPalettes[1];

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDistributionChange(parseInt(event.target.value, 10));
  };

  const sliderTrackGradient = useMemo(() => {
    if (!paletteA || !paletteB) {
      return 'linear-gradient(to right, var(--ui-border-container-empty), var(--ui-border-container-empty))';
    }
    // Using primaryColor from PaletteInfo, which should be a direct CSS color value or var()
    const colorA = paletteA.primaryColor || 'var(--ui-accent-secondary)';
    const colorB = paletteB.primaryColor || 'var(--ui-text-secondary)';

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
        <span className={styles.paletteLabelA} style={{ color: paletteA.primaryColor }}>{paletteA.stateName}: {percentageA}%</span>
        <span className={styles.paletteLabelB} style={{ color: paletteB.primaryColor }}>{paletteB.stateName}: {percentageB}%</span>
      </div>
      <div className={styles.sliderTrackContainer}>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={distribution}
          onChange={handleSliderChange}
          className={styles.slider}
          style={{ background: sliderTrackGradient }}
          aria-label={`Distribution between ${paletteA.stateName} and ${paletteB.stateName}`}
        />
      </div>
    </div>
  );
};

export default DistributionSlider;
```

---
**File Path:** `packages/client/src/components/color/DistributionSlider.module.css`
---
```css
/* DistributionSlider.module.css - Typography uses GDS vars */
.sliderContainerWrapper {
  width: 100%; max-width: var(--max-width-content-s, 500px);
  margin: var(--space-lg) auto; padding: var(--space-md);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-dropdown);
}
.paletteLabels {
  display: flex; justify-content: space-between; margin-bottom: var(--space-sm);
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-medium);
  /* color: var(--ui-text-secondary); /* Individual labels can set their own color now */
}
@media (min-width: 768px) {
  .paletteLabels { font-size: var(--font-size-body-small-desktop); }
}

.paletteLabelA { /* Example, color is now inline */ }
.paletteLabelB { /* Example, color is now inline */ }

.sliderTrackContainer { width: 100%; padding: var(--space-xs) 0; }
.slider {
  -webkit-appearance: none; appearance: none; width: 100%;
  cursor: grab; outline: none; border-radius: var(--radius-pill);
  transition: background var(--animation-duration-short) ease-in-out;
}
.desktop .slider { height: 20px; }
.tablet .slider  { height: 18px; }
.mobile .slider  { height: 16px; }

.slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 32px; height: 32px;
  background: var(--ui-text-on-dark); border-radius: var(--radius-circular);
  border: 2px solid var(--ui-accent-primary); box-shadow: var(--shadow-token);
}
.desktop .slider::-webkit-slider-thumb { margin-top: -6px; }
.tablet .slider::-webkit-slider-thumb  { margin-top: -7px; }
.mobile .slider::-webkit-slider-thumb  { margin-top: -8px; }

.slider::-moz-range-thumb {
  width: 30px; height: 30px; background: var(--ui-text-on-dark);
  border-radius: var(--radius-circular); border: 2px solid var(--ui-accent-primary);
  box-shadow: var(--shadow-token); cursor: grab;
}
.slider:focus {} /* Rely on :focus-visible for thumb */
.slider::-webkit-slider-thumb:focus-visible { outline: 2px solid var(--ui-accent-secondary); outline-offset: 2px; }
.slider::-moz-range-thumb:focus-visible { outline: 2px solid var(--ui-accent-secondary); outline-offset: 2px; }

.placeholder {
  text-align: center; padding: var(--space-lg);
  color: var(--ui-text-secondary); font-style: italic;
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  font-weight: var(--font-weight-regular);
}
@media (min-width: 768px) {
  .placeholder { font-size: var(--font-size-body-main-desktop); }
}
```

This markdown contains the requested Color Palette component files.
```
