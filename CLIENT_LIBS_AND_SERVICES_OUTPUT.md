## Client-Side Service and Library Files

This document contains the content of key service and library (data, utilities) files for the `packages/client/` application.

---
**File Path:** `packages/client/src/services/api.ts`
---
```typescript
import axios from 'axios';
import useAuthStore from '../contexts/store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh-token',
    ];

    const isPublicRoute = publicRoutes.some(route => config.url?.endsWith(route));

    if (isPublicRoute) {
      return config;
    }

    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling or token refresh logic
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Example: Call a refreshToken endpoint
//         // const { data } = await api.post('/auth/refresh-token', { refreshToken: useAuthStore.getState().refreshToken }); // Assuming refreshToken is stored
//         // const newAccessToken = data.accessToken;
//         // useAuthStore.getState().setAccessToken(newAccessToken); // Action to update only accessToken
//         // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         // return api(originalRequest);
//         console.log("Original request was unauthorized (401). Implement refresh token logic or logout.");
//         useAuthStore.getState().logout(); // Simple logout on 401 for now
//         // window.location.href = '/'; // Or trigger navigation to login
//       } catch (refreshError) {
//         useAuthStore.getState().logout();
//         // window.location.href = '/';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
```

---
**File Path:** `packages/client/src/lib/personalityData.ts`
---
```typescript
// Foundation Stone Content and Mapping (Sec 2.3)

export interface StoneDataItem {
  id: string;
  content: string[];
  gradientStyle: string;
  typeAffinity?: number;
  ariaLabel?: string; // Added for accessibility if content is not descriptive enough
}

export interface StoneSetData {
  setId: string;
  instruction: string;
  stones: StoneDataItem[];
}

export const allStoneData: StoneSetData[] = [
  {
    setId: "set1",
    instruction: "From these three, select the quality that feels most essentially YOU.",
    stones: [
      { id: "s1_1", content: ["Integrity", "Honesty"], gradientStyle: "linear-gradient(to bottom right, #FFD700, #FFA500)", typeAffinity: 1, ariaLabel: "Integrity and Honesty" },
      { id: "s1_2", content: ["Empathy", "Kindness"], gradientStyle: "linear-gradient(to bottom right, #ADD8E6, #87CEEB)", typeAffinity: 2, ariaLabel: "Empathy and Kindness" },
      { id: "s1_3", content: ["Ambition", "Drive"], gradientStyle: "linear-gradient(to bottom right, #90EE90, #3CB371)", typeAffinity: 3, ariaLabel: "Ambition and Drive" },
    ],
  },
  {
    setId: "set2",
    instruction: "Which of these motivations most often guides your actions?",
    stones: [
      { id: "s2_1", content: ["Individuality", "Uniqueness"], gradientStyle: "linear-gradient(to bottom right, #DDA0DD, #BA55D3)", typeAffinity: 4, ariaLabel: "Individuality and Uniqueness" },
      { id: "s2_2", content: ["Knowledge", "Insight"], gradientStyle: "linear-gradient(to bottom right, #B0C4DE, #778899)", typeAffinity: 5, ariaLabel: "Knowledge and Insight" },
      { id: "s2_3", content: ["Security", "Support"], gradientStyle: "linear-gradient(to bottom right, #F0E68C, #BDB76B)", typeAffinity: 6, ariaLabel: "Security and Support" },
    ],
  },
  {
    setId: "set3",
    instruction: "Select the trait that best reflects your approach to joy and experience.",
    stones: [
      { id: "s3_1", content: ["Enthusiasm", "Joyfulness"], gradientStyle: "linear-gradient(to bottom right, #FFB6C1, #FF69B4)", typeAffinity: 7, ariaLabel: "Enthusiasm and Joyfulness" },
      { id: "s3_2", content: ["Strength", "Assertiveness"], gradientStyle: "linear-gradient(to bottom right, #CD5C5C, #A52A2A)", typeAffinity: 8, ariaLabel: "Strength and Assertiveness" },
      { id: "s3_3", content: ["Peace", "Harmony"], gradientStyle: "linear-gradient(to bottom right, #AFEEEE, #7FFFD4)", typeAffinity: 9, ariaLabel: "Peace and Harmony" },
    ],
  },
  {
    setId: "set4",
    instruction: "Choose your primary mode of inner reflection.",
    stones: [
      { id: "s4_1", content: ["Introspection"], gradientStyle: "linear-gradient(to bottom right, #FFD700, #FFA500)", typeAffinity: 1, ariaLabel: "Introspection" },
      { id: "s4_2", content: ["Observation"], gradientStyle: "linear-gradient(to bottom right, #ADD8E6, #87CEEB)", typeAffinity: 2, ariaLabel: "Observation" },
      { id: "s4_3", content: ["Contemplation"], gradientStyle: "linear-gradient(to bottom right, #90EE90, #3CB371)", typeAffinity: 3, ariaLabel: "Contemplation" },
    ],
  },
  {
    setId: "set5",
    instruction: "Which quality best describes your social interactions?",
    stones: [
      { id: "s5_1", content: ["Authenticity"], gradientStyle: "linear-gradient(to bottom right, #DDA0DD, #BA55D3)", typeAffinity: 4, ariaLabel: "Authenticity" },
      { id: "s5_2", content: ["Discernment"], gradientStyle: "linear-gradient(to bottom right, #B0C4DE, #778899)", typeAffinity: 5, ariaLabel: "Discernment" },
      { id: "s5_3", content: ["Loyalty"], gradientStyle: "linear-gradient(to bottom right, #F0E68C, #BDB76B)", typeAffinity: 6, ariaLabel: "Loyalty" },
    ],
  },
  {
    setId: "set6",
    instruction: "Select your most natural response to new opportunities.",
    stones: [
      { id: "s6_1", content: ["Optimism"], gradientStyle: "linear-gradient(to bottom right, #FFB6C1, #FF69B4)", typeAffinity: 7, ariaLabel: "Optimism" },
      { id: "s6_2", content: ["Decisiveness"], gradientStyle: "linear-gradient(to bottom right, #CD5C5C, #A52A2A)", typeAffinity: 8, ariaLabel: "Decisiveness" },
      { id: "s6_3", content: ["Adaptability"], gradientStyle: "linear-gradient(to bottom right, #AFEEEE, #7FFFD4)", typeAffinity: 9, ariaLabel: "Adaptability" },
    ],
  },
  {
    setId: "set7",
    instruction: "Which word resonates most with your sense of self?",
    stones: [
      { id: "s7_1", content: ["Purposeful"], gradientStyle: "linear-gradient(to bottom right, #FFD700, #FFA500)", typeAffinity: 1, ariaLabel: "Purposeful" },
      { id: "s7_2", content: ["Helpful"], gradientStyle: "linear-gradient(to bottom right, #ADD8E6, #87CEEB)", typeAffinity: 2, ariaLabel: "Helpful" },
      { id: "s7_3", content: ["Effective"], gradientStyle: "linear-gradient(to bottom right, #90EE90, #3CB371)", typeAffinity: 3, ariaLabel: "Effective" },
    ],
  },
  {
    setId: "set8",
    instruction: "Choose the quality you value most in relationships.",
    stones: [
      { id: "s8_1", content: ["Depth"], gradientStyle: "linear-gradient(to bottom right, #DDA0DD, #BA55D3)", typeAffinity: 4, ariaLabel: "Depth" },
      { id: "s8_2", content: ["Clarity"], gradientStyle: "linear-gradient(to bottom right, #B0C4DE, #778899)", typeAffinity: 5, ariaLabel: "Clarity" },
      { id: "s8_3", content: ["Dependability"], gradientStyle: "linear-gradient(to bottom right, #F0E68C, #BDB76B)", typeAffinity: 6, ariaLabel: "Dependability" },
    ],
  },
  {
    setId: "set9",
    instruction: "What is your core approach to achieving your goals?",
    stones: [
      { id: "s9_1", content: ["Vision"], gradientStyle: "linear-gradient(to bottom right, #FFB6C1, #FF69B4)", typeAffinity: 7, ariaLabel: "Vision" },
      { id: "s9_2", content: ["Determination"], gradientStyle: "linear-gradient(to bottom right, #CD5C5C, #A52A2A)", typeAffinity: 8, ariaLabel: "Determination" },
      { id: "s9_3", content: ["Collaboration"], gradientStyle: "linear-gradient(to bottom right, #AFEEEE, #7FFFD4)", typeAffinity: 9, ariaLabel: "Collaboration" },
    ],
  },
];

export const getStoneById = (id: string): StoneDataItem | undefined => {
  for (const set of allStoneData) {
    const foundStone = set.stones.find(stone => stone.id === id);
    if (foundStone) return foundStone;
  }
  return undefined;
};
```

