import React from 'react';
import ColorPaletteCard, { ColorPaletteCardProps } from './ColorPaletteCard';
import styles from './PaletteSelector.module.css';
import { PaletteInfo } from '../../lib/colorPaletteData'; // Data structure for individual palettes

export interface PaletteSelectorProps {
  palettesData: PaletteInfo[]; // Array of 5 palette data objects
  selectedPaletteIds: (string | number)[]; // Array of IDs of selected palettes (max 2)
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
        // A card is disabled if 2 palettes are already selected AND this card is NOT one of them.
        const isDisabled = selectedPaletteIds.length >= maxSelections && !isSelected;

        // Map PaletteInfo to ColorPaletteCardProps
        const cardProps: ColorPaletteCardProps = {
          id: palette.id,
          stateName: palette.stateName,
          description: palette.description,
          gradientStyle: palette.gradientStyle,
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
