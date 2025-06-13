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
import * as assessmentService from '../../services/assessmentService'; // IMPORT assessmentService
import { IAssessmentProfile } from '../../../../shared/types/assessment.types'; // Path to shared types

// --- State Definitions ---
export type FoundationSelection = number | null;
export type FoundationSelectionsState = FoundationSelection[];
export type BlockSelectionUserInput = number | null;
export type BlockSelectionsUserInputState = BlockSelectionUserInput[];
export interface ColorPaletteSelectionsState { ids: (string | number)[]; indices: [number | null, number | null]; }

export interface AssessmentStoreState {
  // Foundation Phase
  foundationSelections: FoundationSelectionsState;
  currentStoneSetIndex: number;
  typeCalculation: PersonalityTypeCalculation | null;
  // Building Block Phase
  blockSelectionsUserInput: BlockSelectionsUserInputState;
  currentBlockPairIndex: number;
  wingCalculation: WingCalculation | null;
  arrowCalculation: ArrowCalculation | null;
  // Color Palette Phase
  colorPaletteSelections: ColorPaletteSelectionsState;
  colorPaletteDistribution: DistributionObject | null;
  stateAnalysisResult: StateAnalysis | null;
  // Detail Elements Phase
  tokenDistribution: TokenDistribution;
  placedTokensCount: number;
  subtypeStackResult: SubtypeStack | null;
  // Overall Assessment Status
  isAssessmentComplete: boolean;
  // API Interaction State
  isSubmittingProfile: boolean; // NEW
  submissionError: string | null; // NEW
  userProfile: IAssessmentProfile | null; // NEW - To store fetched/saved profile
}

// --- Actions Definitions ---
export interface AssessmentStoreActions {
  // Foundation Phase Actions
  setFoundationSelection: (setIndex: number, stoneSelectionIndex: number) => void;
  goToNextStoneSet: () => void;
  goToPreviousStoneSet: () => void;
  resetFoundationPhase: () => void;
  // Building Block Phase Actions
  setBlockSelection: (pairIndex: number, blockChoiceIndex: number) => void;
  goToNextBlockPair: () => void;
  goToPreviousBlockPair: () => void;
  resetBuildingPhase: () => void;
  // Color Palette Phase Actions
  togglePaletteSelection: (paletteId: string | number, paletteIndex: number) => void;
  setColorPaletteDistribution: (distribution: DistributionObject) => void;
  resetColorPalettePhase: () => void;
  // Detail Elements Phase Actions
  setTokenInContainer: (containerId: SubtypeVariant, operation: 'add' | 'remove') => void;
  resetDetailElementsPhase: () => void;
  // Overall Assessment Status Action
  setAssessmentComplete: (isComplete: boolean) => void;
  // General Reset
  resetAssessment: () => void;
  // API Actions
  submitFullAssessment: () => Promise<IAssessmentProfile | null>; // NEW
  fetchUserProfile: () => Promise<IAssessmentProfile | null>; // NEW
}

export type FullAssessmentStore = AssessmentStoreState & AssessmentStoreActions;

// --- Initial State ---
const initialFoundationSelections: FoundationSelectionsState = Array(9).fill(null);
const initialBlockSelectionsUserInput: BlockSelectionsUserInputState = Array(4).fill(null);
const initialColorPaletteSelections: ColorPaletteSelectionsState = { ids: [], indices: [null, null] };
const initialTokenDistribution: TokenDistribution = { self: 0, oneToOne: 0, social: 0 };

const initialState: AssessmentStoreState = {
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
  // API Initial State
  isSubmittingProfile: false, // NEW
  submissionError: null, // NEW
  userProfile: null, // NEW
};

