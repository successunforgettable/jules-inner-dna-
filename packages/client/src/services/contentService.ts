import api from './api';
import { StoneSetData } from '../lib/personalityData';
import { BlockPairData } from '../lib/buildingBlockData';
import { PaletteInfo } from '../lib/colorPaletteData';
import {
    IEnneagramTypeData,
    IWingData,
    IArrowData,
    IOperatingStateData,
    IInstinctualStackingData
} from '../../../shared/types/assessment.types'; // Adjusted path

export interface TypeSpecificTextData {
  textKey: string;
  enneagramType: string;
  category: string;
  itemKey?: string;
  content: string;
}

// --- Existing Functions ---

export const fetchFoundationStoneSets = async (): Promise<StoneSetData[]> => {
  // This function might be deprecated if StoneSetData is directly from EnneagramType model content
  try {
    // Assuming a generic endpoint or specific one if sets are predefined entities
    // For now, this might be conceptual or map to fetching parts of EnneagramType data
    // const response = await api.get('/content/foundation-stone-sets-information');
    // return response.data;
    console.warn("fetchFoundationStoneSets is conceptual and needs a real endpoint or different data source.");
    return []; // Placeholder
  } catch (error) {
    console.error('Error fetching foundation stone sets:', error);
    throw error;
  }
};

export const fetchBuildingBlockPairs = async (primaryTypeNumber: number): Promise<BlockPairData[]> => {
  // This function might be deprecated if BlockPairData is derived from Wing/Arrow model content
  if (!primaryTypeNumber) {
    console.error('Primary type number is required to fetch building block pairs.');
    throw new Error('Primary type number not available.');
  }
  try {
    // Conceptual endpoint, this data is likely now part of Wing/Arrow models for a type
    // const response = await api.get(`/content/building-block-pairs-for-type/${primaryTypeNumber}`);
    // return response.data;
    console.warn(`fetchBuildingBlockPairs for type ${primaryTypeNumber} is conceptual.`);
    return []; // Placeholder
  } catch (error) {
    console.error(`Error fetching building block pairs for type ${primaryTypeNumber}:`, error);
    throw error;
  }
};

// --- Functions based on new Mongoose Schemas & Endpoints ---

export const getAllEnneagramTypes = async (): Promise<IEnneagramTypeData[]> => {
  try {
    const response = await api.get<IEnneagramTypeData[]>('/content/enneagram-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching all Enneagram types:', error);
    throw error;
  }
};

export const getEnneagramTypeByNumber = async (typeNumber: number): Promise<IEnneagramTypeData | null> => {
  try {
    const response = await api.get<IEnneagramTypeData>(`/content/enneagram-types/${typeNumber}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching Enneagram type ${typeNumber}:`, error);
    throw error;
  }
};

// STUB: Get EnneagramType by ID (if needed when profile only stores ObjectId)
export const getEnneagramTypeById = async (id: string): Promise<IEnneagramTypeData | null> => {
  try {
    // console.warn("getEnneagramTypeById: Backend endpoint not yet implemented. Using placeholder.");
    // This would be something like: const response = await api.get<IEnneagramTypeData>(`/content/internal/enneagram-type/${id}`);
    // For now, simulate by fetching all and filtering (highly inefficient, for placeholder only)
    const types = await getAllEnneagramTypes();
    return types.find(t => t._id === id) || null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching Enneagram type by ID ${id}:`, error);
    throw error;
  }
};


export const getWingsForType = async (typeNumber: number): Promise<IWingData[]> => {
  try {
    const response = await api.get<IWingData[]>(`/content/wings/type/${typeNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching wings for type ${typeNumber}:`, error);
    throw error;
  }
};

// STUB: Get a specific Wing by its ObjectId (if determinedWing in profile is an ID)
export const getWingById = async (id: string): Promise<IWingData | null> => {
  try {
    console.warn("getWingById: Backend endpoint not yet implemented.");
    // const response = await api.get<IWingData>(`/content/wings/${id}`);
    // return response.data;
    return null; // Placeholder
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching wing by ID ${id}:`, error);
    throw error;
  }
};


