import React from 'react';
import styles from './FinalTowerDisplay.module.css';
// Removed direct store imports, data will come via props
// import useAssessmentStore from '../../contexts/store/useAssessmentStore';
import { allStoneData } from '../../lib/personalityData'; // Keep for stone data structure if needed for mapping
import { getBlockPairsForType, BuildingBlockDataItem } from '../../lib/buildingBlockData'; // Keep for block data structure
// import { availablePalettesData, PaletteInfo } from '../../lib/colorPaletteData'; // If palette details come via props, this might not be needed
import { SubtypeVariant, TokenDistribution } from '../../lib/utils/personalityCalculations';
import { IColorPaletteSelection, IColorPaletteDistribution } from '../../../../shared/types/assessment.types'; // Adjust path as needed

// Helper to extract a dominant color from a gradient string (very simplified)
// This might need to be more robust or colors should be passed directly
const getDominantColorFromGradient = (gradient: string | undefined, fallbackColor: string): string => {
  if (!gradient) return fallbackColor;
  const colors = gradient.match(/#[0-9a-fA-F]{6}|var\([^)]+\)/g);
  if (colors && colors.length > 0) {
    if (colors[0].startsWith('var(')) {
        if (gradient.includes('very-good-primary')) return 'var(--state-very-good-primary)';
        if (gradient.includes('good-primary')) return 'var(--state-good-primary)';
        if (gradient.includes('neutral-primary')) return 'var(--state-neutral-primary)';
        if (gradient.includes('challenging-primary')) return 'var(--state-challenging-primary)';
        if (gradient.includes('very-challenging-primary')) return 'var(--state-very-challenging-primary)';
    }
    return colors[0];
  }
  return fallbackColor;
};

// Define props for the component
interface FinalTowerDisplayProps {
  // Data from userProfile.determinedCoreType (or coreTypeDetails)
  coreTypeNumber?: number | null;
  coreTypeColor?: string | null; // e.g., from EnneagramType.colorHex

  // Data from userProfile.foundationStoneSelections
  foundationSelections?: ({ setId: string; selectedStoneKey: string; typeScores?: Map<string, number>})[];

  // Data from userProfile.buildingBlockSelections
  buildingBlockSelections?: ({ pairId: string; selectedBlockKey: string })[];

  // Data from userProfile.colorPaletteSelections and userProfile.colorPaletteDistribution
  // It's better to pass resolved palette colors if possible, or full palette objects.
  colorPaletteData?: IColorPaletteSelection[];
  distributionData?: IColorPaletteDistribution | null;
  resolvedPaletteColors?: { primary: string; secondary: string; } | null; // Pre-resolved colors

  // Data from userProfile.detailElementTokenDistribution and userProfile.determinedInstinctualStacking
  tokenData?: TokenDistribution | null;
  primaryInstinctForTokenColor?: string | null; // To theme tokens, could be coreTypeNumber or specific color

  // Optional: Full state analysis result for blended description
  blendedStateDescription?: string | null;
}

const FinalTowerDisplay: React.FC<FinalTowerDisplayProps> = ({
  coreTypeNumber,
  coreTypeColor,
  foundationSelections = [], // Default to empty array
  buildingBlockSelections = [], // Default
  colorPaletteData = [], // Default
  distributionData,
  resolvedPaletteColors,
  tokenData,
  primaryInstinctForTokenColor, // Using coreTypeNumber for now
  blendedStateDescription,
}) => {
  // SVG ViewBox dimensions
  const viewBoxWidth = 300;
  const viewBoxHeight = 500;
  const towerCenterX = viewBoxWidth / 2;

  // --- Foundation Layer ---
  const foundationRadius = 100;
  const foundationBaseY = viewBoxHeight - foundationRadius - 20;
  const foundationStonesElements = [];

  // Map foundationSelections (keys 'A','B','C') to indices (0,1,2)
  const mapKeyToIndex = (key: string): number => key.charCodeAt(0) - 'A'.charCodeAt(0);

  if (foundationSelections && foundationSelections.length === 9) {
    const numSegments = 9;
    const angleStep = (2 * Math.PI) / numSegments;
    for (let i = 0; i < numSegments; i++) {
      const selection = foundationSelections[i];
      const stoneSet = allStoneData[i]; // Assuming allStoneData is still relevant for structure/gradients
      if (selection && selection.selectedStoneKey && stoneSet) {
        const selectionIndex = mapKeyToIndex(selection.selectedStoneKey);
        const stoneData = stoneSet.stones[selectionIndex];
        const startAngle = i * angleStep - Math.PI / 2 - angleStep / 2;
        const endAngle = (i + 1) * angleStep - Math.PI / 2 - angleStep / 2;

        const x1 = towerCenterX + foundationRadius * Math.cos(startAngle);
        const y1 = foundationBaseY + foundationRadius * Math.sin(startAngle);
        const x2 = towerCenterX + foundationRadius * Math.cos(endAngle);
        const y2 = foundationBaseY + foundationRadius * Math.sin(endAngle);

        const dominantColor = getDominantColorFromGradient(stoneData?.gradientStyle, coreTypeColor || 'var(--ui-border-container-empty)');

        const pathData = `M ${towerCenterX},${foundationBaseY} L ${x1},${y1} A ${foundationRadius},${foundationRadius} 0 0,1 ${x2},${y2} Z`;
        foundationStonesElements.push(
          <path key={`foundation-stone-${i}`} d={pathData} fill={dominantColor} stroke="var(--ui-background-main)" strokeWidth="1" />
        );
      }
    }
  }

  // --- Building Blocks Layer ---
  const blockWidth = foundationRadius * 1.6;
  const blockHeight = 40;
  let currentY = foundationBaseY - foundationRadius - 5;
  const buildingBlockElements = [];
  let blockFillColor = coreTypeColor || 'var(--ui-border-container-empty)'; // Default to core type color

  if (resolvedPaletteColors && distributionData) {
    const gradientId = `blockGradient-${Date.now()}`; // Ensure unique ID
    buildingBlockElements.push(
      <defs key="block-gradient-def">
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={resolvedPaletteColors.primary} />
          <stop offset={`${distributionData.primaryPercentage}%`} stopColor={resolvedPaletteColors.primary} />
          <stop offset={`${distributionData.primaryPercentage}%`} stopColor={resolvedPaletteColors.secondary} />
          <stop offset="100%" stopColor={resolvedPaletteColors.secondary} />
        </linearGradient>
      </defs>
    );
    blockFillColor = `url(#${gradientId})`;
  }

  const blockPairsData = coreTypeNumber ? getBlockPairsForType(String(coreTypeNumber)) : []; // String conversion if type is number
  for (let i = 0; i < 4; i++) {
    currentY -= (blockHeight + 2);
    const selection = buildingBlockSelections[i];
    const pairData = blockPairsData[i];
    let blockTexture = "none";

    if (selection && selection.selectedBlockKey && pairData) {
      const selectionIndex = mapKeyToIndex(selection.selectedBlockKey);
      const chosenBlock: BuildingBlockDataItem | undefined = pairData.blocks[selectionIndex];
      if (chosenBlock?.textureVariation === 'texture-lines') blockTexture = "url(#linesPattern)";
      if (chosenBlock?.textureVariation === 'texture-dots') blockTexture = "url(#dotsPattern)";
    }

    buildingBlockElements.push(
      <g key={`block-group-${i}`}>
        <rect
          key={`block-${i}`}
          x={towerCenterX - blockWidth / 2}
          y={currentY}
          width={blockWidth}
          height={blockHeight}
          fill={blockFillColor}
          stroke="var(--ui-background-main)"
          strokeWidth="1"
          rx="var(--radius-sm)"
        />
        {blockTexture !== "none" && (
           <rect
            key={`block-texture-${i}`}
            x={towerCenterX - blockWidth / 2}
            y={currentY}
            width={blockWidth}
            height={blockHeight}
            fill={blockTexture}
            rx="var(--radius-sm)"
          />
        )}
      </g>
    );
  }

  // --- Detail Accents Layer ---
  const detailAccentElements = [];
  const topOfTowerY = currentY - 10;
  const accentRadius = 5;
  // Example: Use core type color for accents, or a specific instinct color if available
  const accentFillColor = coreTypeColor || 'var(--ui-accent-secondary)';

  if (tokenData) { // Assuming primaryInstinctForTokenColor is now coreTypeColor passed as accentFillColor
    const instincts: SubtypeVariant[] = ['self', 'oneToOne', 'social'];
    let totalTokensPlacedForAccents = 0;
    Object.values(tokenData).forEach(count => totalTokensPlacedForAccents += count);

    // Simplified: just place a number of dots based on total tokens, could be more elaborate
    let currentXOffset = -(Math.min(totalTokensPlacedForAccents, 5) -1) * (accentRadius * 2 + 5) / 2;

    for(let i=0; i < Math.min(totalTokensPlacedForAccents, 5) ; i++) { // Max 5 accents for visual simplicity
        detailAccentElements.push(
            <circle
            key={`detail-accent-${i}`}
            cx={towerCenterX + currentXOffset + i * (accentRadius * 2 + 2)}
            cy={topOfTowerY - (i % 2 === 0 ? 0 : accentRadius * 0.75)} // Slight vertical staggering
            r={accentRadius}
            fill={accentFillColor}
            stroke="var(--ui-background-main)"
            strokeWidth="0.5"
            />
        );
    }
  }

  return (
    <div className={styles.towerDisplayContainer}>
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className={styles.towerSvg} aria-labelledby="towerTitle">
        <title id="towerTitle">Your Inner DNA Tower</title>
        <defs>
          <pattern id="linesPattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M 0 2 L 4 2" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          </pattern>
          <pattern id="dotsPattern" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1" fill="rgba(255,255,255,0.4)"/>
          </pattern>
        </defs>

        <g id="foundation-layer">
          <circle cx={towerCenterX} cy={foundationBaseY} r={foundationRadius} fill={coreTypeColor || 'var(--ui-border-container-empty)'} />
          {foundationStonesElements}
        </g>

        <g id="building-blocks-layer">
          {buildingBlockElements}
        </g>

        <g id="details-layer">
          {detailAccentElements}
        </g>
      </svg>
      {blendedStateDescription && (
        <div className={styles.towerDescription}>
          <h3>Your Tower's Essence</h3>
          <p>{blendedStateDescription}</p>
        </div>
      )}
    </div>
  );
};

export default FinalTowerDisplay;
