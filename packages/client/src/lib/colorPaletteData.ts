import { generateModifiedGradient } from "./utils/colorUtils"; // Still needed if client modifies gradient

// Defines types related to Color Palette data.
// Base palette info is fetched from backend.
// Type-specific descriptions are fetched separately.
// Gradient modification can happen client-side.

export interface PaletteInfo {
  id: string; // Was paletteId in schema
  paletteId?: string; // From schema
  stateName: string;
  genericDescription: string;
  baseGradientStyle: string;
  primaryColor: string;
  lightVariant?: string;
  darkVariant?: string;
  // No need for description or gradientStyle here as they are in PaletteInfoForDisplay
}

export interface PaletteInfoForDisplay extends PaletteInfo { // Extends base PaletteInfo
  description: string; // Can be generic or type-specific
  gradientStyle: string; // Can be base or type-modified
  originalIndex?: number; // Added in ColorPalettePage for selection handling
}

// The static `availablePalettesData` array is removed.
// `fetchColorPalettes()` from `contentService.ts` will provide the base data.

// The static `typeSpecificDescriptions` map is removed.
// `fetchPaletteDescriptionsForType(primaryType)` from `contentService.ts` will provide this.


// This function remains useful on the client if we fetch base palettes and
// then apply type-specific modifications (description, gradient) client-side.
export const getTypeSpecificPaletteData = (
  basePalette: PaletteInfo, // Base info fetched from API
  primaryType: string | null,
  typeSpecificDescription?: string // Fetched separately via fetchPaletteDescriptionsForType
): PaletteInfoForDisplay => {

  const descriptionToUse = typeSpecificDescription || basePalette.genericDescription;
  const modifiedGradient = generateModifiedGradient(basePalette.baseGradientStyle, primaryType);

  return {
    ...basePalette,
    description: descriptionToUse,
    gradientStyle: modifiedGradient,
  };
};
```
