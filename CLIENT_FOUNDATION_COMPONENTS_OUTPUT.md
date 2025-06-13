## Client-Side Foundation Stone Experience Components

This document contains the content of components related to the Foundation Stone selection experience, found in `packages/client/src/components/foundation/`.

---
**File Path:** `packages/client/src/components/foundation/Stone.tsx`
---
```tsx
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

const Stone: React.FC<StoneProps> = ({
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

  // TODO (Accessibility): Consider using useReducedMotion() from Framer Motion
  // to make the checkmark appear/disappear instantly if prefers-reduced-motion is active.
  // const shouldReduceMotion = useReducedMotion();
  // const checkmarkTransition = shouldReduceMotion ? { duration: 0.01 } : { duration: 0.25 };

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
        boxShadow: "var(--shadow-interactive-hover)"
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
            transition={{ duration: 0.25 }} // Aligns with --animation-duration-short
          >
            <CheckmarkIcon className={styles.checkmarkIcon} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Stone;
```

---
**File Path:** `packages/client/src/components/foundation/Stone.module.css`
---
```css
/* Stone.module.css - Updated with GDS typography and animated box-shadow */
.stone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--ui-text-on-dark);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-md);
  border: 2px solid var(--ui-border-interactive);
  box-shadow: var(--shadow-stone); /* Base shadow */
  cursor: pointer;
  position: relative;
  overflow: visible;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  font-size: var(--font-size-interactive-text-mobile);
  line-height: var(--line-height-interactive-text);

  transition: opacity var(--animation-duration-medium, 400ms) ease,
              transform var(--animation-duration-short, 250ms) ease-in-out,
              box-shadow var(--animation-duration-short, 250ms) ease-in-out;
}

.desktop { width: 160px; height: calc(160px * 0.866 * 1.1); }
.tablet {
  width: 140px; height: calc(140px * 0.866 * 1.1);
  /* font-size for tablet uses mobile as base, overridden by media query if needed */
}
.mobile { width: 120px; height: calc(120px * 0.866 * 1.1); }

@media (min-width: 768px) {
  .stone { font-size: var(--font-size-interactive-text-desktop); }
}

.contentWrapper { z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.textLine { display: block; /* line-height is inherited */ }

.selected {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1), 0 0 12px 3px var(--ui-accent-primary), var(--shadow-stone);
  /* transform: scale(1.02); /* Optional: if selected should always be slightly larger */
}
.disabled { opacity: 0.6; cursor: not-allowed; }

.checkmarkIconWrapper {
  position: absolute; top: var(--space-xs); right: var(--space-xs);
  background-color: rgba(var(--ui-accent-primary-rgb), 0.5);
  border-radius: var(--radius-circular); padding: 3px;
  display: flex; align-items: center; justify-content: center;
  z-index: 2; border: 1px solid rgba(var(--ui-text-on-dark-rgb),0.5);
}
.checkmarkIcon { width: 16px; height: 16px; color: var(--ui-text-on-dark); stroke-width: 3; }

.tablet .checkmarkIconWrapper { padding: 2px; }
.tablet .checkmarkIcon { width: 14px; height: 14px; }
.mobile .checkmarkIconWrapper { padding: 2px; }
.mobile .checkmarkIcon { width: 12px; height: 12px; }
```

---
**File Path:** `packages/client/src/components/foundation/StoneSet.tsx`
---
```tsx
import React from 'react';
import Stone, { StoneProps as IndividualStoneProps } from './Stone';
import styles from './StoneSet.module.css';
import clsx from 'clsx';

export interface StoneSetComponentProps {
  stoneSetData: {
    stones: Omit<IndividualStoneProps, 'isSelected' | 'onSelect'>[];
    instruction: string;
    setId: string;
  };
  selectedStoneIdInSet: string | null;
  onStoneSelect: (setId: string, stoneData: Omit<IndividualStoneProps, 'isSelected' | 'onSelect'>, stoneIndexInSet: number) => void;
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
  isDisabled?: boolean;
}

const StoneSet: React.FC<StoneSetComponentProps> = ({
  stoneSetData,
  selectedStoneIdInSet,
  onStoneSelect,
  sizeContext = 'desktop',
  isDisabled = false,
}) => {
  const { setId, stones, instruction } = stoneSetData;

  if (!stones || stones.length === 0) {
    console.error("StoneSet expects at least 1 stone in stoneSetData.stones array.", stones);
    return <div className={styles.error}>Error loading stone set. Please try again.</div>;
  }

  return (
    <div className={clsx(styles.stoneSetContainer, styles[sizeContext])}>
      <div className={styles.instructionPanel}>
        <p className={styles.instructionText}>{instruction}</p>
      </div>
      <div className={clsx(styles.stonesDisplay, styles[sizeContext], stones.length === 2 && styles.twoStones)}>
        {stones.map((stoneData, index) => (
          <Stone
            key={stoneData.id}
            {...stoneData}
            isSelected={selectedStoneIdInSet === stoneData.id}
            onSelect={() => onStoneSelect(setId, stoneData, index)}
            sizeContext={sizeContext}
            ariaLabel={stoneData.ariaLabel || stoneData.content.join(' & ')}
            isDisabled={isDisabled || (selectedStoneIdInSet !== null && selectedStoneIdInSet !== stoneData.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoneSet;
```

