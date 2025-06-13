// Defines types related to Detail Element data (Subtype Containers).
// Base container info (emoji, title, generic desc) could be fetched or remain static if simple.
// Type-specific descriptions are fetched.
// Token gradient is determined client-side based on primary type.

export interface SubtypeContainerInfo {
  id: 'self' | 'oneToOne' | 'social';
  emoji: string;
  title: string;
  genericDescription: string;
  description?: string; // Will be populated with type-specific description
}

// Base data for the three containers - this is small and can remain on client
// or be fetched if it needs to be highly dynamic. For now, keeping it.
export const subtypeContainersBaseData: SubtypeContainerInfo[] = [
  {
    id: 'self',
    emoji: '🏠',
    title: 'Self-Preservation Focus',
    genericDescription: 'Emphasis on physical safety, comfort, resources, and well-being.',
  },
  {
    id: 'oneToOne',
    emoji: '❤️‍🔥',
    title: 'One-to-One Focus',
    genericDescription: 'Emphasis on intense connections, intimacy, and significant relationships.',
  },
  {
    id: 'social',
    emoji: '🌍',
    title: 'Social Focus',
    genericDescription: 'Emphasis on group belonging, community participation, and social standing.',
  },
];

// The static `typeSpecificContainerDescriptions` map is removed.
// `fetchSubtypeContainerDescriptionsForType(primaryType)` from `contentService.ts` will provide this.


// This function remains useful on the client to combine base data with fetched type-specific descriptions.
export const getTypeSpecificContainerData = (
  baseContainerInfo: SubtypeContainerInfo,
  primaryType: string | null,
  typeSpecificDescription?: string // Fetched separately
): SubtypeContainerInfo => { // Returns SubtypeContainerInfo, description is now type-specific
  return {
    ...baseContainerInfo,
    description: typeSpecificDescription || baseContainerInfo.genericDescription,
  };
};

// Token gradient generation remains client-side based on primary type.
export const getTokenGradientForType = (primaryType: string | null): string => {
  if (!primaryType) return "linear-gradient(135deg, var(--ui-accent-primary), var(--ui-accent-secondary))";
  const typeColorMap: Record<string, string> = {
    "1": "linear-gradient(135deg, #d1c4e9, #b39ddb)", "2": "linear-gradient(135deg, #ffccdd, #ffab91)",
    "3": "linear-gradient(135deg, #ffe0b2, #ffcc80)", "4": "linear-gradient(135deg, #b2dfdb, #80cbc4)",
    "5": "linear-gradient(135deg, #bbdefb, #90caf9)", "6": "linear-gradient(135deg, #c8e6c9, #a5d6a7)",
    "7": "linear-gradient(135deg, #fff9c4, #fff59d)", "8": "linear-gradient(135deg, #ffcdd2, #ef9a9a)",
    "9": "linear-gradient(135deg, #d7ccc8, #bcaaa4)",
  };
  return typeColorMap[primaryType] || "linear-gradient(135deg, var(--ui-accent-primary), var(--ui-accent-secondary))";
};
```
