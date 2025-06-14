/**
 * Personality Assessment Calculation Utilities
 * Includes algorithms for:
 * - Primary Type Determination (Sec 2.6)
 * - Wing Determination (Sec 3.5)
 * - Arrow Determination (Sec 3.6)
 * - State Impact Analysis (Sec 4.6)
 * - Subtype Stacking (Sec 5.5)
 */

import { availablePalettesData, getTypeSpecificPaletteData, PaletteInfo } from '../colorPaletteData';
// For subtype labels, if needed, though not directly used in calculation logic itself:
// import { subtypeContainersBaseData } from '../detailElementData';

// --- Common TypeScript Interfaces ---
export interface TypeScores {
  type1: number; type2: number; type3: number; type4: number; type5: number;
  type6: number; type7: number; type8: number; type9: number;
  [key: string]: number;
}
export interface PersonalityTypeCalculation {
  primaryType: string; confidence: number; alternatives: string[];
  allScores: Record<string, number>; rawScores: TypeScores;
}
export type SelectionArray = number[];

// --- Primary Type Algorithm Implementation (Sec 2.6) ---
const INITIAL_TYPE_SCORES: TypeScores = { type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, type6: 0, type7: 0, type8: 0, type9: 0,};
const SET_WEIGHTS: number[] = [3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0];
export const determinePersonalityType = (selections: SelectionArray): PersonalityTypeCalculation => {
  if (selections.length !== 9) { throw new Error(`Invalid selections length: Expected 9, received ${selections.length}.`); }
  if (selections.some(s => s < 0 || s > 2 || !Number.isInteger(s))) { throw new Error(`Invalid selection value found. Selections must be integers 0, 1, or 2. Received: ${JSON.stringify(selections)}`);}
  const typeScores: TypeScores = { ...INITIAL_TYPE_SCORES };
  selections.forEach((selection, setIndex) => {
    const weight = SET_WEIGHTS[setIndex];
    switch (setIndex) {
      case 0: // Set 1: Decision-Making Center
        if (selection === 0) { // Head
          typeScores.type5 += 3 * weight; typeScores.type6 += 2 * weight; typeScores.type7 += 1 * weight;
        } else if (selection === 1) { // Heart
          typeScores.type2 += 3 * weight; typeScores.type3 += 2 * weight; typeScores.type4 += 3 * weight;
        } else { // Body (selection === 2)
          typeScores.type1 += 2 * weight; typeScores.type8 += 3 * weight; typeScores.type9 += 2 * weight;
        }
        break;
      case 1: // Set 2: Core Motivation
        if (selection === 0) { // Fear
          typeScores.type5 += 2 * weight; typeScores.type6 += 3 * weight; typeScores.type7 += 1 * weight;
        } else if (selection === 1) { // Shame
          typeScores.type2 += 2 * weight; typeScores.type3 += 3 * weight; typeScores.type4 += 3 * weight;
        } else { // Anger (selection === 2)
          typeScores.type1 += 3 * weight; typeScores.type8 += 3 * weight; typeScores.type9 += 2 * weight;
        }
        break;
      case 2: // Set 3: Energy Direction
        if (selection === 0) { // Withdrawn
          typeScores.type4 += 2 * weight; typeScores.type5 += 3 * weight; typeScores.type9 += 2 * weight;
        } else if (selection === 1) { // Assertive
          typeScores.type3 += 3 * weight; typeScores.type7 += 2 * weight; typeScores.type8 += 3 * weight;
        } else { // Compliant (selection === 2)
          typeScores.type1 += 2 * weight; typeScores.type2 += 2 * weight; typeScores.type6 += 3 * weight;
        }
        break;
      case 3: // Set 4: Social Approach
        if (selection === 0) { // Detached
          typeScores.type5 += 3 * weight; typeScores.type4 += 2 * weight;
        } else if (selection === 1) { // Attachment
          typeScores.type2 += 3 * weight; typeScores.type6 += 2 * weight;
        } else { // Autonomy (selection === 2)
          typeScores.type1 += 2 * weight; typeScores.type8 += 2 * weight;
        }
        break;
      case 4: // Set 5: Processing Style
        if (selection === 0) { // Conceptual
          typeScores.type5 += 3 * weight; typeScores.type1 += 2 * weight;
        } else if (selection === 1) { // Emotional
          typeScores.type4 += 3 * weight; typeScores.type2 += 2 * weight;
        } else { // Practical (selection === 2)
          typeScores.type3 += 2 * weight; typeScores.type8 += 2 * weight;
        }
        break;
      case 5: // Set 6: Stress Reaction
        if (selection === 0) { // Overthinking
          typeScores.type6 += 3 * weight; typeScores.type5 += 2 * weight;
        } else if (selection === 1) { // Image-focus
          typeScores.type3 += 3 * weight; typeScores.type4 += 2 * weight;
        } else { // Control-seeking (selection === 2)
          typeScores.type8 += 3 * weight; typeScores.type1 += 2 * weight;
        }
        break;
      case 6: // Set 7: Conflict Style
        if (selection === 0) { // Avoiding
          typeScores.type9 += 3 * weight; typeScores.type5 += 1 * weight;
        } else if (selection === 1) { // Accommodating
          typeScores.type2 += 2 * weight; typeScores.type6 += 2 * weight;
        } else { // Confronting (selection === 2)
          typeScores.type8 += 3 * weight; typeScores.type1 += 1 * weight;
        }
        break;
      case 7: // Set 8: Success Definition
        if (selection === 0) { // Correctness
          typeScores.type1 += 3 * weight; typeScores.type6 += 1 * weight;
        } else if (selection === 1) { // Approval
          typeScores.type2 += 3 * weight; typeScores.type3 += 1 * weight;
        } else { // Autonomy (selection === 2)
          typeScores.type5 += 2 * weight; typeScores.type8 += 2 * weight;
        }
        break;
      case 8: // Set 9: Relationship Priority
        if (selection === 0) { // Independence
          typeScores.type5 += 2 * weight; typeScores.type8 += 1 * weight;
        } else if (selection === 1) { // Interdependence
          typeScores.type2 += 2 * weight; typeScores.type9 += 2 * weight;
        } else { // Guidance (selection === 2)
          typeScores.type1 += 1 * weight; typeScores.type8 += 2 * weight;
        }
        break;
      default:
        console.warn(`Unexpected setIndex: ${setIndex}`);
    }
  });
  let totalScore = 0; Object.values(typeScores).forEach(score => totalScore += score);
  const normalizedScores: Record<string, number> = {};
  if (totalScore === 0) { for (let i = 1; i <= 9; i++) { normalizedScores[i.toString()] = 1 / 9; } } else { for (const typeKey in typeScores) { const typeNumber = typeKey.replace('type', ''); normalizedScores[typeNumber] = parseFloat((typeScores[typeKey] / totalScore).toFixed(4)); } }
  let primaryType = "1"; let highestScore = -1;
  for (const typeNumStr in normalizedScores) { if (normalizedScores[typeNumStr] > highestScore) { highestScore = normalizedScores[typeNumStr]; primaryType = typeNumStr; } }
  let confidence = 0; const numTypes = Object.keys(normalizedScores).length;
  if (numTypes > 1 && totalScore > 0) { let sumOfOtherScores = 0; Object.entries(normalizedScores).forEach(([typeNumStr, score]) => { if (typeNumStr !== primaryType) { sumOfOtherScores += score; } }); const avgOtherScore = (numTypes - 1) > 0 ? sumOfOtherScores / (numTypes - 1) : 0; if (highestScore > avgOtherScore) { confidence = Math.min((highestScore - avgOtherScore) * 2, 1.0); } else { confidence = Math.max(0, highestScore * 0.5); } } else if (numTypes === 1 && totalScore > 0) { confidence = 1.0; }
  confidence = parseFloat(confidence.toFixed(4));
  const sortedTypes = Object.entries(normalizedScores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA); const alternatives: string[] = [];
  for (const [typeNumStr] of sortedTypes) { if (typeNumStr !== primaryType && alternatives.length < 2) { alternatives.push(typeNumStr); } }
  return { primaryType, confidence, alternatives, allScores: normalizedScores, rawScores: typeScores };
};

