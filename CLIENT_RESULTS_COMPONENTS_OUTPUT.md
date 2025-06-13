## Client-Side Results Page Components

This document contains the content of components related to the Results Page display, found in `packages/client/src/components/results/`.

---
**File Path:** `packages/client/src/components/results/FinalTowerDisplay.tsx`
---
```tsx
import React from 'react';
import styles from './FinalTowerDisplay.module.css';
import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import { allStoneData } from '../../lib/personalityData';
import { getBlockPairsForType } from '../../lib/buildingBlockData'; // BuildingBlockDataItem not needed here directly
import { availablePalettesData } from '../../lib/colorPaletteData'; // PaletteInfo not needed here directly
import { getTokenGradientForType } from '../../lib/detailElementData';
import { SubtypeVariant } from '../../lib/utils/personalityCalculations';

// Helper to extract a dominant color from a gradient string (very simplified)
const getDominantColorFromGradient = (gradient: string | undefined, fallbackColor: string): string => {
  if (!gradient) return fallbackColor;
  // This regex attempts to find hex codes or CSS variables like var(--state-name-primary)
  const colors = gradient.match(/#[0-9a-fA-F]{6}|var\([^)]+\)/g);
  if (colors && colors.length > 0) {
    const firstColor = colors[0];
    // If it's a CSS variable, return it directly for SVG's fill.
    if (firstColor.startsWith('var(')) {
      // Attempt to map known state variables to their actual primary color variable
      // This is fragile and ideally the data source would provide the direct primary color variable.
      if (gradient.includes('very-good')) return 'var(--state-very-good-primary)';
      if (gradient.includes('good')) return 'var(--state-good-primary)';
      if (gradient.includes('neutral') || gradient.includes('average')) return 'var(--state-average-primary)'; // Assuming neutral maps to average
      if (gradient.includes('challenging') || gradient.includes('below-average')) return 'var(--state-below-average-primary)';
      if (gradient.includes('very-challenging') || gradient.includes('destructive')) return 'var(--state-destructive-primary)';
      return firstColor; // Return the var() string
    }
    return firstColor; // Return the first hex color found
  }
  return fallbackColor;
};


const FinalTowerDisplay: React.FC = () => {
  const {
    foundationSelections,
    typeCalculation,
    blockSelectionsUserInput,
    colorPaletteSelections,
    colorPaletteDistribution,
    stateAnalysisResult,
    subtypeStackResult,
    // tokenDistribution, // Not directly used for visual elements in this simplified version
  } = useAssessmentStore((state) => state);

  const primaryType = typeCalculation?.primaryType || null;

  const viewBoxWidth = 300;
  const viewBoxHeight = 500;
  const towerCenterX = viewBoxWidth / 2;

  // --- Foundation Layer ---
  const foundationRadius = 100;
  const foundationBaseY = viewBoxHeight - foundationRadius - 20;
  const foundationStonesElements: JSX.Element[] = [];
  if (foundationSelections.every(s => s !== null)) {
    const numSegments = 9;
    const angleStep = (2 * Math.PI) / numSegments;
    for (let i = 0; i < numSegments; i++) {
      const selectionIndex = foundationSelections[i];
      const stoneSet = allStoneData[i];
      if (selectionIndex !== null && stoneSet) {
        const stoneData = stoneSet.stones[selectionIndex];
        const startAngle = i * angleStep - Math.PI / 2 - angleStep / 2.1; // Adjust for small gap
        const endAngle = (i + 1) * angleStep - Math.PI / 2 - angleStep / 1.9; // Adjust for small gap

        const x1 = towerCenterX + foundationRadius * Math.cos(startAngle);
        const y1 = foundationBaseY + foundationRadius * Math.sin(startAngle);
        const x2 = towerCenterX + foundationRadius * Math.cos(endAngle);
        const y2 = foundationBaseY + foundationRadius * Math.sin(endAngle);

        const dominantColor = getDominantColorFromGradient(stoneData.gradientStyle, 'var(--ui-border-container-empty)');

        const pathData = `M ${towerCenterX},${foundationBaseY} L ${x1},${y1} A ${foundationRadius},${foundationRadius} 0 0,1 ${x2},${y2} Z`;
        foundationStonesElements.push(
          <path key={`foundation-stone-${i}`} d={pathData} fill={dominantColor} stroke="var(--ui-background-main)" strokeWidth="1.5" />
        );
      }
    }
  }

  // --- Building Blocks Layer ---
  const blockWidthBase = foundationRadius * 1.6;
  const blockHeight = 40;
  let currentY = foundationBaseY - 5; // Start just above foundation segments
  const buildingBlockElements: JSX.Element[] = [];
  let blockGradientId = "blockFillGradient"; // Default ID

  if (colorPaletteSelections.ids.length === 2 && colorPaletteDistribution && availablePalettesData) {
    const palette1 = availablePalettesData.find(p => p.id === colorPaletteSelections.ids[0]);
    const palette2 = availablePalettesData.find(p => p.id === colorPaletteSelections.ids[1]);
    if (palette1 && palette2) {
      // Use the direct primaryColor variable from paletteData
      const p1ColorVar = palette1.primaryColor; // Should be like 'var(--state-good-primary)'
      const p2ColorVar = palette2.primaryColor;

      blockGradientId = `blockGradient-${palette1.id}-${palette2.id}-${colorPaletteDistribution.primaryPercentage}`;

      buildingBlockElements.push(
        <defs key="block-gradient-def">
          <linearGradient id={blockGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p1ColorVar} />
            <stop offset={`${colorPaletteDistribution.primaryPercentage}%`} stopColor={p1ColorVar} />
            <stop offset={`${colorPaletteDistribution.primaryPercentage}%`} stopColor={p2ColorVar} />
            <stop offset="100%" stopColor={p2ColorVar} />
          </linearGradient>
        </defs>
      );
    }
  }
  const blockFill = colorPaletteSelections.ids.length === 2 ? `url(#${blockGradientId})` : 'var(--ui-border-container-empty)';


  const blockPairsData = primaryType ? getBlockPairsForType(primaryType) : [];
  for (let i = 0; i < 4; i++) {
    const blockLayerWidth = blockWidthBase * (1 - (i * 0.08)); // Slight tapering
    currentY -= (blockHeight + 2);
    const selectionIndex = blockSelectionsUserInput[i];
    const pairData = blockPairsData[i];
    let blockTexturePatternId = "";

    if (selectionIndex !== null && pairData) {
      const chosenBlock = pairData.blocks[selectionIndex];
      if (chosenBlock.textureVariation === 'texture-lines') blockTexturePatternId = "url(#linesPattern)";
      else if (chosenBlock.textureVariation === 'texture-dots') blockTexturePatternId = "url(#dotsPattern)";
      // Add more texture mappings if needed
    }

    buildingBlockElements.push(
      <g key={`block-group-${i}`}>
        <rect
          key={`block-${i}`}
          x={towerCenterX - blockLayerWidth / 2}
          y={currentY}
          width={blockLayerWidth}
          height={blockHeight}
          fill={blockFill}
          stroke="var(--ui-background-main)"
          strokeWidth="1"
          rx="var(--radius-sm)"
        />
        {blockTexturePatternId && (
           <rect
            key={`block-texture-${i}`}
            x={towerCenterX - blockLayerWidth / 2}
            y={currentY}
            width={blockLayerWidth}
            height={blockHeight}
            fill={blockTexturePatternId}
            rx="var(--radius-sm)"
            opacity="0.5" // Make texture semi-transparent
          />
        )}
      </g>
    );
  }

  // --- Detail Accents Layer ---
  const detailAccentElements: JSX.Element[] = [];
  const topOfTowerY = currentY - 15;
  const accentRadius = 6;
  if (subtypeStackResult) {
    const instincts: SubtypeVariant[] = [subtypeStackResult.primary, subtypeStackResult.secondary, subtypeStackResult.tertiary];
    const tokenGradientForDetails = getTokenGradientForType(primaryType);

    // Simple horizontal placement for accents
    const totalAccentsWidth = (instincts.length * (accentRadius * 2)) + ((instincts.length - 1) * 5);
    let currentX = towerCenterX - totalAccentsWidth / 2 + accentRadius;

    instincts.forEach((instinct, idx) => {
      // Primary gets slightly larger or more prominent
      const r = idx === 0 ? accentRadius * 1.2 : accentRadius;
      detailAccentElements.push(
        <circle
          key={`detail-${instinct}-${idx}`}
          cx={currentX}
          cy={topOfTowerY - r} // Position based on its radius
          r={r}
          fill={tokenGradientForDetails}
          stroke="var(--ui-background-main)"
          strokeWidth="1"
        />
      );
      currentX += (r * 2 + 5);
    });
  }

  // TODO: Implement 360° rotation or view toggle for the tower.

  return (
    <div className={styles.towerDisplayContainer}>
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className={styles.towerSvg} aria-labelledby="towerTitleDesc" role="img">
        <title id="towerTitleDesc">Visual representation of your Personality Tower.
          The base shows foundation stones, middle layers are building blocks colored by your chosen states,
          and top accents represent your instinctual subtype stacking.
        </title>

        <defs>
          <pattern id="linesPattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M 0 2 L 4 2" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="dotsPattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="rgba(0,0,0,0.3)"/>
          </pattern>
          {/* Gradient for blocks will be dynamically added here by buildingBlockElements */}
        </defs>

        <g id="foundation-layer" transform={`translate(0, ${foundationRadius * 0.1})`}> {/* Shift foundation slightly down */}
          <circle cx={towerCenterX} cy={foundationBaseY} r={foundationRadius} fill="var(--ui-neumorphic-background)" />
          {foundationStonesElements}
        </g>

        <g id="building-blocks-layer">
          {buildingBlockElements}
        </g>

        <g id="details-layer">
          {detailAccentElements}
        </g>
      </svg>
      {stateAnalysisResult && (
        <div className={styles.towerDescription}>
          <h3>Your Tower's Essence</h3>
          <p>{stateAnalysisResult.blendedDescription}</p>
        </div>
      )}
    </div>
  );
};

