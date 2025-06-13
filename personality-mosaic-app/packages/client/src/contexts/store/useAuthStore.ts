import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define a basic UserProfile type. This might be expanded or moved to a shared types directory later.
export interface UserProfile {
  id: string;
  email: string;
  // Add other fields like name, avatarUrl, etc., as they become available
  createdAt?: string | Date;
}

export interface AuthStoreState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  error: string | null; // For auth-related errors
  isLoading: boolean; // For login/registration process
}

export interface AuthStoreActions {
  loginSuccess: (data: { accessToken: string; user: UserProfile }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  registerSuccess: () => void; // Called on successful registration.
  // If registration leads to auto-login, this might call loginSuccess or be removed.
  // For now, it indicates registration completed, user can proceed to login.
}

export type AuthStore = AuthStoreState & AuthStoreActions;

// Define the initial state
const initialState: AuthStoreState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  error: null,
  isLoading: false,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      loginSuccess: (data) => {
        console.log('AuthStore: loginSuccess triggered with data:', data);
        // Security Note: Storing JWT (accessToken) in localStorage is vulnerable to XSS.
        // For production, consider more secure alternatives:
        // 1. Store accessToken in memory and use HttpOnly refresh tokens (server sets this).
        // 2. If accessToken must persist tab closure but not full browser session, use sessionStorage.
        // This example uses localStorage via `persist` middleware for simplicity and to demonstrate Zustand's capabilities.
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
        // Future: Call backend to invalidate refresh token if it's managed server-side (e.g., in DB).
        set(initialState); // Reset all auth state
        // Note: The `persist` middleware will also clear the persisted state from localStorage.
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      setError: (error) => {
        set({ error, isLoading: false }); // Also ensure loading is false on error
      },
      registerSuccess: () => {
        console.log('AuthStore: registerSuccess triggered');
        // This action confirms registration was successful.
        // Does not log the user in automatically. User should proceed to login.
        set({ isLoading: false, error: null });
      },
    }),
    {
      name: 'auth-storage', // Unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // Persist to localStorage
      partialize: (state) => ({
        // Selectively persist parts of the store.
        // Persisting accessToken in localStorage is common but has XSS risks.
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore;