// --- Wing and Arrow Algorithm Definitions (Sec 3.5, 3.6) ---
export type BlockSelectionsProcessed = [ chosenWingNumber: number | null, arrowPairChoice: 0 | 1 | null, growthFocusChoice: 0 | 1 | null, responsePatternChoice: 0 | 1 | null ];
export interface WingCalculation { primaryWing: string; wingStrength: 'strong' | 'moderate'; confidence: number; }
export interface ArrowCalculation { integrationType: string; integrationStrength: 'conscious' | 'developing' | 'less_developed'; disintegrationType: string; disintegrationStrength: 'conscious' | 'developing' | 'less_developed'; confidence: number; }
const WING_OPTIONS_MAP: Record<string, [number, number]> = { "1": [9, 2], "2": [1, 3], "3": [2, 4], "4": [3, 5], "5": [4, 6], "6": [5, 7], "7": [6, 8], "8": [7, 9], "9": [8, 1],};
export const determineWing = (primaryType: string, blockSelections: BlockSelectionsProcessed): WingCalculation | null => {
  if (!primaryType || !WING_OPTIONS_MAP[primaryType]) { console.error("Invalid primary type for wing determination:", primaryType); return null; }
  if (blockSelections.length < 4) { console.error("Insufficient block selections for wing determination."); return null; }
  const chosenWingNumber = blockSelections[0];
  if (chosenWingNumber === null || !WING_OPTIONS_MAP[primaryType].includes(chosenWingNumber)) { return { primaryWing: `${primaryType}w?`, wingStrength: 'moderate', confidence: 0.3 }; }
  const primaryWingString = `${primaryType}w${chosenWingNumber}`;
  // TODO: Spec 3.5 (calculateWingConsistency) implies using all four block selections (A/B choices for Pairs 1-4).
  // The current BlockSelectionsProcessed type ([chosenWingNumber, arrowPairChoice, growthFocusChoice, responsePatternChoice])
  // does not directly provide the A/B choice for Pair 1 (wing selection itself).
  // A more spec-aligned consistency check would require refactoring BlockSelectionsProcessed and its construction in useAssessmentStore.
  // The current logic uses selections from Pair 3 (growthFocusChoice) and Pair 4 (responsePatternChoice).
  let consistencyScore = 0.5; if (blockSelections[2] !== null && blockSelections[3] !== null) { if (blockSelections[2] === blockSelections[3]) { consistencyScore = 0.8; } else { consistencyScore = 0.6; } } else if (blockSelections[2] !== null || blockSelections[3] !== null) { consistencyScore = 0.55; }
  const wingStrength = consistencyScore >= 0.7 ? 'strong' : 'moderate';
  const confidence = parseFloat(Math.min(0.6 + (consistencyScore * 0.4), 0.95).toFixed(4));
  return { primaryWing: primaryWingString, wingStrength, confidence };
};
const ARROW_MAP: Record<string, { integration: number; disintegration: number }> = { "1": { integration: 7, disintegration: 4 }, "2": { integration: 4, disintegration: 8 }, "3": { integration: 6, disintegration: 9 }, "4": { integration: 1, disintegration: 2 }, "5": { integration: 8, disintegration: 7 }, "6": { integration: 9, disintegration: 3 }, "7": { integration: 5, disintegration: 1 }, "8": { integration: 2, disintegration: 5 }, "9": { integration: 3, disintegration: 6 },};
export const determineArrows = (primaryType: string, blockSelections: BlockSelectionsProcessed): ArrowCalculation | null => {
  if (!primaryType || !ARROW_MAP[primaryType]) { console.error("Invalid primary type for arrow determination:", primaryType); return null; }
  const arrows = ARROW_MAP[primaryType];
  if (blockSelections.length < 4 || blockSelections[1] === null) { return { integrationType: arrows.integration.toString(), integrationStrength: 'less_developed', disintegrationType: arrows.disintegration.toString(), disintegrationStrength: 'less_developed', confidence: 0.3, }; }
  const arrowPairChoice = blockSelections[1];
  let integrationStrength: ArrowCalculation['integrationStrength'] = 'developing'; let disintegrationStrength: ArrowCalculation['disintegrationStrength'] = 'developing';
  if (arrowPairChoice === 0) { integrationStrength = 'conscious'; disintegrationStrength = 'developing'; } else { disintegrationStrength = 'conscious'; integrationStrength = 'developing'; }
  let confidence = 0.5;
  if (blockSelections[2] !== null && blockSelections[3] !== null) {
    // Spec 3.6: calculateArrowConfidence uses consistency of 0.8 or 0.6 for supporting selections.
    // confidence = Math.min(0.5 + (blockSelections[2] === blockSelections[3] ? 0.4 : 0.2), 0.9); // Original
    confidence = Math.min(0.5 + (blockSelections[2] === blockSelections[3] ? 0.8 : 0.6), 0.9); // Updated as per spec
  } else if (blockSelections[2] !== null || blockSelections[3] !== null) {
    confidence = 0.5 + 0.1; // This case remains 0.6, spec doesn't explicitly detail partial selection for this part.
  }
  return { integrationType: arrows.integration.toString(), integrationStrength, disintegrationType: arrows.disintegration.toString(), disintegrationStrength, confidence: parseFloat(confidence.toFixed(4)) };
};