---
**File Path:** `packages/client/src/components/foundation/StoneSet.module.css`
---
```css
/* StoneSet.module.css - Typography uses GDS vars */
.stoneSetContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-lg);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-dropdown);
  width: 100%;
  max-width: var(--max-width-stone-container);
  margin: var(--space-lg) auto;
}
.desktop.stoneSetContainer {}
.tablet.stoneSetContainer {}
.mobile.stoneSetContainer { padding: var(--space-md); }

.instructionPanel {
  width: 100%;
  text-align: center;
  margin-bottom: var(--space-xl);
}
.instructionText { /* Body Large */
  font-size: var(--font-size-body-large-mobile);
  line-height: var(--line-height-body-large);
  font-weight: var(--font-weight-medium);
  color: var(--ui-text-primary);
}
.stonesDisplay {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  flex-wrap: wrap;
}
.tablet .stonesDisplay { gap: var(--space-lg); flex-wrap: nowrap; }
.tablet .stonesDisplay.twoStones { justify-content: space-around; flex-wrap: nowrap; }
.desktop .stonesDisplay { gap: var(--space-xl); flex-wrap: nowrap; }
.desktop .stonesDisplay.twoStones { justify-content: space-around; flex-wrap: nowrap; }

@media (min-width: 768px) {
  .instructionText {
    font-size: var(--font-size-body-large-desktop);
  }
}

.error {
  color: var(--system-error-primary);
  padding: var(--space-lg);
  text-align: center;
  background-color: var(--system-error-background);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  font-weight: var(--font-weight-regular);
}
@media (min-width: 768px) {
  .error { font-size: var(--font-size-body-main-desktop); }
}
```

---
**File Path:** `packages/client/src/components/foundation/FoundationBase.tsx`
---
```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FoundationBase.module.css';
import { StoneProps as IndividualStoneProps } from './Stone';
import clsx from 'clsx';

export interface FoundationBaseProps {
  selectedStones: (IndividualStoneProps | null)[];
  sizeContext?: 'desktop' | 'tablet' | 'mobile';
}

const PlacedStone: React.FC<{ stoneData: IndividualStoneProps; index: number; totalStonesOnBase: number; baseRadius: number }> = ({ stoneData, index, totalStonesOnBase, baseRadius }) => {
  // TODO (Accessibility): Consider useReducedMotion() for simpler animations
  const angle = (index / Math.max(1, totalStonesOnBase)) * 2 * Math.PI - Math.PI / 2;
  const placedStoneRadius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--placed-stone-size-${useAssessmentStore.getState().sizeContext || 'desktop'}`).replace('px', '')) / 2 || 10;
  const effectiveRadius = baseRadius - placedStoneRadius - 5;
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
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      title={stoneData.content.join(' & ')}
    />
  );
};
// Need to import useAssessmentStore to get sizeContext for PlacedStone radius calculation above
// This is a bit of a workaround; ideally, PlacedStone would get its size via props or CSS directly.
import useAssessmentStore from '../../contexts/store/useAssessmentStore';


const FoundationBase: React.FC<FoundationBaseProps> = ({
  selectedStones,
  sizeContext = 'desktop',
}) => {
  const actualSelectedStones = selectedStones.filter(s => s !== null) as IndividualStoneProps[];

  let baseRadius = 160; // Half of 320px (desktop)
  if (sizeContext === 'tablet') baseRadius = 140; // Half of 280px
  if (sizeContext === 'mobile') baseRadius = 125; // Half of 250px

  return (
    <div className={clsx(styles.foundationBaseWrapper, styles[sizeContext])}>
      <div className={styles.baseCircle}>
        <AnimatePresence>
          {actualSelectedStones.map((stone, index) => (
            <PlacedStone
              key={stone.id}
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
```

---
**File Path:** `packages/client/src/components/foundation/FoundationBase.module.css`
---
```css
/* FoundationBase.module.css - Typography uses GDS vars, Neumorphic vars used */
.foundationBaseWrapper {
  display: flex; justify-content: center; align-items: center;
  padding: var(--space-md); margin-top: var(--space-xl); width: 100%;
}
.baseCircle {
  position: relative;
  border-radius: var(--radius-circular);
  background-color: var(--ui-neumorphic-background);
  box-shadow:
    inset 5px 5px 10px var(--ui-neumorphic-shadow-dark),
    inset -5px -5px 10px var(--ui-neumorphic-shadow-light);
  display: flex; align-items: center; justify-content: center;
  transition: width 0.3s ease, height 0.3s ease;
}
.desktop .baseCircle { width: 320px; height: 320px; }
.tablet .baseCircle { width: 280px; height: 280px; }
.mobile .baseCircle { width: 250px; height: 250px; }

.placedStone {
  border-radius: var(--radius-circular);
  box-shadow: var(--shadow-token);
  border: 1px solid rgba(var(--ui-text-on-dark-rgb),0.7);
  display: flex; align-items: center; justify-content: center;
  color: var(--ui-text-on-dark);
  /* Font size for any text inside placed stone (e.g. initial) */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-bold);
  transform: translate(-50%, -50%);
}

.desktop .placedStone {
  width: var(--placed-stone-size-desktop, 32px);
  height: var(--placed-stone-size-desktop, 32px);
}
.tablet .placedStone {
  width: var(--placed-stone-size-tablet, 28px);
  height: var(--placed-stone-size-tablet, 28px);
}
.mobile .placedStone {
  width: var(--placed-stone-size-mobile, 24px);
  height: var(--placed-stone-size-mobile, 24px);
}

.emptyBaseText {
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  text-align: center; padding: var(--space-lg);
  user-select: none;
}
@media (min-width: 768px) {
  .emptyBaseText { font-size: var(--font-size-body-small-desktop); }
}
```

This markdown contains the requested Foundation Stone component files.
```
