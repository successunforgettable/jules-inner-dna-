import { describe, it, expect, vi } from 'vitest'; // Added vi for mocking
import {
  determinePersonalityType, PersonalityTypeCalculation, SelectionArray, TypeScores,
  determineWing, WingCalculation,
  determineArrows, ArrowCalculation, BlockSelectionsProcessed,
  calculateStateImpact, StateAnalysis, StateSelectionsIndices, DistributionObject,
  determineSubtypeStack, SubtypeStack, TokenDistribution, // Added SubtypeStack types
} from './personalityCalculations';
// Import availablePalettesData to use valid state IDs in tests for calculateStateImpact
// For calculateStateImpact, we mock getTypeSpecificPaletteData, so direct import of PaletteInfo might not be needed here
// import { availablePalettesData, getTypeSpecificPaletteData } from '../colorPaletteData';

// Mock colorPaletteData for calculateStateImpact tests to control descriptions
vi.mock('../colorPaletteData', async () => {
  const actual = await vi.importActual('../colorPaletteData') as any;
  return {
    ...actual, // Use actual availablePalettesData
    getTypeSpecificPaletteData: (palette, personalityType) => ({
      ...palette,
      description: personalityType ? `Type ${personalityType} specific for ${palette.stateName}` : palette.genericDescription,
      gradientStyle: palette.baseGradientStyle,
    }),
  };
});


describe('determinePersonalityType Algorithm', () => {
  // ... existing tests ...
  it('should correctly calculate a known primary type with high confidence', () => {
    const selections: SelectionArray = [0, 2, 1, 0, 2, 1, 0, 1, 0];
    const result = determinePersonalityType(selections);
    expect(result.primaryType).toBe('1');
    expect(result.confidence).toBeGreaterThan(0.6);
  });
});

describe('determineWing Algorithm', () => {
  // ... existing tests ...
  it('should determine Type 1w9 with strong strength and high confidence', () => {
    const selections: BlockSelectionsProcessed = [9, 0, 0, 0];
    const result = determineWing("1", selections);
    expect(result?.primaryWing).toBe("1w9");
    expect(result?.wingStrength).toBe('strong');
    expect(result?.confidence).toBeCloseTo(0.92);
  });
});

describe('determineArrows Algorithm', () => {
  // ... existing tests ...
  it('should determine Type 1 arrows with conscious integration', () => {
    const selections: BlockSelectionsProcessed = [9, 0, 0, 0];
    const result = determineArrows("1", selections);
    expect(result?.integrationType).toBe("7");
    expect(result?.integrationStrength).toBe('conscious');
    expect(result?.confidence).toBeCloseTo(0.9);
  });
});

describe('calculateStateImpact Algorithm', () => {
  // ... existing tests ...
  it('should calculate state impact correctly for valid inputs (dominant primary)', () => {
    const selections: StateSelectionsIndices = [0, 1];
    const distribution: DistributionObject = { primaryPercentage: 80, secondaryPercentage: 20 };
    const result = calculateStateImpact(selections, distribution, "1");
    expect(result?.overallActivation).toBe(86);
    expect(result?.blendedDescription).toContain("This state is dominant");
  });
});


describe('determineSubtypeStack Algorithm', () => {
  const type1 = "1"; // Example personality type

  it('should determine a "dominant" stack type correctly', () => {
    const distribution: TokenDistribution = { self: 7, oneToOne: 2, social: 1 };
    const result = determineSubtypeStack(distribution, type1);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.primary).toBe('self');
    expect(result.secondary).toBe('oneToOne');
    expect(result.tertiary).toBe('social');
    expect(result.stackType).toBe('dominant');
    expect(result.dominance.self).toBe(70);
    expect(result.dominance.oneToOne).toBe(20);
    expect(result.dominance.social).toBe(10);
    expect(result.stackDescription).toContain('strong focus on your Self-Preservation instinct');
    // Confidence for 7,2,1: primaryGap=50, secondaryGap=10. (50+10)/80 = 60/80 = 0.75
    expect(result.confidence).toBeCloseTo(0.75);
  });

  it('should determine a "balanced" stack type correctly', () => {
    const distribution: TokenDistribution = { self: 4, oneToOne: 3, social: 3 };
    const result = determineSubtypeStack(distribution, type1);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.primary).toBe('self');
    // Secondary/tertiary can be oneToOne or social depending on tie-breaking in sort (not specified, so accept either)
    expect(['oneToOne', 'social']).toContain(result.secondary);
    expect(['oneToOne', 'social']).toContain(result.tertiary);
    expect(result.stackType).toBe('balanced');
    // Confidence for 4,3,3: primaryGap=10, secondaryGap=0. (10+0)/80 = 10/80 = 0.125. Capped at min 0.3.
    expect(result.confidence).toBeCloseTo(0.3);
  });

  it('should determine a "polarized" stack type correctly', () => {
    const distribution: TokenDistribution = { self: 5, oneToOne: 4, social: 1 }; // Not dominant, not balanced, tertiary <=1
    const result = determineSubtypeStack(distribution, type1);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.primary).toBe('self');
    expect(result.secondary).toBe('oneToOne');
    expect(result.tertiary).toBe('social');
    expect(result.stackType).toBe('polarized');
    expect(result.stackDescription).toContain('clear polarization');
    // Confidence for 5,4,1: primaryGap=10, secondaryGap=30. (10+30)/80 = 40/80 = 0.5
    expect(result.confidence).toBeCloseTo(0.5);
  });

  it('should determine an "integrated" stack type correctly', () => {
    const distribution: TokenDistribution = { self: 5, oneToOne: 3, social: 2 }; // Not dominant, not balanced, tertiary > 1
    const result = determineSubtypeStack(distribution, type1);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.primary).toBe('self');
    expect(result.secondary).toBe('oneToOne');
    expect(result.tertiary).toBe('social');
    expect(result.stackType).toBe('integrated');
    expect(result.stackDescription).toContain('integrated pattern');
     // Confidence for 5,3,2: primaryGap=20, secondaryGap=10. (20+10)/80 = 30/80 = 0.375
    expect(result.confidence).toBeCloseTo(0.375);
  });

  it('should return null if total tokens are not 10', () => {
    const distribution: TokenDistribution = { self: 5, oneToOne: 3, social: 1 }; // Sums to 9
    expect(determineSubtypeStack(distribution, type1)).toBeNull();
  });

  describe('calculateDistributionClarity helper', () => {
    // This helper is internal, but its logic is key to confidence.
    // We can infer its behavior via the main function's confidence output.
    // Example: Max clarity (10,0,0) -> primaryPercent=100, secondary=0, tertiary=0
    // primaryGap=100, secondaryGap=0. (100+0)/80 = 1.25. Capped at 1.0.
    it('should yield max confidence of 1.0 for extreme distribution (10,0,0)', () => {
        const distribution: TokenDistribution = { self: 10, oneToOne: 0, social: 0 };
        const result = determineSubtypeStack(distribution, type1);
        expect(result?.confidence).toBe(1.0);
    });

    // Example: Min clarity (e.g., 4,3,3 or 3,3,4) -> primaryPercent=40, secondary=30, tertiary=30
    // primaryGap=10, secondaryGap=0. (10+0)/80 = 0.125. Capped at min 0.3.
    it('should yield min confidence of 0.3 for very balanced distribution (4,3,3)', () => {
        const distribution: TokenDistribution = { self: 4, oneToOne: 3, social: 3 };
        const result = determineSubtypeStack(distribution, type1);
        expect(result?.confidence).toBe(0.3);
    });
  });
});