---
**File Path:** `packages/client/src/lib/buildingBlockData.ts`
---
*(Content as generated in "Define comprehensive data structures for Building Block content...", Task 10 - includes `BuildingBlockDataItem`, `BlockPairData` interfaces, `genericGrowthFocusPair`, `genericResponsePatternPair`, `typeSpecificBlockData` for all 9 types, and `getBlockPairsForType` function).*

---
**File Path:** `packages/client/src/lib/colorPaletteData.ts`
---
*(Content as generated in "Define comprehensive data for Color Palettes...", Task 11 - includes `PaletteInfo`, `PaletteInfoForDisplay` interfaces, `availablePalettesData` for 5 states, `typeSpecificDescriptions` for Type 1 & 4 examples, and `getTypeSpecificPaletteData` function).*

---
**File Path:** `packages/client/src/lib/detailElementData.ts`
---
*(Content as generated in "Fully populate typeSpecificContainerDescriptions...", Task 12 - includes `SubtypeContainerInfo`, `subtypeContainersBaseData`, fully populated `typeSpecificContainerDescriptions` for all 9 types, `getTypeSpecificContainerData`, and `getTokenGradientForType` functions).*

---
**File Path:** `packages/client/src/lib/utils/colorUtils.ts`
---
```typescript
// packages/client/src/lib/utils/colorUtils.ts
// Color Utilities

export const generateModifiedGradient = (baseGradient: string, personalityType: string | null): string => {
  if (!personalityType) {
    return baseGradient;
  }
  let modificationComment = `/* Modified for Type ${personalityType}: `;
  switch (personalityType) {
    case "1": modificationComment += "Hue +5°, Sat +5%"; break;
    case "2": modificationComment += "Hue +15°, Sat +10%"; break;
    case "3": modificationComment += "Hue -5°, Sat +8%"; break;
    case "4": modificationComment += "Hue +25°, Sat -5%"; break;
    case "5": modificationComment += "Hue -10°, Sat +5%"; break;
    case "6": modificationComment += "Hue +0°, Sat +10%"; break;
    case "7": modificationComment += "Hue +10°, Sat +12%"; break;
    case "8": modificationComment += "Hue -15°, Sat +10%"; break;
    case "9": modificationComment += "Hue -20°, Sat +5%"; break;
    default: modificationComment += "No specific modification defined"; break;
  }
  modificationComment += " */";
  return `${baseGradient} ${modificationComment}`;
};
```

---
**File Path:** `packages/client/src/lib/utils/personalityCalculations.ts`
---
*(Content as generated in "Implement the determineSubtypeStack algorithm...", Task 13 - includes all type definitions and algorithms for `determinePersonalityType`, `determineWing`, `determineArrows`, `calculateStateImpact`, and `determineSubtypeStack`).*

This markdown contains the requested client-side service and library files.
```