// --- State Impact Algorithm Definitions (Sec 4.6) ---
export type StateSelectionsIndices = [number, number];
export interface DistributionObject { primaryPercentage: number; secondaryPercentage: number; }
export interface StateAnalysis { primaryState: string; secondaryState: string; distribution: DistributionObject; blendedDescription: string; overallActivation: number; insights: string[]; recommendations: string[];}
const ACTIVATION_LEVELS: Record<string, number> = { "state_very_good": 90, "state_good": 70, "state_average": 50, "state_below_average": 30, "state_destructive": 10,};
const getActivationLevelByStateId = (stateId: string): number => ACTIVATION_LEVELS[stateId] || 0;
const generateBlendedDescription = (primaryDesc: string, secondaryDesc: string, primaryWeight: number ): string => { if (primaryWeight > 0.7) { return `${primaryDesc} This state is dominant, though sometimes influenced by tendencies towards: "${secondaryDesc}"`; } else if (primaryWeight < 0.3) { return `${secondaryDesc} This state is dominant, though sometimes influenced by tendencies towards: "${primaryDesc}"`; } else { return `A blend of two prominent states: "${primaryDesc}" and "${secondaryDesc}" are often experienced in balance or fluctuate frequently.`; }};
const generateStateInsights = (personalityType: string | null, primaryStateInfo: PaletteInfo, secondaryStateInfo: PaletteInfo, distribution: DistributionObject, overallActivation: number): string[] => { const insights: string[] = []; const primaryStateName = primaryStateInfo.stateName; const secondaryStateName = secondaryStateInfo.stateName; insights.push(`Your overall state activation level is ${overallActivation} out of 100.`); if (overallActivation >= 70) insights.push("This indicates a generally high level of resourcefulness and positive engagement."); else if (overallActivation >= 50) insights.push("This suggests a balanced but sometimes inconsistent activation of your potential."); else insights.push("This may indicate significant stress or underutilization of your core strengths. Focusing on foundational well-being is key."); insights.push(`You primarily operate in a state of "${primaryStateName}" (${distribution.primaryPercentage}%).`); insights.push(`Your secondary state is "${secondaryStateName}" (${distribution.secondaryPercentage}%).`); const primaryActivation = getActivationLevelByStateId(primaryStateInfo.id); const secondaryActivation = getActivationLevelByStateId(secondaryStateInfo.id); const stateGap = Math.abs(primaryActivation - secondaryActivation); if (stateGap > 40) insights.push("There's a significant difference in energy between your two primary states, which might lead to feelings of internal conflict or inconsistency."); else if (stateGap > 20) insights.push("Your two primary states have distinct energy levels, suggesting flexibility but also potential for noticeable shifts in experience."); else insights.push("Your two primary states are relatively close in energy, suggesting a more consistent operational mode or subtle shifts between them."); if (personalityType) { insights.push(`For a Type ${personalityType}, this blend of states suggests specific patterns... (detailed type-specific insight to be added)`); } return insights;};
const generateStateRecommendations = (personalityType: string | null, overallActivation: number): string[] => { const recommendations: string[] = []; if (overallActivation < 50) recommendations.push("Consider practices that reduce stress and build foundational security and self-awareness."); else if (overallActivation < 75) recommendations.push("Explore strategies to more consistently access your higher-energy states and manage triggers for lower-energy ones."); else recommendations.push("Continue leveraging your strengths and explore new ways to maintain your high level of positive engagement and flow."); if (personalityType) { recommendations.push(`Type ${personalityType} specific recommendation: ... (detailed type-specific recommendation to be added)`); } recommendations.push("Mindfulness and self-reflection can help in understanding and navigating these states effectively."); return recommendations;};
export const calculateStateImpact = (stateSelectionsIndices: StateSelectionsIndices, distribution: DistributionObject, personalityType: string | null ): StateAnalysis | null => { if (stateSelectionsIndices.length !== 2 || !stateSelectionsIndices.every(index => index >= 0 && index < availablePalettesData.length)) { console.error("Invalid state selections indices:", stateSelectionsIndices); return null; } if (!distribution || (distribution.primaryPercentage + distribution.secondaryPercentage !== 100)) { console.error("Invalid distribution:", distribution); return null; } const primaryPaletteBase = availablePalettesData[stateSelectionsIndices[0]]; const secondaryPaletteBase = availablePalettesData[stateSelectionsIndices[1]]; if (!primaryPaletteBase || !secondaryPaletteBase) { console.error("Could not find palette data for selected indices."); return null; } const primaryPaletteDisplay = getTypeSpecificPaletteData(primaryPaletteBase, personalityType); const secondaryPaletteDisplay = getTypeSpecificPaletteData(secondaryPaletteBase, personalityType); const primaryActivation = getActivationLevelByStateId(primaryPaletteBase.id); const secondaryActivation = getActivationLevelByStateId(secondaryPaletteBase.id); const overallActivation = Math.round((primaryActivation * (distribution.primaryPercentage / 100)) + (secondaryActivation * (distribution.secondaryPercentage / 100))); const blendedDescription = generateBlendedDescription(primaryPaletteDisplay.description, secondaryPaletteDisplay.description, distribution.primaryPercentage / 100); const insights = generateStateInsights(personalityType,primaryPaletteBase,secondaryPaletteBase,distribution,overallActivation); const recommendations = generateStateRecommendations(personalityType, overallActivation); return { primaryState: primaryPaletteBase.stateName, secondaryState: secondaryPaletteBase.stateName, distribution, blendedDescription, overallActivation, insights, recommendations, };};

