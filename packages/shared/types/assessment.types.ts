// packages/shared/types/assessment.types.ts

// --- Calculation Result Types (Redefined for shared context) ---
// These should mirror the structures produced by your calculation functions.

export interface PersonalityTypeCalculationData {
  primaryType: string;
  confidence: number;
  alternatives: string[];
  allScores: Record<string, number>;
  rawScores: Record<string, number>; // Simplified from TypeScores for this shared type
}

export interface WingCalculationData {
  primaryWing: string;
  wingStrength: 'strong' | 'moderate';
  confidence: number;
}

export interface ArrowCalculationData {
  integrationType: string;
  integrationStrength: 'conscious' | 'developing' | 'less_developed';
  disintegrationType: string;
  disintegrationStrength: 'conscious' | 'developing' | 'less_developed';
  confidence: number;
}

export interface DistributionObjectData { // Renamed from DistributionObject to avoid potential naming conflicts
  primaryPercentage: number;
  secondaryPercentage: number;
}

export interface StateAnalysisData {
  primaryState: string;
  secondaryState: string;
  distribution: DistributionObjectData;
  blendedDescription: string;
  overallActivation: number;
  insights: string[];
  recommendations: string[];
}

export interface TokenDistributionData {
  self: number;
  oneToOne: number;
  social: number;
}

export type SubtypeVariantData = 'self' | 'oneToOne' | 'social';

export interface SubtypeStackData {
  primary: SubtypeVariantData;
  secondary: SubtypeVariantData;
  tertiary: SubtypeVariantData;
  dominance: {
    self: number;
    oneToOne: number;
    social: number;
  };
  stackType: 'dominant' | 'balanced' | 'polarized' | 'integrated' | string;
  stackDescription: string;
  confidence: number;
  rawDistribution: TokenDistributionData;
}

// --- Raw Selections Data ---
export interface RawSelectionsData {
  foundation: (number | null)[]; // Array of 9 selections (0,1,2 or null)
  blocksUserInput: (number | null)[]; // Array of 4 selections (0,1 or null for each pair)
  // For blocks, it might also be useful to store the actual chosenWingNumber if it's pre-processed.
  // For now, sticking to raw user input.

  colorPalettes: { // Selections for Color Palette phase
    ids: (string | number)[]; // IDs of the 2 selected palettes
    indices: [number | null, number | null]; // Original indices (0-4) from availablePalettesData
  };
  colorPaletteDistribution: DistributionObjectData | null; // Percentages for the 2 palettes

  tokenDistribution: TokenDistributionData; // Tokens per container
}

// --- Main Profile Data Interface ---
export interface CompleteProfileDataV1 {
  userId?: string; // Associated user ID if logged in
  assessmentVersion: string; // e.g., "v1.0.0" (as per spec "v18.2" seems like a typo, using semantic versioning)
  completedAt: string; // ISO date string (e.g., new Date().toISOString())
  assessmentDurationSeconds?: number; // Optional: total time taken in seconds

  // Calculated Results
  typeCalculation: PersonalityTypeCalculationData;
  wingCalculation: WingCalculationData | null; // Can be null if primary type not determined
  arrowCalculation: ArrowCalculationData | null; // Can be null if primary type not determined
  stateAnalysisResult: StateAnalysisData | null; // Can be null if not enough palettes selected
  subtypeStackResult: SubtypeStackData | null;   // Can be null if not all tokens placed

  // Raw Selections (for audit, re-calculation, or detailed view)
  rawSelections: RawSelectionsData;
}

// Example usage (conceptual):
// const profileData: CompleteProfileDataV1 = { ... }
```