export default FinalTowerDisplay;
```

---
**File Path:** `packages/client/src/components/results/FinalTowerDisplay.module.css`
---
```css
/* FinalTowerDisplay.module.css */
.towerDisplayContainer {
  width: 100%;
  max-width: 350px; /* Adjusted max-width for typical SVG display */
  margin: var(--space-lg) auto;
  padding: var(--space-md);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-modal);
}

.towerSvg {
  width: 100%;
  height: auto;
  display: block;
}

.towerDescription {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--ui-background-welcome-gradient-end);
  border-radius: var(--radius-md);
  text-align: center;
}

.towerDescription h3 { /* heading-h3 */
  font-size: var(--font-size-heading-h3-mobile);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-sm);
}

.towerDescription p { /* body-small */
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .towerDisplayContainer {
    max-width: 400px; /* Slightly larger on desktop */
  }
  .towerDescription h3 {
    font-size: var(--font-size-heading-h3-desktop);
  }
  .towerDescription p {
    font-size: var(--font-size-body-small-desktop);
  }
}
```

---
**File Path:** `packages/client/src/components/results/ReportSection.tsx`
---
```tsx
import React from 'react';
import styles from './ReportSection.module.css';

export interface ReportSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  icon,
  children,
  className,
}) => {
  return (
    <section className={`${styles.reportSection} ${className || ''}`}>
      <div className={styles.header}>
        {icon && <span className={styles.iconWrapper}>{icon}</span>}
        {/* Using h2 for section titles within the report page structure */}
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
};

export default ReportSection;
```

---
**File Path:** `packages/client/src/components/results/ReportSection.module.css`
---
```css
/* ReportSection.module.css - Typography uses GDS vars */
.reportSection {
  width: 100%;
  /* padding: var(--space-lg) 0; /* Vertical padding handled by parent or here */
  margin-bottom: var(--space-lg);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-dropdown);
  padding: var(--space-md);
}