// --- Subtype Stacking Algorithm Definitions (Sec 5.5) ---

export interface TokenDistribution {
  self: number;    // Count of tokens in Self-Preservation container
  oneToOne: number; // Count of tokens in One-to-One (Sexual) container
  social: number;  // Count of tokens in Social container
}

export type SubtypeVariant = 'self' | 'oneToOne' | 'social';

export interface SubtypeStack {
  primary: SubtypeVariant;
  secondary: SubtypeVariant;
  tertiary: SubtypeVariant;
  dominance: { // Percentages or raw counts, spec implies percentages for clarity
    self: number;
    oneToOne: number;
    social: number;
  };
  stackType: 'dominant' | 'balanced' | 'polarized' | 'integrated' | string; // Allow string for flexibility
  stackDescription: string;
  confidence: number; // From calculateDistributionClarity
  rawDistribution: TokenDistribution;
}

// Helper: Calculate Distribution Clarity (Confidence for Subtype Stack) (Sec 5.5)
const calculateDistributionClarity = (
  dominanceScores: { self: number; oneToOne: number; social: number } // Percentages
): number => {
  const scores = Object.values(dominanceScores).sort((a, b) => b - a); // Sort descending
  const primaryPercent = scores[0];   // e.g., 60 for 6 tokens (60%)
  const secondaryPercent = scores[1]; // e.g., 30 for 3 tokens (30%)
  // const tertiaryPercent = scores[2]; // e.g., 10 for 1 token (10%)

  // primaryGap: Difference between dominant and secondary instinct (max 100, if secondary/tertiary are 0)
  // secondaryGap: Difference between secondary and tertiary instinct (max value of secondary, if tertiary is 0)
  // Spec: primaryGap (dominant - secondary), secondaryGap (secondary - tertiary)
  // Max possible primaryGap is 100 (e.g. 100,0,0), min 0 (e.g. 33,33,33)
  // Max possible secondaryGap is 50 (e.g. 50,50,0), min 0 (e.g. 33,33,33 or 100,0,0)
  // The spec formula `(primaryGap + secondaryGap) / 80` seems to aim for a range.
  // Max value of (primaryGap + secondaryGap) could be (100-0) + (0-0) = 100 if distribution is 10,0,0.
  // Or (50-50) + (50-0) = 50 if distribution is 5,5,0.
  // Or (70-20) + (20-10) = 50+10=60 if 7,2,1.
  // The divisor 80 suggests the max expected sum is 80 to get clarity = 1.

  const primaryGap = primaryPercent - secondaryPercent;
  const secondaryGap = secondaryPercent - (scores[2] || 0); // scores[2] could be undefined if only 2 have values (not possible with 10 tokens)

  let clarity = Math.min((primaryGap + secondaryGap) / 80, 1.0); // Cap at 1.0
  clarity = Math.max(clarity, 0.3); // Minimum confidence 0.3
  return parseFloat(clarity.toFixed(4));
};

