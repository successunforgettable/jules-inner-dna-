// Defines types related to Building Block data.
// The actual data (block pairs) is now fetched from the backend based on core type.

export interface BuildingBlockDataItem {
  id: string; // Was blockId in schema, using id for consistency with other client data items
  blockId?: string; // From schema
  content: string;
  textureVariation?: string;
  gradientStyle?: string;
  associatedWingValue?: number;
  arrowDirection?: 'integration' | 'disintegration';
  choiceValue?: number | string;
  ariaLabel?: string; // Added for consistency
}

export interface BlockPairData {
  pairId: string;
  questionText: string;
  // blocks: [BuildingBlockDataItem, BuildingBlockDataItem]; // Schema uses tuple, client might use array
  blocks: BuildingBlockDataItem[]; // Allow for flexibility, though API sends 2
  pairType: 'wing' | 'arrow' | 'growth_focus' | 'response_pattern';
  enneagramType?: string | null; // From schema
}

// The static `typeSpecificBlockData`, `genericGrowthFocusPair`, `genericResponsePatternPair`
// and the `getBlockPairsForType` function are removed.
// `fetchBuildingBlockPairs(primaryType)` from `contentService.ts` will provide this data.

// Texture CSS class examples comment removed, as it's more relevant to CSS files or GDS docs.
```