.reportSection:last-child {
  margin-bottom: 0;
}

.header {
  display: flex;
  align-items: center;
  gap: var(--space-sm); /* Adjusted gap */
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--ui-border-container-empty);
}

.iconWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-accent-primary);
}

.iconWrapper svg { /* Default size for icons in report sections */
  width: calc(var(--font-size-heading-h2-mobile) * 0.8);
  height: calc(var(--font-size-heading-h2-mobile) * 0.8);
}
@media (min-width: 768px) {
  .iconWrapper svg {
    width: calc(var(--font-size-heading-h2-desktop) * 0.8);
    height: calc(var(--font-size-heading-h2-desktop) * 0.8);
  }
}

.title { /* GDS Heading H2 for section titles within report */
  font-size: var(--font-size-heading-h2-mobile);
  line-height: var(--line-height-heading-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  margin-bottom: 0;
}

.content {
  font-size: var(--font-size-body-main-mobile);
  line-height: var(--line-height-body-main);
  /* color: var(--ui-text-secondary); /* Content text defaults to primary now */
}
.content p, .content li { /* Ensure children also use GDS */
  font-size: inherit;
  line-height: inherit;
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-sm);
}
.content p:last-child, .content li:last-child {
  margin-bottom: 0;
}
.content strong, .content b { /* Ensure strong/b uses GDS bold */
  font-weight: var(--font-weight-bold);
  color: var(--ui-text-primary); /* Or slightly darker if needed */
}
.content ul, .content ol {
  padding-left: var(--space-lg);
  margin-bottom: var(--space-sm);
}
.content li {
  margin-bottom: var(--space-xs);
}

