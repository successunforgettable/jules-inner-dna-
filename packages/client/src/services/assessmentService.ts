import api from './api'; // Import the global Axios instance
import { IAssessmentProfile } from '../../../shared/types/assessment.types'; // Adjust path as needed

// Client-side type corresponding to IAssessmentProfile, potentially with some fields optional for creation/update
// For now, let's assume IAssessmentProfile from shared types can be used,
// or a specific client-side version will be defined if differences arise.
// Example: export type ClientAssessmentProfileData = Partial<IAssessmentProfile>;

/**
 * Saves or updates the user's assessment profile.
 * @param profileData - The assessment profile data to save.
 *                      Can be a partial profile if just updating parts,
 *                      or a full profile if completing the assessment.
 * @returns The saved assessment profile from the backend.
 */
export const saveAssessmentProfile = async (profileData: Partial<IAssessmentProfile>): Promise<IAssessmentProfile> => {
  try {
    const response = await api.post<IAssessmentProfile>('/assessment/profile', profileData);
    return response.data;
  } catch (error: any) {
    // Enhance error handling based on actual error structure from Axios
    const message = error.response?.data?.message || error.message || 'Failed to save assessment profile.';
    console.error('Error saving assessment profile:', error.response?.data || error);
    throw new Error(message);
  }
};

/**
 * Fetches the current user's assessment profile.
 * @returns The user's assessment profile.
 */
export const getAssessmentProfile = async (): Promise<IAssessmentProfile> => {
  try {
    const response = await api.get<IAssessmentProfile>('/assessment/profile');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch assessment profile.';
    console.error('Error fetching assessment profile:', error.response?.data || error);
    // If 404, it means profile doesn't exist. The service could return null or a specific error.
    if (error.response?.status === 404) {
      // Or throw a custom error: throw new ProfileNotFoundError('Profile not found');
      console.log('Assessment profile not found for user (404).');
      // Depending on how the store handles this, returning null might be an option
      // or re-throwing to be caught by the store action. For now, re-throw.
    }
    throw new Error(message);
  }
};
