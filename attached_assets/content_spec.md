# Personality Mosaic Assessment System - Content Specification

> **Important**: This document contains detailed content mappings, business logic, and content specifications. For technical implementation details and architecture, please refer to `tech_spec_v2.md`.

## Document Control

| Version | Date | Author | Changes |
|---------|------|---------|---------|
| v18.1 | 2025-05-21 | Content Team | Separated content specification from technical specification |
| v18.0 | 2025-05-20 | Initial Team | Original combined specification |

## Purpose

This document serves as the authoritative source for:
- Content mappings and relationships
- Business logic and rules
- User experience flows
- Content generation rules
- Assessment algorithms
- Report generation content

## Table of Contents

1. [Assessment Content](#1-assessment-content)
2. [Business Logic](#2-business-logic)
3. [User Experience Content](#3-user-experience-content)
4. [Report Generation](#4-report-generation)

## 1. Assessment Content

### 1.1 Foundation Stone Content

#### Stone Sets and Mappings

Each stone set represents a fundamental aspect of personality assessment. The selection and placement of stones form the basis for type determination.

**Stone Set 1: Decision-Making Center**
- Stone A: THINKING • ANALYSIS • LOGIC
  - Primary mapping: Types 5, 6, 7
  - Secondary mapping: Types 1, 3
- Stone B: FEELING • EMOTION • CONNECTION
  - Primary mapping: Types 2, 3, 4
  - Secondary mapping: Types 6, 9
- Stone C: ACTION • INSTINCT • PHYSICALITY
  - Primary mapping: Types 8, 1, 9
  - Secondary mapping: Types 3, 7

**Stone Set 2: Core Motivations**
- Stone A: PREPARATION • CERTAINTY • SECURITY
  - Primary mapping: Types 5, 6
  - Secondary mapping: Types 1, 9
- Stone B: AUTHENTICITY • IMAGE • RECOGNITION
  - Primary mapping: Types 2, 3, 4
  - Secondary mapping: Types 7, 8
- Stone C: JUSTICE • CONTROL • STRENGTH
  - Primary mapping: Types 1, 8
  - Secondary mapping: Types 3, 6

**Stone Set 3: Energy Direction**
- Stone A: REFLECTION • DEPTH • PRIVACY
  - Primary mapping: Types 4, 5, 9
  - Secondary mapping: Types 1, 6
- Stone B: ACHIEVEMENT • INFLUENCE • IMPACT
  - Primary mapping: Types 3, 7, 8
  - Secondary mapping: Types 1, 2
- Stone C: STRUCTURE • SUPPORT • HARMONY
  - Primary mapping: Types 1, 2, 6, 9
  - Secondary mapping: Types 3, 5

**Stone Set 4: Social Approach**
- Stone A: OBJECTIVITY • PERSPECTIVE • SPACE
  - Primary mapping: Types 5, 9
  - Secondary mapping: Types 4, 1
- Stone B: CLOSENESS • INTIMACY • BONDING
  - Primary mapping: Types 2, 6
  - Secondary mapping: Types 4, 9
- Stone C: INDEPENDENCE • SELF-RELIANCE • FREEDOM
  - Primary mapping: Types 4, 8
  - Secondary mapping: Types 5, 7

**Stone Set 5: Processing Style**
- Stone A: SYSTEMS • CONCEPTS • IDEAS
  - Primary mapping: Types 5, 6, 1
  - Secondary mapping: Types 7, 3
- Stone B: EXPRESSION • MOOD • FEELING
  - Primary mapping: Types 4, 2
  - Secondary mapping: Types 7, 9
- Stone C: RESULTS • EFFICIENCY • UTILITY
  - Primary mapping: Types 3, 8
  - Secondary mapping: Types 1, 7

**Stone Set 6: Stress Reaction**
- Stone A: VIGILANCE • ANALYSIS • FORESIGHT
  - Primary mapping: Types 5, 6
  - Secondary mapping: Types 1, 9
- Stone B: RECOGNITION • IDENTITY • UNIQUENESS
  - Primary mapping: Types 2, 3, 4
  - Secondary mapping: Types 7, 8
- Stone C: AUTHORITY • POWER • DIRECTION
  - Primary mapping: Types 1, 8
  - Secondary mapping: Types 3, 6

**Stone Set 7: Conflict Style**
- Stone A: PEACE • MEDIATION • COMPROMISE
  - Primary mapping: Types 9, 2
  - Secondary mapping: Types 4, 6
- Stone B: SUPPORT • FLEXIBILITY • ADAPTATION
  - Primary mapping: Types 2, 7
  - Secondary mapping: Types 9, 3
- Stone C: DIRECTNESS • CHALLENGE • HONESTY
  - Primary mapping: Types 8, 1
  - Secondary mapping: Types 3, 6

**Stone Set 8: Success Definition**
- Stone A: ACCURACY • PRINCIPLES • IMPROVEMENT
  - Primary mapping: Types 1, 5
  - Secondary mapping: Types 3, 6
- Stone B: CONNECTION • ACKNOWLEDGMENT • APPRECIATION
  - Primary mapping: Types 2, 4
  - Secondary mapping: Types 7, 9
- Stone C: MASTERY • ACHIEVEMENT • CAPABILITY
  - Primary mapping: Types 3, 8
  - Secondary mapping: Types 1, 7

**Stone Set 9: Relationship Priority**
- Stone A: AUTONOMY • SELF-SUFFICIENCY • SPACE
  - Primary mapping: Types 4, 5, 8
  - Secondary mapping: Types 1, 7
- Stone B: MUTUALITY • SHARING • RECIPROCITY
  - Primary mapping: Types 2, 6, 9
  - Secondary mapping: Types 3, 7
- Stone C: LEADERSHIP • MENTORSHIP • DIRECTION
  - Primary mapping: Types 1, 3, 8
  - Secondary mapping: Types 2, 6

### 1.2 Building Block Content

#### Block Pairs and Type Relationships

**Type 1 Block Pairs:**
- Wing Determination:
  - Block A: "I seek peace and maintain calm while upholding standards" (1w9)
  - Block B: "I help others improve and feel responsible for their growth" (1w2)
- Integration Direction:
  - Block A: "When growing, I become more spontaneous and open to possibilities" (→7)
  - Block B: "Under stress, I become more emotional and sensitive to flaws" (→4)

**Type 2 Block Pairs:**
- Wing Determination:
  - Block A: "I support others through structure and principled service" (2w1)
  - Block B: "I help others while maintaining a positive, successful image" (2w3)
- Integration Direction:
  - Block A: "When growing, I become more authentic and in touch with my needs" (→4)
  - Block B: "Under stress, I become more controlling and demanding" (→8)

[Continue with all block pairs from original spec...]

### 1.3 Color Palette Content

#### State Colors and Meanings

**Very Good State:**
- Primary: #22c55e
- Light: #4ade80
- Dark: #166534
- Meaning: Represents optimal functioning, integration, and growth
- Type-specific manifestations: [Details from original spec...]

**Good State:**
- Primary: #10b981
- Light: #34d399
- Dark: #065f46
- Meaning: Represents healthy functioning with some room for growth
- Type-specific manifestations: [Details for each type...]

**Average State:**
- Primary: #f59e0b
- Light: #fcd34d
- Dark: #b45309
- Meaning: Represents typical functioning with both strengths and challenges
- Type-specific manifestations: [Details for each type...]

[Continue with all color states from original spec...]

### 1.4 Detail Element Content

#### Subtype Containers

**Type 1 Subtypes:**
- Self-Preservation:
  - Title: "🛡️ Self-Preservation -- Inner Tension"
  - Description: "You manage stress by focusing on routines and doing things the right way..."
- Social:
  - Title: "🧱 Social -- Principled Example"
  - Description: "You see yourself as a role model, acting with dignity and moral clarity..."
- One-to-One:
  - Title: "🔥 Sexual -- Relational Fire"
  - Description: "You carry a fiery sense of responsibility for those close to you..."

[Continue with all subtype content from original spec...]

## 2. Business Logic

### 2.1 Type Determination Algorithm

```typescript
function calculateTypeScore(selections: number[], typeWeights: TypeWeights): TypeScores {
  const scores = initializeScores();
  
  selections.forEach((selection, index) => {
    const weight = typeWeights[index];
    applySelectionScore(scores, selection, weight);
  });
  
  return normalizeScores(scores);
}
```

### 2.2 Wing Calculation Algorithm

```typescript
function determineWing(primaryType: number, blockSelections: number[]): WingResult {
  // First block selection determines primary wing
  const primaryWingSelection = blockSelections[0];
  
  // Wing mapping based on primary type
  const wingMap = {
    '1': primaryWingSelection === 0 ? '9' : '2',
    '2': primaryWingSelection === 0 ? '1' : '3',
    '3': primaryWingSelection === 0 ? '2' : '4',
    '4': primaryWingSelection === 0 ? '3' : '5',
    '5': primaryWingSelection === 0 ? '4' : '6',
    '6': primaryWingSelection === 0 ? '5' : '7',
    '7': primaryWingSelection === 0 ? '6' : '8',
    '8': primaryWingSelection === 0 ? '7' : '9',
    '9': primaryWingSelection === 0 ? '8' : '1'
  };
  
  // Calculate confidence based on consistency
  const confidenceBase = blockSelections[1] === 0 ? 0.85 : 0.7;
  
  return {
    primaryWing: `${primaryType}w${wingMap[primaryType]}`,
    wingStrength: blockSelections[1] === 0 ? 'strong' : 'moderate',
    confidence: confidenceBase
  };
}
```

### 2.3 Arrow Determination Algorithm

```typescript
function determineArrows(primaryType: number, blockSelections: number[]): ArrowResult {
  const arrowMap = {
    '1': { integration: '7', disintegration: '4' },
    '2': { integration: '4', disintegration: '8' },
    '3': { integration: '6', disintegration: '9' },
    '4': { integration: '1', disintegration: '2' },
    '5': { integration: '8', disintegration: '7' },
    '6': { integration: '9', disintegration: '3' },
    '7': { integration: '5', disintegration: '1' },
    '8': { integration: '2', disintegration: '5' },
    '9': { integration: '3', disintegration: '6' }
  };
  
  // 3rd block selection confirms integration direction
  const integrationDirection = arrowMap[primaryType].integration;
  const integrationStrength = blockSelections[2] === 0 ? 'strong' : 'moderate';
  
  // 4th block selection confirms disintegration direction
  const disintegrationDirection = arrowMap[primaryType].disintegration;
  const disintegrationStrength = blockSelections[3] === 0 ? 'strong' : 'moderate';
  
  return {
    integration: integrationDirection,
    integrationStrength: integrationStrength,
    disintegration: disintegrationDirection,
    disintegrationStrength: disintegrationStrength
  };
}
```

## 3. User Experience Content

### 3.1 Interaction Patterns

#### Foundation Phase
- Stone presentation: 3 at a time
- Selection feedback: Visual highlight + sound
- Placement animation: Float to foundation
- Progress indication: X/9 sets completed

### 3.2 State Analysis Algorithm

```typescript
function calculateStateImpact(
  stateSelections: number[],
  distribution: StateDistribution,
  personalityType: string
): StateAnalysis {
  // Map of state descriptions for each personality type
  const stateDescriptions = {
    '1': {
      veryGood: "Operating with balanced discernment. Accept imperfection while advocating for improvement.",
      good: "Striving for excellence with perspective. Maintaining principles with reasonable flexibility.",
      average: "Focused on correctness and order. Inner critic is active but manageable.",
      belowAverage: "Becoming rigid and judgmental. Increasing frustration with errors.",
      destructive: "Trapped in critical perfectionism. Intense anger at disorder and impossible standards."
    },
    // ... descriptions for all 9 types
  };

  // Get selected states
  const stateNames = ['veryGood', 'good', 'average', 'belowAverage', 'destructive'];
  const primaryState = stateNames[stateSelections[0]];
  const secondaryState = stateNames[stateSelections[1]];
  
  // Get descriptions
  const primaryDescription = stateDescriptions[personalityType][primaryState];
  const secondaryDescription = stateDescriptions[personalityType][secondaryState];
  
  // Calculate blended description
  const blendedDescription = generateBlendedDescription(
    primaryDescription,
    secondaryDescription,
    distribution.primaryPercentage / 100
  );
  
  // Generate insights
  const insights = generateStateInsights(
    personalityType,
    primaryState,
    secondaryState,
    distribution
  );
  
  return {
    primaryState,
    secondaryState,
    distribution,
    blendedDescription,
    insights
  };
}
```

### 3.3 Subtype Analysis Algorithm

```typescript
function analyzeSubtypeStack(distribution: SubtypeDistribution): SubtypeAnalysis {
  const { self, oneToOne, social } = distribution;
  
  // Sort subtypes by token count
  const subtypes = [
    { name: 'self', count: self },
    { name: 'oneToOne', count: oneToOne },
    { name: 'social', count: social }
  ].sort((a, b) => b.count - a.count);
  
  // Calculate dominance percentages
  const total = self + oneToOne + social;
  const dominanceScores = {
    self: (self / total) * 100,
    oneToOne: (oneToOne / total) * 100,
    social: (social / total) * 100
  };
  
  // Determine stack type
  const highestScore = Math.max(...Object.values(dominanceScores));
  const stackType = highestScore >= 50 ? 'dominant' : 'balanced';
  
  return {
    primary: subtypes[0].name,
    secondary: subtypes[1].name,
    tertiary: subtypes[2].name,
    dominance: dominanceScores,
    stackType: stackType
  };
}
```

## 4. Report Generation

### 4.1 Content Translation Framework

#### State Translation Table
| Enneagram State | Heart Activation Term | Range |
|-----------------|----------------------|--------|
| Very Good | Fully Activated Heart State | 80-100% |
| Good | Engaged Heart State | 60-79% |
| Average | Partially Activated Heart State | 40-59% |
| Below Average | Restricted Heart State | 20-39% |
| Destructive | Disconnected Heart State | 0-19% |

[Continue with all translation tables and frameworks...]

### 4.2 Domain Impact Mapping

#### Life Domain Definitions

Each Core Energy Pattern impacts the 8 Wheel of Life domains differently:

1. Health & Vitality
2. Career & Purpose
3. Financial Abundance
4. Intimate Relationships
5. Family Harmony
6. Social Connection
7. Personal Growth
8. Spiritual Alignment

#### Impact Mapping for Type 1 (Integrity-Driven Excellence Pattern)

| Domain | High Activation Impact | Low Activation Impact |
|--------|----------------------|---------------------|
| Health & Vitality | Balanced self-care with healthy boundaries | Rigid health regimens causing stress |
| Career & Purpose | Ethical leadership and quality focus | Perfectionism limiting advancement |
| Financial Abundance | Responsible planning and ethical wealth | Excessive caution limiting opportunities |
| Intimate Relationships | Reliable partnership with healthy boundaries | Critical judgment creating distance |
| Family Harmony | Stable structure with clear values | Excessive expectations creating tension |
| Social Connection | Principled community contribution | Judgmental distance limiting connection |
| Personal Growth | Continuous refinement and improvement | Self-criticism blocking progress |
| Spiritual Alignment | Purpose-driven living with moral clarity | Rigid dogmatism limiting spiritual expansion |

[Continue with impact mappings for all types...]

### 4.3 Trajectory Projection Framework

#### Projection Timeframes
- Short-term (3 months)
- Medium-term (1 year)
- Long-term (3 years)

#### Projection Algorithm
```typescript
function calculateDomainTrajectory(
  domainId: string,
  energyPattern: string,
  activationLevel: number,
  timeframe: TimeFrame
): Trajectory {
  // Base trajectory calculation
  const baseTrajectory = activationLevel < 40 ? "declining" :
                        activationLevel < 60 ? "stable" : "improving";
  
  // Domain-specific modifiers
  const domainModifiers = getDomainModifiers(energyPattern, domainId);
  
  // Calculate rate of change
  let rateOfChange = calculateRateOfChange(
    activationLevel,
    domainModifiers.sensitivity,
    timeframe
  );
  
  // Apply pattern-specific amplifiers
  rateOfChange *= domainModifiers.amplifier;
  
  return generateProjectionDescription(
    domainId,
    baseTrajectory,
    rateOfChange,
    timeframe
  );
}
```

### 4.4 Content Database Architecture

#### Core Pattern Collection
```javascript
{
  patternId: "integrity-driven-excellence",
  enneagramTypeId: 1,
  name: "Integrity-Driven Excellence Pattern",
  shortDescription: "Driven by a desire to improve and maintain integrity in all actions",
  longDescription: "As someone with the Integrity-Driven Excellence pattern...",
  keywords: ["improvement", "integrity", "standards", "principles"],
  coreDriver: "Creating a better world through personal integrity and improvement",
  coreStrengths: ["Principled decision-making", "Attention to detail", "Ethical clarity"],
  growthOpportunities: ["Embracing imperfection", "Self-compassion"],
  createdAt: ISODate("2025-05-19"),
  updatedAt: ISODate("2025-05-19")
}
```

#### Heart Activation State Collection
```javascript
{
  stateId: "integrity-fully-activated",
  patternId: "integrity-driven-excellence",
  activationLevel: "fully-activated",
  activationRange: { min: 80, max: 100 },
  title: "Fully Activated Integrity & Excellence",
  description: "I feel balanced and at peace with imperfection...",
  keyCharacteristics: ["Balanced discernment", "Accepting of imperfection"],
  domainImpacts: [
    {
      domainId: "health-vitality",
      impact: "Your balanced approach creates sustainable health practices...",
      activationScore: 85
    }
    // Additional domain impacts...
  ]
}
```

### 4.5 Content Population Strategy

#### Initial Content Migration
```typescript
async function migrateEnneagramContent() {
  // Define mapping dictionaries
  const typeToPatternMap = createTypeToPatternMapping();
  const stateToActivationMap = createStateToActivationMapping();
  const subtypeToFocusMap = createSubtypeToFocusMapping();
  
  // Process each Enneagram type
  for (let typeId = 1; typeId <= 9; typeId++) {
    // Extract type data
    const enneagramType = await fetchEnneagramType(typeId);
    
    // Create core pattern document
    const corePattern = translateToCorePattern(
      enneagramType,
      typeToPatternMap
    );
    await db.patterns.insertOne(corePattern);
    
    // Process states and subtypes
    await processStates(enneagramType, stateToActivationMap);
    await processSubtypes(enneagramType, subtypeToFocusMap);
  }
  
  return await verifyContentCoverage();
}
```

### 4.6 Quality Assurance

#### Content Validation Rules
1. All pattern descriptions must be in first person
2. No direct Enneagram terminology in user-facing content
3. All descriptions must maintain psychological accuracy
4. Content must align with Heart Activation framework
5. All domain impacts must be specific and actionable

#### Validation Implementation
```typescript
interface ContentValidation {
  validateTerminology(): ValidationResult;
  validatePerspective(): ValidationResult;
  validateAccuracy(): ValidationResult;
  validateFrameworkAlignment(): ValidationResult;
  validateActionability(): ValidationResult;
}

class ContentValidator implements ContentValidation {
  // Implementation of validation methods
}
```

## 5. Technical Integration Points

> **Technical Reference**: For implementation details, see `tech_spec_v2.md`.

### 5.1 Content API Integration
- Content delivery endpoints
- Translation layer implementation
- Caching strategy
- Version control

### 5.2 Visualization Requirements
- Tower construction rules
- Animation specifications
- Color application guidelines
- Detail element placement

### 5.3 Report Generation Integration
- Content assembly process
- Template system
- Dynamic content insertion
- PDF generation requirements 