@media (min-width: 768px) {
  .reportSection {
    padding: var(--space-lg);
  }
  .title {
    font-size: var(--font-size-heading-h2-desktop);
  }
  .content {
    font-size: var(--font-size-body-main-desktop);
  }
}
```

---
**File Path:** `packages/client/src/components/results/ScoreBarDisplay.tsx`
---
```tsx
import React from 'react';
import styles from './ScoreBarDisplay.module.css';
import clsx from 'clsx';

export interface ScoreBarDisplayProps {
  scores: Record<string, number>;
  primaryType?: string;
  title?: string;
}

const ScoreBarDisplay: React.FC<ScoreBarDisplayProps> = ({ scores, primaryType, title }) => {
  const sortedScoreEntries = Object.entries(scores).sort(([typeA, scoreA], [typeB, scoreB]) => {
    if (typeA === primaryType) return -1;
    if (typeB === primaryType) return 1;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return parseInt(typeA) - parseInt(typeB);
  });

  return (
    <div className={styles.scoreBarDisplayContainer}>
      {title && <h3 className={styles.displayTitle}>{title}</h3>}
      <ul className={styles.scoreList}>
        {sortedScoreEntries.map(([type, score]) => {
          const percentage = Math.max(0, Math.min(score * 100, 100));
          const isPrimary = type === primaryType;
          return (
            <li key={type} className={clsx(styles.scoreItem, isPrimary && styles.primaryType)}>
              <span className={styles.typeLabel}>Type {type}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(percentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Score for Type ${type}: ${Math.round(percentage)}%`}
                />
              </div>
              <span className={styles.percentageLabel}>{Math.round(percentage)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ScoreBarDisplay;
```

---
**File Path:** `packages/client/src/components/results/ScoreBarDisplay.module.css`
---
```css
/* ScoreBarDisplay.module.css - Typography uses GDS vars */
.scoreBarDisplayContainer {
  width: 100%;
  padding: var(--space-md);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-md);
}

.displayTitle { /* Heading H3 */
  font-size: var(--font-size-heading-h3-mobile);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-md);
  text-align: center;
}

.scoreList {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column;
  gap: var(--space-sm);
}
.scoreItem {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-sm);
  align-items: center;
}
.typeLabel { /* Body Small (medium weight) */
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  font-weight: var(--font-weight-medium);
  color: var(--ui-text-secondary);
  min-width: 60px;
  text-align: right;
}
.barTrack {
  width: 100%; height: 12px;
  background-color: var(--ui-border-container-empty);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.barFill {
  height: 100%;
  background-color: var(--ui-accent-secondary);
  border-radius: var(--radius-pill);
  transition: width 0.5s var(--animation-ease-out, ease-out);
}
.primaryType .barFill { background-color: var(--ui-accent-primary); }
.primaryType .typeLabel,
.primaryType .percentageLabel {
  font-weight: var(--font-weight-bold);
  color: var(--ui-text-primary);
}
.percentageLabel { /* Caption Text */
  font-size: var(--font-size-caption-text-mobile);
  line-height: var(--line-height-caption-text);
  font-weight: var(--font-weight-regular);
  color: var(--ui-text-secondary);
  min-width: 35px;
  text-align: left;
}

@media (min-width: 768px) {
  .displayTitle { font-size: var(--font-size-heading-h3-desktop); }
  .typeLabel { font-size: var(--font-size-body-small-desktop); }
  .percentageLabel { font-size: var(--font-size-caption-text-desktop); }
  .barTrack { height: 16px; }
}
```

---
**File Path:** `packages/client/src/components/results/StateDistributionDisplay.tsx`
---
```tsx
import React from 'react';
import styles from './StateDistributionDisplay.module.css';
import { PaletteInfo } from '../../lib/colorPaletteData'; // For paletteColors prop if passing full PaletteInfo

export interface StateDistributionDisplayProps {
  distribution: {
    primaryStateName: string;
    primaryPercentage: number;
    secondaryStateName: string;
    secondaryPercentage: number;
  };
  // Expecting actual color values (hex or CSS var strings) for the bars
  paletteColors: {
    primary: string; // e.g., "var(--state-good-primary)" or "#22c55e"
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

  const primPercent = Math.max(0, Math.min(primaryPercentage, 100));
  const secPercent = Math.max(0, Math.min(secondaryPercentage, 100));

  const primaryStyle: React.CSSProperties = {
    width: `${primPercent}%`,
    backgroundColor: paletteColors.primary,
  };
  const secondaryStyle: React.CSSProperties = {
    width: `${secPercent}%`,
    backgroundColor: paletteColors.secondary,
  };

  return (
    <div className={styles.stateDistributionContainer}>
      {title && <h3 className={styles.displayTitle}>{title}</h3>}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.colorSwatch} style={{ backgroundColor: paletteColors.primary }} />
          <span className={styles.stateNameText}>{primaryStateName}:</span> {/* Changed class name */}
          <span className={styles.percentage}>{primPercent}%</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.colorSwatch} style={{ backgroundColor: paletteColors.secondary }} />
          <span className={styles.stateNameText}>{secondaryStateName}:</span> {/* Changed class name */}
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
```

---
**File Path:** `packages/client/src/components/results/StateDistributionDisplay.module.css`
---
```css
/* StateDistributionDisplay.module.css - Typography uses GDS vars */
.stateDistributionContainer {
  width: 100%;
  padding: var(--space-md);
  background-color: var(--ui-background-main);
  border-radius: var(--radius-md);
}

.displayTitle { /* Heading H3 */
  font-size: var(--font-size-heading-h3-mobile);
  line-height: var(--line-height-heading-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--ui-text-primary);
  margin-bottom: var(--space-md);
  text-align: center;
}

.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
  gap: var(--space-sm);
}
.legendItem {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-body-small-mobile);
  line-height: var(--line-height-body-small);
  color: var(--ui-text-secondary); /* Base color for legend text */
}
.colorSwatch {
  width: 12px; height: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--ui-border-container-empty);
}
.stateNameText { /* Renamed from .stateName to avoid conflict if used elsewhere */
  font-weight: var(--font-weight-medium);
  color: var(--ui-text-primary); /* More prominent for state name */
}
.percentage { font-weight: var(--font-weight-semibold); }

.distributionBar {
  display: flex; width: 100%;
  height: 24px;
  border-radius: var(--radius-pill);
  overflow: hidden;
  background-color: var(--ui-border-container-empty);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}
.barSegmentPrimary,
.barSegmentSecondary {
  height: 100%;
  transition: width 0.5s var(--animation-ease-out, ease-out);
}

@media (min-width: 768px) {
  .displayTitle { font-size: var(--font-size-heading-h3-desktop); }
  .legendItem { font-size: var(--font-size-body-small-desktop); }
  .distributionBar { height: 28px; }
}
```

This markdown contains the requested client results component files.
```
