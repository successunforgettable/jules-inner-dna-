import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import api from '../../services/api'; // For logout and refresh API calls

// Module-level variable for in-memory access token
let inMemoryAccessToken: string | null = null;

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt?: string | Date;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Covers login, registration, refresh
  error: string | null; // For auth-related errors
}

interface AuthActions {
  loginSuccess: (data: { accessToken: string; user: UserProfile }) => void;
  logout: () => Promise<void>; // Now async due to API call
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  registerSuccess: () => void;
  getAccessToken: () => string | null; // Getter for in-memory token
  setRefreshedSession: (data: { accessToken: string; user: UserProfile }) => void;
  attemptSilentRefresh: () => Promise<boolean>;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getAccessToken: () => inMemoryAccessToken,

      loginSuccess: (data) => {
        console.log('AuthStore: loginSuccess. Storing token in memory.');
        inMemoryAccessToken = data.accessToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        set({
          isAuthenticated: true,
          user: data.user,
          error: null,
          isLoading: false,
        });
      },

      logout: async () => {
        console.log('AuthStore: logout triggered.');
        inMemoryAccessToken = null;
        delete api.defaults.headers.common['Authorization'];
        set({ ...initialState, isLoading: true }); // Set loading true for logout process

        try {
          await api.post('/auth/logout'); // Notify backend to invalidate session/HttpOnly refresh token
          console.log('AuthStore: Backend logout successful.');
        } catch (error) {
          console.error('AuthStore: Backend logout API call failed:', error);
          // Still proceed with client-side logout even if backend call fails
        } finally {
          set(initialState); // Reset all auth state (isAuthenticated, user, error, isLoading)
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error, isLoading: false }),

      registerSuccess: () => {
        console.log('AuthStore: registerSuccess triggered');
        set({ isLoading: false, error: null });
      },

      setRefreshedSession: (data) => {
        console.log('AuthStore: setRefreshedSession. Updating token in memory and user.');
        inMemoryAccessToken = data.accessToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        set({
          isAuthenticated: true,
          user: data.user,
          error: null,
          isLoading: false,
        });
      },

      attemptSilentRefresh: async () => {
        console.log('AuthStore: attemptSilentRefresh called.');
        set({ isLoading: true });
        try {
          const response = await api.post<{ accessToken: string; user: UserProfile }>('/auth/refresh-token');
          get().setRefreshedSession(response.data);
          console.log('AuthStore: Silent refresh successful.');
          return true;
        } catch (error: any) {
          console.warn('AuthStore: Silent token refresh failed.', error.message);
          // Do not logout here if the error is e.g. network, only if it's an auth error from refresh
          // The response interceptor in api.ts will handle logout on 401 from /auth/refresh-token
          // For other errors during silent refresh, we might just want to set isAuthenticated to false
          // without clearing user data if they were previously "remembered".
          // However, spec implies logout on failure.
          // If error.response is not 401 (e.g. network error), user is not logged out, stays in previous state.
          // If error.response IS 401 (invalid refresh token), interceptor in api.ts should call logout().
          // For safety, ensure not authenticated if refresh fails for auth reasons.
          // The current response interceptor handles logout on refresh failure.
          set({ isLoading: false }); // Clear loading state
          // If isAuthenticated was true, the interceptor should have handled logout.
          // If it wasn't, and refresh failed, then it remains not authenticated.
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Selectively persist parts of the store:
        isAuthenticated: state.isAuthenticated, // To remember logged-in status across sessions for UX
        user: state.user,                     // To display user info quickly on reload
        // DO NOT persist accessToken or any sensitive token here.
        // isLoading and error are also typically not persisted.
      }),
    }
  )
);

export default useAuthStore;