export const getArrowsForType = async (typeNumber: number): Promise<IArrowData | null> => {
  try {
    const response = await api.get<IArrowData>(`/content/arrows/type/${typeNumber}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching arrows for type ${typeNumber}:`, error);
    throw error;
  }
};

export const getAllOperatingStates = async (): Promise<IOperatingStateData[]> => {
  try {
    const response = await api.get<IOperatingStateData[]>('/content/operating-states');
    return response.data;
  } catch (error) {
    console.error('Error fetching all operating states:', error);
    throw error;
  }
};

// STUB: Get a specific OperatingState by its ObjectId (if paletteId in profile is an ID)
export const getOperatingStateById = async (id: string): Promise<IOperatingStateData | null> => {
  try {
    console.warn("getOperatingStateById: Backend endpoint not yet implemented.");
    // const response = await api.get<IOperatingStateData>(`/content/operating-states/${id}`);
    // return response.data;
    // Simulating for now:
    const states = await getAllOperatingStates();
    return states.find(s => s._id === id) || null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching operating state by ID ${id}:`, error);
    throw error;
  }
};


export const getAllInstinctualStackings = async (): Promise<IInstinctualStackingData[]> => {
  try {
    const response = await api.get<IInstinctualStackingData[]>('/content/instinctual-stackings');
    return response.data;
  } catch (error) {
    console.error('Error fetching all instinctual stackings:', error);
    throw error;
  }
};

// STUB: Get a specific InstinctualStacking by its ObjectId
export const getInstinctualStackingById = async (id: string): Promise<IInstinctualStackingData | null> => {
  try {
    console.warn("getInstinctualStackingById: Backend endpoint not yet implemented.");
    // const response = await api.get<IInstinctualStackingData>(`/content/instinctual-stackings/${id}`);
    // return response.data;
    // Simulating for now:
    const stackings = await getAllInstinctualStackings();
    return stackings.find(s => s._id === id) || null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching instinctual stacking by ID ${id}:`, error);
    throw error;
  }
};


// --- TypeSpecificText Functions (Conceptual, assuming these are replaced by structured content) ---
// These might still be useful for very generic text snippets not part of main models

export const fetchTypeSpecificTexts = async (
  type: string | null,
  category: string,
  itemKey?: string
): Promise<TypeSpecificTextData[]> => {
  try {
    const params: { type: string; category: string; itemKey?: string } = {
      type: type || 'all',
      category,
    };
    if (itemKey) params.itemKey = itemKey;
    // This endpoint might be deprecated or refactored if all text is within structured models
    const response = await api.get('/content/type-specific-texts', { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching type-specific texts for type ${type}, category ${category}, itemKey ${itemKey}:`, error);
    throw error;
  }
};

export const fetchReportNarrativesForType = async (primaryType: string): Promise<Record<string, string>> => {
  // This should now primarily use the detailed fields from IEnneagramTypeData, IWingData etc.
  // However, if there are additional generic narratives stored as TypeSpecificText, this can fetch them.
  try {
    const textsArray = await fetchTypeSpecificTexts(primaryType, 'reportSectionNarrative');
    const narrativesMap: Record<string, string> = {};
    textsArray.forEach(text => { if (text.itemKey) narrativesMap[text.itemKey] = text.content; });
    return narrativesMap;
  } catch (error) {
    console.error(`Error fetching report narratives for type ${primaryType}:`, error);
    throw error;
  }
};

// ... other specialized fetchers for TypeSpecificText if still needed ...
export const fetchPaletteDescriptionsForType = async (primaryType: string | null): Promise<Record<string, string>> => {
    // This is now better handled by IOperatingStateData.typeSpecificDescriptions
    console.warn("fetchPaletteDescriptionsForType is likely deprecated. Use IOperatingStateData.");
    return {};
};
export const fetchSubtypeContainerDescriptionsForType = async (primaryType: string | null): Promise<Record<string, string>> => {
    // This is now better handled by IInstinctualStackingData.typeSpecificDescriptions
    console.warn("fetchSubtypeContainerDescriptionsForType is likely deprecated. Use IInstinctualStackingData.");
    return {};
};