// --- Store Implementation ---
const useAssessmentStore = create<FullAssessmentStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // --- Foundation Phase Actions ---
      setFoundationSelection: (setIndex, stoneSelectionIndex) => {
        if (setIndex < 0 || setIndex >= allStoneData.length) { return; }
        const newSelections = [...get().foundationSelections]; newSelections[setIndex] = stoneSelectionIndex;
        set({ foundationSelections: newSelections });
        if (newSelections.every(s => s !== null) && newSelections.every(s => typeof s === 'number')) {
          try { set({ typeCalculation: determinePersonalityType(newSelections as number[]) }); }
          catch (e) { console.error(e); set({ typeCalculation: null }); }
        }
      },
      goToNextStoneSet: () => set((s) => ({ currentStoneSetIndex: Math.min(allStoneData.length - 1, s.currentStoneSetIndex + 1) })),
      goToPreviousStoneSet: () => set((s) => ({ currentStoneSetIndex: Math.max(0, s.currentStoneSetIndex - 1) })),
      resetFoundationPhase: () => set({ foundationSelections: [...initialFoundationSelections], currentStoneSetIndex: 0, typeCalculation: null }),

      // --- Building Block Phase Actions ---
      setBlockSelection: (pairIndex, blockChoiceIndex) => {
        if (pairIndex < 0 || pairIndex >= 4) { return; }
        const newSelections = [...get().blockSelectionsUserInput]; newSelections[pairIndex] = blockChoiceIndex;
        set({ blockSelectionsUserInput: newSelections });
        if (newSelections.every(s => s !== null)) {
          const primaryType = get().typeCalculation?.primaryType;
          if (!primaryType) { console.error("Primary type needed for Wing/Arrow calc."); return; }
          const blockPairs = getBlockPairsForType(primaryType);
          let chosenWing:number|null = null;
          if(newSelections[0] !== null && blockPairs[0]?.pairType === 'wing') chosenWing = blockPairs[0].blocks[newSelections[0]!].associatedWingValue ?? null;
          const processed:BlockSelectionsProcessed = [chosenWing,newSelections[1],newSelections[2],newSelections[3]];
          try{
            set({ wingCalculation: determineWing(primaryType, processed) });
            set({ arrowCalculation: determineArrows(primaryType, processed) });
          } catch(e) {console.error(e); set({wingCalculation:null, arrowCalculation:null});}
        }
      },
      goToNextBlockPair: () => set((s) => ({ currentBlockPairIndex: Math.min(getBlockPairsForType(s.typeCalculation?.primaryType || null).length - 1, s.currentBlockPairIndex + 1) })),
      goToPreviousBlockPair: () => set((s) => ({ currentBlockPairIndex: Math.max(0, s.currentBlockPairIndex - 1) })),
      resetBuildingPhase: () => set({ blockSelectionsUserInput: [...initialBlockSelectionsUserInput], currentBlockPairIndex: 0, wingCalculation: null, arrowCalculation: null }),

      // --- Color Palette Phase Actions ---
      _triggerStateImpactCalculation: () => {
        const { colorPaletteSelections, colorPaletteDistribution, typeCalculation } = get();
        if (colorPaletteSelections.ids.length === 2 && colorPaletteSelections.indices[0] !== null && colorPaletteSelections.indices[1] !== null && colorPaletteDistribution !== null && typeCalculation?.primaryType) {
          try { set({ stateAnalysisResult: calculateStateImpact(colorPaletteSelections.indices as StateSelectionsIndices, colorPaletteDistribution, typeCalculation.primaryType) }); }
          catch (e) { console.error(e); set({ stateAnalysisResult: null });}
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
          try { set({ subtypeStackResult: determineSubtypeStack(tokenDistribution, typeCalculation.primaryType) }); }
          catch (e) { console.error(e); set({ subtypeStackResult: null }); }
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
        set({...initialState, isAssessmentComplete: false, userProfile: null, submissionError: null, isSubmittingProfile: false });
      },

      // --- API Actions ---
      submitFullAssessment: async () => {
        set({ isSubmittingProfile: true, submissionError: null });
        const s = get();
        const profileData: Partial<IAssessmentProfile> = {
          foundationStoneSelections: s.foundationSelections.map((sel, idx) => ({ // Assuming backend expects this structure
            setId: allStoneData[idx]?.setId || `set${idx + 1}`, // Example setId
            selectedStoneKey: sel !== null ? String.fromCharCode(65 + sel) : '', // A, B, C
            // typeScores: {} // This would be complex to send, maybe backend calculates or it's simplified
          })),
          // Ensure IDs or numbers are sent as expected by backend.
          // For ObjectIds, they should be strings if populated, or numbers/codes if backend resolves them.
          determinedCoreType: s.typeCalculation?.primaryTypeId, // Assuming primaryTypeId is the ObjectId string

          buildingBlockSelections: s.blockSelectionsUserInput.map((sel, idx) => ({
            pairId: `pair${idx + 1}`, // Example pairId
            selectedBlockKey: sel !== null ? String.fromCharCode(65 + sel) : '', // A, B
          })),
          determinedWing: s.wingCalculation?.wingTypeId, // Assuming wingTypeId is the ObjectId string
          determinedStressArrowTypeNumber: s.arrowCalculation?.disintegrationType,
          determinedGrowthArrowTypeNumber: s.arrowCalculation?.integrationType,

          colorPaletteSelections: s.colorPaletteSelections.ids.map((id, index) => ({ // Assuming backend expects this structure
            paletteId: String(id),
            choice: index === 0 ? 'primary' : 'secondary', // This logic might need refinement based on how selections are stored
          })),
          colorPaletteDistribution: s.colorPaletteDistribution,
          // determinedOperatingStateFocus: s.stateAnalysisResult?. // Need to map stateAnalysis to a string or specific structure

          detailElementTokenDistribution: s.tokenDistribution,
          determinedInstinctualStacking: s.subtypeStackResult?.primaryStackingId, // Assuming primaryStackingId is ObjectId string

          isComplete: true,
          // completedDate will be set by backend or pre-save hook in schema
        };

        // Clean up undefined values that might cause issues with backend validation
        if (!profileData.determinedCoreType) delete profileData.determinedCoreType;
        if (!profileData.determinedWing) delete profileData.determinedWing;
        if (!profileData.determinedInstinctualStacking) delete profileData.determinedInstinctualStacking;


        try {
          const savedProfile = await assessmentService.saveAssessmentProfile(profileData);
          set({ userProfile: savedProfile, isSubmittingProfile: false, submissionError: null, isAssessmentComplete: true });
          return savedProfile;
        } catch (error: any) {
          set({ submissionError: error.message || 'Failed to submit assessment.', isSubmittingProfile: false });
          return null;
        }
      },

      fetchUserProfile: async () => {
        set({ isSubmittingProfile: true, submissionError: null }); // Re-use for loading state
        try {
          const profile = await assessmentService.getAssessmentProfile();
          set({ userProfile: profile, isSubmittingProfile: false });
          // Potentially sync local store state with fetched profile if needed
          // For example, if profile.isComplete is true, set({ isAssessmentComplete: true });
          if (profile.isComplete) {
            set({ isAssessmentComplete: true });
          }
          return profile;
        } catch (error: any) {
          set({ submissionError: error.message || 'Failed to fetch profile.', isSubmittingProfile: false });
          if (error.message.includes('not found')) { // Crude check for 404
            set({ userProfile: null }); // Ensure profile is null if not found
          }
          return null;
        }
      },
    }),
    {
      name: 'inner-dna-assessment-storage', // Updated store name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        foundationSelections: state.foundationSelections, currentStoneSetIndex: state.currentStoneSetIndex, typeCalculation: state.typeCalculation,
        blockSelectionsUserInput: state.blockSelectionsUserInput, currentBlockPairIndex: state.currentBlockPairIndex, wingCalculation: state.wingCalculation, arrowCalculation: state.arrowCalculation,
        colorPaletteSelections: state.colorPaletteSelections, colorPaletteDistribution: state.colorPaletteDistribution, stateAnalysisResult: state.stateAnalysisResult,
        tokenDistribution: state.tokenDistribution, placedTokensCount: state.placedTokensCount, subtypeStackResult: state.subtypeStackResult,
        isAssessmentComplete: state.isAssessmentComplete,
        userProfile: state.userProfile, // Persist fetched/saved user profile
        // Do not persist submissionError or isSubmittingProfile
      }),
    }
  )
);

export default useAssessmentStore;
