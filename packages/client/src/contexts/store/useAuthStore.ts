import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../../services/api'; // For logout API call & refresh

// In-memory storage for the access token
let inMemoryAccessToken: string | null = null;

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  // Add other relevant user profile fields
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginSuccess: (data: { accessToken: string; user: UserProfile }) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // For direct in-memory token access if needed by interceptors outside of react context
  getInMemoryAccessToken: () => string | null;
  // For token refresh mechanism
  refreshAuthStatus: () => Promise<void>;
  setRefreshedToken: (newAccessToken: string, user: UserProfile) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      getInMemoryAccessToken: () => inMemoryAccessToken,

      loginSuccess: (data) => {
        inMemoryAccessToken = data.accessToken;
        set({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
          error: null,
        });
        // Update api default header for subsequent requests in this session
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      },

      logout: async () => {
        try {
          await api.post('/auth/logout'); // Notify backend
        } catch (error) {
          console.error("Logout API call failed:", error);
          // Even if backend logout fails, clear client-side session
        } finally {
          inMemoryAccessToken = null;
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
          // Remove Authorization header from api defaults
          delete api.defaults.headers.common['Authorization'];
          // Optionally, redirect or trigger redirect globally
          // This might be handled by a component reacting to isAuthenticated state
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),

      refreshAuthStatus: async () => {
        try {
          set({ isLoading: true });
          const response = await api.post<{ accessToken: string; user: UserProfile }>('/auth/refresh-token');
          get().setRefreshedToken(response.data.accessToken, response.data.user);
        } catch (error) {
          console.warn("Silent token refresh failed:", error);
          // If refresh fails, ensure user is logged out.
          // This might be redundant if the response interceptor already handles it on subsequent API calls.
          // However, for initial load, it's good to ensure clean state.
          if (get().isAuthenticated) { // Only logout if was previously authenticated
             await get().logout(); // Call the full logout to clear everything
          } else {
             set({ isLoading: false }); // Ensure loading is false if was not authenticated
          }
        }
      },

      setRefreshedToken: (newAccessToken, user) => {
        inMemoryAccessToken = newAccessToken;
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      },
    }),
    {
      name: 'auth-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({
        // Persist only these parts of the state:
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // DO NOT persist accessToken here. isLoading and error are also typically not persisted.
      }),
    }
  )
);

export default useAuthStore;
