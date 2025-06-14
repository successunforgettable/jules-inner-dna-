import axios from 'axios';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

import useAuthStore from '../contexts/store/useAuthStore'; // Import the auth store

// Request interceptor to include JWT token from in-memory store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getInMemoryAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a retry request for token refresh itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      try {
        // Attempt to refresh the token. Assumes HttpOnly cookie for refresh token.
        const { data } = await api.post('/auth/refresh-token');
        const newAccessToken = data.accessToken;
        const userDetails = data.user; // Assuming refresh also returns user details

        // Update token and user in the auth store
        useAuthStore.getState().setRefreshedToken(newAccessToken, userDetails);

        // Update the Authorization header for the original request and for api defaults
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        // api.defaults.headers.common['Authorization'] is already set by setRefreshedToken

        return api(originalRequest); // Retry the original request with the new token
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError);
        // If refresh fails, logout the user
        // Check if it's a network error or a specific status code from refresh token endpoint
        if (refreshError.response && (refreshError.response.status === 401 || refreshError.response.status === 403)) {
          // These statuses from /auth/refresh-token indicate invalid/expired refresh token
          await useAuthStore.getState().logout();
        } else {
          // For other errors (e.g. network), just reject the original promise
          // Or, could also logout if any refresh error means session is untrustworthy
           await useAuthStore.getState().logout(); // Defaulting to logout on any refresh error
        }
        return Promise.reject(refreshError); // Reject the promise of the original request
      }
    }
    return Promise.reject(error); // For errors other than 401 or if retry already attempted
  }
);

export default api;