// Helper: Generate Stack Description (Sec 5.5)
const generateStackDescription = (
  personalityType: string | null, // For potential type-specific nuances later
  sortedSubtypes: Array<{ name: SubtypeVariant; count: number; label: string }>,
  stackType: string
): string => {
  const primary = sortedSubtypes[0];
  const secondary = sortedSubtypes[1];
  const tertiary = sortedSubtypes[2];

  const descriptions: Record<string, string> = {
    dominant: `This indicates a strong focus on your ${primary.label} instinct (${primary.count} tokens), which consistently guides your attention and behavior. Your ${secondary.label} (${secondary.count} tokens) plays a supportive role, while your ${tertiary.label} instinct (${tertiary.count} tokens) is often backgrounded or less developed.`,
    balanced: `Your instinctual energies show a relatively balanced distribution, with ${primary.label} (${primary.count} tokens) and ${secondary.label} (${secondary.count} tokens) being similarly influential. Your ${tertiary.label} instinct (${tertiary.count} tokens) is present but less prioritized. This suggests flexibility but may sometimes lead to indecision between your top two focuses.`,
    polarized: `There's a clear polarization in your instinctual stacking. Your ${primary.label} instinct (${primary.count} tokens) is well-developed, and your ${secondary.label} (${secondary.count} tokens) also plays a significant part. However, your ${tertiary.label} instinct (${tertiary.count} tokens) is markedly less developed, creating a potential blind spot.`,
    integrated: `Your instincts show an integrated pattern, with ${primary.label} (${primary.count} tokens) leading, followed by ${secondary.label} (${secondary.count} tokens), and ${tertiary.label} (${tertiary.count} tokens) also contributing. This suggests a capacity to access all three instinctual drives as needed, though with a clear primary preference.`,
    default: `Your distribution shows ${primary.label} as most prominent (${primary.count} tokens), followed by ${secondary.label} (${secondary.count} tokens), and lastly ${tertiary.label} (${tertiary.count} tokens). Understanding this hierarchy can help you navigate your priorities and potential areas of neglect.`
  };

  let desc = descriptions[stackType] || descriptions.default;
  if (personalityType) {
    // Example: " As a Type X, this {stackType} stacking often manifests as..."
    desc += ` For a Type ${personalityType}, this ${stackType} stacking often means... (type-specific nuances to be added).`;
  }
  return desc;
};


