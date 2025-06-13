// Defines types related to Foundation Stone data.
// The actual data (allStoneData array) is now fetched from the backend.

export interface StoneDataItem {
  id: string;
  stoneId?: string; // From schema, if different from main id
  contentLines: string[]; // Changed from 'content' to match schema
  gradientStyle?: string; // Client might construct this or receive it
  typeAffinityKey: string; // From schema
  typeAffinity?: number; // Client-side calculation might use this
  ariaLabel?: string;
}

export interface StoneSetData {
  setId: string;
  instruction: string;
  stones: StoneDataItem[];
}

// The `allStoneData` array is removed.
// `fetchFoundationStoneSets()` from `contentService.ts` will provide this data.

// The `getStoneById` helper function is removed as it depended on the static `allStoneData`.
// If needed, similar logic can be applied to data fetched and stored in component state or store.
```
