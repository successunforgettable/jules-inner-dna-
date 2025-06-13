## Client-Side Zustand Store Files

This document contains the content of the Zustand store files (`useAuthStore.ts` and `useAssessmentStore.ts`) for client-side state management.

---
**File Path:** `packages/client/src/contexts/store/useAuthStore.ts`
---
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useAssessmentStore from './useAssessmentStore'; // Import to call resetAssessment on logout

export interface UserProfile {
  id: string;
  email: string;
  createdAt?: string | Date;
}

export interface AuthStoreState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  error: string | null;
  isLoading: boolean;
}

export interface AuthStoreActions {
  loginSuccess: (data: { accessToken: string; user: UserProfile }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  registerSuccess: () => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

const initialState: AuthStoreState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  error: null,
  isLoading: false,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      loginSuccess: (data) => {
        console.log('AuthStore: loginSuccess triggered with data:', data);
        set({
          isAuthenticated: true,
          user: data.user,
          accessToken: data.accessToken,
          error: null,
          isLoading: false,
        });
      },
      logout: () => {
        console.log('AuthStore: logout triggered');
        useAssessmentStore.getState().resetAssessment(); // Reset assessment progress on logout
        set(initialState);
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      setError: (error) => {
        set({ error, isLoading: false });
      },
      registerSuccess: () => {
        console.log('AuthStore: registerSuccess triggered');
        set({ isLoading: false, error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore;
```

---
**File Path:** `packages/client/src/contexts/store/useAssessmentStore.ts`
---
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  determinePersonalityType, PersonalityTypeCalculation,
  determineWing, WingCalculation,
  determineArrows, ArrowCalculation, BlockSelectionsProcessed,
  calculateStateImpact, StateAnalysis, StateSelectionsIndices, DistributionObject,
  determineSubtypeStack, SubtypeStack, TokenDistribution, SubtypeVariant,
} from '../../lib/utils/personalityCalculations';
import { allStoneData } from '../../lib/personalityData';
import { getBlockPairsForType } from '../../lib/buildingBlockData';

// --- State Definitions ---
export type FoundationSelection = number | null;
export type FoundationSelectionsState = FoundationSelection[];
export type BlockSelectionUserInput = number | null;
export type BlockSelectionsUserInputState = BlockSelectionUserInput[];
export interface ColorPaletteSelectionsState { ids: (string | number)[]; indices: [number | null, number | null]; }

export interface AssessmentStoreState {
  foundationSelections: FoundationSelectionsState;
  currentStoneSetIndex: number;
  typeCalculation: PersonalityTypeCalculation | null;
  blockSelectionsUserInput: BlockSelectionsUserInputState;
  currentBlockPairIndex: number;
  wingCalculation: WingCalculation | null;
  arrowCalculation: ArrowCalculation | null;
  colorPaletteSelections: ColorPaletteSelectionsState;
  colorPaletteDistribution: DistributionObject | null;
  stateAnalysisResult: StateAnalysis | null;
  tokenDistribution: TokenDistribution;
  placedTokensCount: number;
  subtypeStackResult: SubtypeStack | null;
  isAssessmentComplete: boolean;
}

// --- Actions Definitions ---
export interface AssessmentStoreActions {
  setFoundationSelection: (setIndex: number, stoneSelectionIndex: number) => void;
  goToNextStoneSet: () => void;
  goToPreviousStoneSet: () => void;
  resetFoundationPhase: () => void;
  setBlockSelection: (pairIndex: number, blockChoiceIndex: number) => void;
  goToNextBlockPair: () => void;
  goToPreviousBlockPair: () => void;
  resetBuildingPhase: () => void;
  togglePaletteSelection: (paletteId: string | number, paletteIndex: number) => void;
  setColorPaletteDistribution: (distribution: DistributionObject) => void;
  resetColorPalettePhase: () => void;
  setTokenInContainer: (containerId: SubtypeVariant, operation: 'add' | 'remove') => void;
  resetDetailElementsPhase: () => void;
  setAssessmentComplete: (isComplete: boolean) => void;
  resetAssessment: () => void;
}

export type FullAssessmentStore = AssessmentStoreState & AssessmentStoreActions;

// --- Initial State ---
const initialFoundationSelections: FoundationSelectionsState = Array(9).fill(null);
const initialBlockSelectionsUserInput: BlockSelectionsUserInputState = Array(4).fill(null);
const initialColorPaletteSelections: ColorPaletteSelectionsState = { ids: [], indices: [null, null] };
const initialTokenDistribution: TokenDistribution = { self: 0, oneToOne: 0, social: 0 };

export const initialState: AssessmentStoreState = { // Export for test reset if needed
  foundationSelections: [...initialFoundationSelections],
  currentStoneSetIndex: 0,
  typeCalculation: null,
  blockSelectionsUserInput: [...initialBlockSelectionsUserInput],
  currentBlockPairIndex: 0,
  wingCalculation: null,
  arrowCalculation: null,
  colorPaletteSelections: { ...initialColorPaletteSelections, ids: [], indices: [null,null] },
  colorPaletteDistribution: { primaryPercentage: 50, secondaryPercentage: 50 },
  stateAnalysisResult: null,
  tokenDistribution: { ...initialTokenDistribution },
  placedTokensCount: 0,
  subtypeStackResult: null,
  isAssessmentComplete: false,
};

// --- Store Implementation ---
const useAssessmentStore = create<FullAssessmentStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // --- Foundation Phase Actions ---
      setFoundationSelection: (setIndex, stoneSelectionIndex) => {
        if (setIndex < 0 || setIndex >= allStoneData.length) { console.error(`Invalid setIndex: ${setIndex}`); return; }
        const newSelections = [...get().foundationSelections]; newSelections[setIndex] = stoneSelectionIndex;
        set({ foundationSelections: newSelections });
        const allFoundationSelected = newSelections.every(s => s !== null);
        if (allFoundationSelected && newSelections.every(s => typeof s === 'number')) {
          try {
            const calcRes = determinePersonalityType(newSelections as number[]);
            set({ typeCalculation: calcRes }); console.log("Personality Type Calculated:", calcRes);
          } catch (e) { console.error("Error in determinePersonalityType:", e); set({ typeCalculation: null }); }
        }
      },
      goToNextStoneSet: () => set((s) => ({ currentStoneSetIndex: Math.min(allStoneData.length - 1, s.currentStoneSetIndex + 1) })),
      goToPreviousStoneSet: () => set((s) => ({ currentStoneSetIndex: Math.max(0, s.currentStoneSetIndex - 1) })),
      resetFoundationPhase: () => set({ foundationSelections: [...initialFoundationSelections], currentStoneSetIndex: 0, typeCalculation: null }),

      // --- Building Block Phase Actions ---
      setBlockSelection: (pairIndex, blockChoiceIndex) => {
        if (pairIndex < 0 || pairIndex >= 4) { console.error(`Invalid pairIndex: ${pairIndex}`); return; }
        const newSelections = [...get().blockSelectionsUserInput]; newSelections[pairIndex] = blockChoiceIndex;
        set({ blockSelectionsUserInput: newSelections });
        const allBlocksSelected = newSelections.every(s => s !== null);
        if (allBlocksSelected) {
          const primaryType = get().typeCalculation?.primaryType;
          if (!primaryType) { console.error("Primary type not set for Wing/Arrow calc."); return; }
          const blockPairs = getBlockPairsForType(primaryType);
          let chosenWingNumber: number | null = null;
          const wingPairChoiceIndex = newSelections[0];
          if(wingPairChoiceIndex !== null && blockPairs[0]?.pairType === 'wing') {
            const chosenBlock = blockPairs[0].blocks[wingPairChoiceIndex];
            if (chosenBlock && typeof chosenBlock.associatedWingValue === 'number') chosenWingNumber = chosenBlock.associatedWingValue;
            else console.warn("Could not determine associatedWingValue for selection:", wingPairChoiceIndex, blockPairs[0]);
          } else { console.warn("Wing pair data or selection missing for wing calculation."); }
          const processed: BlockSelectionsProcessed = [chosenWingNumber,newSelections[1],newSelections[2],newSelections[3]];
          try{
            set({ wingCalculation: determineWing(primaryType, processed) });
            set({ arrowCalculation: determineArrows(primaryType, processed) });
            console.log("Wing/Arrows Calculated. Wing:", get().wingCalculation, "Arrows:", get().arrowCalculation);
          } catch(e) {console.error("Error in Wing/Arrow Calc:", e); set({wingCalculation:null, arrowCalculation:null});}
        }
      },
      goToNextBlockPair: () => set((s) => ({ currentBlockPairIndex: Math.min(getBlockPairsForType(s.typeCalculation?.primaryType || null).length - 1, s.currentBlockPairIndex + 1) })),
      goToPreviousBlockPair: () => set((s) => ({ currentBlockPairIndex: Math.max(0, s.currentBlockPairIndex - 1) })),
      resetBuildingPhase: () => set({ blockSelectionsUserInput: [...initialBlockSelectionsUserInput], currentBlockPairIndex: 0, wingCalculation: null, arrowCalculation: null }),

      // --- Color Palette Phase Actions ---
      _triggerStateImpactCalculation: () => {
        const { colorPaletteSelections, colorPaletteDistribution, typeCalculation } = get();
        if (colorPaletteSelections.ids.length === 2 && colorPaletteSelections.indices[0] !== null && colorPaletteSelections.indices[1] !== null && colorPaletteDistribution !== null && typeCalculation?.primaryType) {
          try {
            const result = calculateStateImpact(colorPaletteSelections.indices as StateSelectionsIndices, colorPaletteDistribution, typeCalculation.primaryType);
            set({ stateAnalysisResult: result }); console.log("State Impact Calculated:", result);
          }
          catch (e) { console.error("Error in calculateStateImpact:", e); set({ stateAnalysisResult: null });}
        } else if (get().stateAnalysisResult !== null) { set({ stateAnalysisResult: null }); }
      },
      togglePaletteSelection: (paletteId, paletteIndex) => {
        const { ids, indices } = get().colorPaletteSelections; const newIds = [...ids]; const newIndices: [number | null, number | null] = [...indices]; const selectedIdx = newIds.indexOf(paletteId);
        if (selectedIdx > -1) { newIds.splice(selectedIdx, 1); const originalIdxPos = newIndices.indexOf(paletteIndex); if (originalIdxPos > -1) newIndices[originalIdxPos] = null; if (originalIdxPos === 0 && newIndices[1] !== null) { newIndices[0] = newIndices[1]; newIndices[1] = null; } }
        else if (newIds.length < 2) { newIds.push(paletteId); if (newIndices[0] === null) newIndices[0] = paletteIndex; else if (newIndices[1] === null) newIndices[1] = paletteIndex; }
        set({ colorPaletteSelections: { ids: newIds, indices: newIndices } }); get()._triggerStateImpactCalculation();
      },
      setColorPaletteDistribution: (distribution) => { set({ colorPaletteDistribution: distribution }); get()._triggerStateImpactCalculation(); },
      resetColorPalettePhase: () => set({ colorPaletteSelections: { ...initialColorPaletteSelections, ids:[], indices:[null,null]}, colorPaletteDistribution: { primaryPercentage: 50, secondaryPercentage:50 }, stateAnalysisResult: null }),

      // --- Detail Elements Phase Actions ---
      _triggerSubtypeStackCalculation: () => {
        const { tokenDistribution, typeCalculation, placedTokensCount } = get();
        if (placedTokensCount === 10 && typeCalculation?.primaryType) {
          try {
            const result = determineSubtypeStack(tokenDistribution, typeCalculation.primaryType);
            set({ subtypeStackResult: result }); console.log("Subtype Stack Calculated:", result);
          }
          catch (e) { console.error("Error in determineSubtypeStack:", e); set({ subtypeStackResult: null }); }
        } else if (get().subtypeStackResult !== null) { set({ subtypeStackResult: null }); }
      },
      setTokenInContainer: (containerId, operation) => {
        const currentDistribution = { ...get().tokenDistribution }; let currentPlacedCount = get().placedTokensCount;
        if (operation === 'add') { if (currentPlacedCount < 10) { currentDistribution[containerId]++; currentPlacedCount++; } else { return; } }
        else if (operation === 'remove') { if (currentDistribution[containerId] > 0) { currentDistribution[containerId]--; currentPlacedCount--; } else { return; } }
        set({ tokenDistribution: currentDistribution, placedTokensCount: currentPlacedCount }); get()._triggerSubtypeStackCalculation();
      },
      resetDetailElementsPhase: () => set({ tokenDistribution: { ...initialTokenDistribution }, placedTokensCount: 0, subtypeStackResult: null }),

      // --- Overall Assessment Status Action ---
      setAssessmentComplete: (isComplete) => {
        set({ isAssessmentComplete: isComplete });
      },

      // --- General Reset ---
      resetAssessment: () => {
        set({...initialState, isAssessmentComplete: false });
        console.log("Assessment store reset.");
      },
    }),
    {
      name: 'assessment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        foundationSelections: state.foundationSelections, currentStoneSetIndex: state.currentStoneSetIndex, typeCalculation: state.typeCalculation,
        blockSelectionsUserInput: state.blockSelectionsUserInput, currentBlockPairIndex: state.currentBlockPairIndex, wingCalculation: state.wingCalculation, arrowCalculation: state.arrowCalculation,
        colorPaletteSelections: state.colorPaletteSelections, colorPaletteDistribution: state.colorPaletteDistribution, stateAnalysisResult: state.stateAnalysisResult,
        tokenDistribution: state.tokenDistribution, placedTokensCount: state.placedTokensCount, subtypeStackResult: state.subtypeStackResult,
        isAssessmentComplete: state.isAssessmentComplete,
      }),
    }
  )
);

export default useAssessmentStore;
```

This markdown contains the requested Zustand store files.
```