// --- Main Subtype Stacking Function (Sec 5.5) ---
export const determineSubtypeStack = (
  distribution: TokenDistribution,
  personalityType: string | null
): SubtypeStack | null => {
  const totalTokens = distribution.self + distribution.oneToOne + distribution.social;
  if (totalTokens !== 10) {
    console.error("Invalid token distribution: Total tokens must be 10.", distribution);
    return null;
  }

  const subtypesWithData = [
    { name: 'self' as SubtypeVariant, count: distribution.self, label: 'Self-Preservation' },
    { name: 'oneToOne' as SubtypeVariant, count: distribution.oneToOne, label: 'One-to-One' },
    { name: 'social' as SubtypeVariant, count: distribution.social, label: 'Social' },
  ];

  // Sort subtypes by count in descending order
  const sortedSubtypes = subtypesWithData.sort((a, b) => b.count - a.count);

  const primaryVariant = sortedSubtypes[0];
  const secondaryVariant = sortedSubtypes[1];
  const tertiaryVariant = sortedSubtypes[2];

  // Calculate Dominance Percentages
  const dominancePercentages = {
    self: parseFloat(((distribution.self / totalTokens) * 100).toFixed(2)),
    oneToOne: parseFloat(((distribution.oneToOne / totalTokens) * 100).toFixed(2)),
    social: parseFloat(((distribution.social / totalTokens) * 100).toFixed(2)),
  };

  // Determine Stack Type
  let stackType: SubtypeStack['stackType'] = 'integrated'; // Default
  if (primaryVariant.count >= 6) {
    stackType = 'dominant';
  } else if (primaryVariant.count - secondaryVariant.count <= 1) {
    stackType = 'balanced';
  } else if (tertiaryVariant.count <= 1) { // And not dominant or balanced
    stackType = 'polarized';
  }
  // If none of the above, it remains 'integrated' (moderate spread)

  // Generate Stack Description
  const stackDescription = generateStackDescription(personalityType, sortedSubtypes, stackType);

  // Calculate Confidence (Distribution Clarity)
  const confidence = calculateDistributionClarity(dominancePercentages);

  return {
    primary: primaryVariant.name,
    secondary: secondaryVariant.name,
    tertiary: tertiaryVariant.name,
    dominance: dominancePercentages,
    stackType,
    stackDescription,
    confidence,
    rawDistribution: distribution,
  };
};
```
