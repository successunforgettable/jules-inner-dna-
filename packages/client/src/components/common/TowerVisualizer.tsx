// packages/client/src/components/common/TowerVisualizer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from './TowerVisualizer.module.css';

// Define expected props
export interface FoundationStoneData { // Placeholder - Exporting for potential use in parent
  id: string;
  color: string; // Example
}

export interface BuildingBlockData { // Placeholder - Exporting for potential use in parent
  id: string;
  color: string; // Example - will be overridden by palette gradient if available
  height: number;
}

export interface ColorPaletteData { // For selected palettes
  id: string;
  primaryColor: string; // Dominant color of the palette
  // secondaryColor?: string; // Optional: if palettes have a secondary distinct color for gradients
}

export interface ColorDistribution { // For blending two palettes
  primaryPercentage: number; // Percentage for the first selected palette
  secondaryPercentage: number; // Percentage for the second selected palette
}

interface TowerVisualizerProps {
  foundationStones?: FoundationStoneData[];
  buildingBlocks?: BuildingBlockData[];
  selectedPalettes?: [ColorPaletteData | null, ColorPaletteData | null];
  colorDistribution?: ColorDistribution | null;
  // TODO: Add props for detail elements (Decals) in a later step
}

const TowerVisualizer: React.FC<TowerVisualizerProps> = ({
  foundationStones = [],
  buildingBlocks = [],
  selectedPalettes,
  colorDistribution,
}) => {
  // Basic SVG setup
  const viewBoxWidth = 300;
  const viewBoxHeight = 500; // Initial height, might need to grow
  const viewBoxHeight = 500; // Initial height, might need to grow
  const towerGroundY = viewBoxHeight - 50; // Where the base of the foundation sits
  const towerWidth = 150;
  const foundationHeight = foundationStones.length > 0 ? 20 : 5; // Height of the foundation representation
  const blockGap = 2; // Gap between stacked blocks

  const foundationTopY = towerGroundY - foundationHeight;
  let currentBlockBottomY = foundationTopY;

  const gradientId = 'towerColorBlendGradient';
  let blockFill = 'skyblue'; // Default fill if no color data

  if (selectedPalettes && selectedPalettes[0] && selectedPalettes[1] && colorDistribution) {
    // TODO: Implement smooth 0.3s color transition if default Framer Motion/SVG behavior is not sufficient.
    // This might involve animating gradient stops directly or using dynamic gradient IDs if colors change frequently.
    blockFill = `url(#${gradientId})`;
  }

  return (
    <div className={styles.towerVisualizerContainer}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className={styles.towerSvg}
        aria-labelledby="towerTitle"
        preserveAspectRatio="xMidYMax meet"
      >
        <title id="towerTitle">Personality Tower Visualization</title>
        <defs>
          {selectedPalettes && selectedPalettes[0] && selectedPalettes[1] && colorDistribution && (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={selectedPalettes[0].primaryColor} />
              <stop offset={`${colorDistribution.primaryPercentage}%`} stopColor={selectedPalettes[0].primaryColor} />
              <stop offset={`${colorDistribution.primaryPercentage}%`} stopColor={selectedPalettes[1].primaryColor} />
              <stop offset="100%" stopColor={selectedPalettes[1].primaryColor} />
            </linearGradient>
          )}
        </defs>
        <g id="tower-elements">
          <rect
            x={(viewBoxWidth - towerWidth) / 2}
            y={foundationTopY}
            width={towerWidth}
            height={foundationHeight}
            fill={foundationStones.length > 0 ? (foundationStones[0]?.color || 'grey') : 'grey'} // Use first foundation stone color or default
          />

          {buildingBlocks.map((block, index) => {
            const blockHeight = block.height || 30;
            const blockWidth = towerWidth * 0.8;
            const blockX = (viewBoxWidth - blockWidth) / 2;
            const blockTopY = currentBlockBottomY - blockHeight;
            currentBlockBottomY = blockTopY - blockGap;

            const individualBlockFill = blockFill === `url(#${gradientId})` ? blockFill : (block.color || 'skyblue');

            return (
              <motion.rect
                key={block.id}
                x={blockX}
                width={blockWidth}
                height={blockHeight}
                fill={individualBlockFill}
                initial={{ opacity: 0, y: towerGroundY + 60 }}
                animate={{ opacity: 1, y: blockTopY }}
                transition={{ type: 'spring', stiffness: 100, damping: 15, delay: index * 0.2 }}
              />
            );
          })}

          {buildingBlocks.length === 0 && foundationStones.length === 0 && (
            <text x={viewBoxWidth/2} y={viewBoxHeight/2} textAnchor="middle" className={styles.placeholderText}>
              Your Tower Will Appear Here
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

export default TowerVisualizer;
