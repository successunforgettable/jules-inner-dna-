## Shared TypeScript Type Definition Files

This document contains the content of shared TypeScript type definition files, primarily for defining the structure of the complete assessment profile.

---
**File Path:** `packages/shared/types/assessment.types.ts`
---
```typescript
// packages/shared/types/assessment.types.ts

// --- Calculation Result Types (Redefined for shared context) ---
// These should mirror the structures produced by client-side calculation functions
// and align with what the backend might store or expect.

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

export interface DistributionObjectData {
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
    self: number;    // Percentages
    oneToOne: number;
    social: number;
  };
  stackType: 'dominant' | 'balanced' | 'polarized' | 'integrated' | string;
  stackDescription: string;
  confidence: number;
  rawDistribution: TokenDistributionData; // Raw counts
}

// --- Raw Selections Data ---
// Captures the user's direct choices at each relevant stage.
export interface RawSelectionsData {
  foundation: (number | null)[]; // Array of 9 selections (index 0,1,2 or null) for each stone set

  // For building blocks, stores the user's raw 0 or 1 choice for each of the 4 pairs.
  // Also includes the pre-processed chosenWingNumber for clarity, as it's derived from
  // the first pair's selection and core type before being fed into algorithms.
  blocks: {
    userInput: (number | null)[]; // Array of 4 selections (index 0 or 1) for each block pair
    processedWingChoice: number | null; // The actual wing number derived (e.g., 9 for a Type 1)
  };

  colorPalettes: {
    ids: (string | number)[]; // IDs of the 2 selected palettes
    indices: [number | null, number | null]; // Original indices (0-4) from availablePalettesData
  };
  colorPaletteDistribution: DistributionObjectData | null; // Percentages for the 2 palettes

  tokenDistribution: TokenDistributionData; // Tokens per container (raw counts)
}

// --- Main Profile Data Interface ---
export interface CompleteProfileDataV1 {
  userId?: string; // Associated user ID if logged in and saved to user's account
  guestId?: string; // Associated guest ID if not logged in but saved temporarily or for later association
  assessmentVersion: string; // e.g., "1.0.0" - version of the assessment structure/algorithms
  completedAt: string; // ISO date string (e.g., new Date().toISOString())
  assessmentDurationSeconds?: number; // Optional: total time taken in seconds

  // Calculated Results
  typeCalculation: PersonalityTypeCalculationData;
  wingCalculation: WingCalculationData | null;
  arrowCalculation: ArrowCalculationData | null;
  stateAnalysisResult: StateAnalysisData | null;
  subtypeStackResult: SubtypeStackData | null;

  // Raw Selections (for audit, re-calculation, or detailed view)
  rawSelections: RawSelectionsData;

  // Flag indicating completion
  isAssessmentComplete: boolean;
}
```

This markdown contains the requested shared TypeScript type definition file.
```
