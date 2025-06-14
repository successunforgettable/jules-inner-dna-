import axios from 'axios';
import useAuthStore from '../contexts/store/useAuthStore'; // To get state directly (see note)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    // Routes that should not receive the auth token
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh-token', // If you had a refresh token endpoint called by client
    ];

    // Check if the request URL matches any of the public routes
    const isPublicRoute = publicRoutes.some(route => config.url?.endsWith(route));

    if (isPublicRoute) {
      return config; // Don't add token for public routes
    }

    // Accessing Zustand store state outside of React components or custom hooks:
    // `useAuthStore.getState()` allows reading the current state.
    // This is generally acceptable for use cases like Axios interceptors.
    const token = useAuthStore.getState().getAccessToken(); // Updated to use new getter

    // Note: If accessToken was persisted to localStorage by Zustand's 'persist' middleware,
    // you could also retrieve it like this, which avoids direct store import in some patterns:
    // const authStorage = localStorage.getItem('auth-storage');
    // const token = authStorage ? JSON.parse(authStorage).state?.accessToken : null;

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

    // Check if it's a 401 error and not a retry request for token refresh itself,
    // and not for login/register which might return 401 for wrong credentials.
    const nonAuthRetryEndpoints = ['/auth/login', '/auth/register', '/auth/refresh-token'];
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !nonAuthRetryEndpoints.some(endpoint => originalRequest.url.endsWith(endpoint))
    ) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops
      console.log('API Interceptor: Detected 401, attempting token refresh for', originalRequest.url);

      try {
        const { data } = await api.post('/auth/refresh-token'); // Assumes HttpOnly cookie for refresh token
        const newAccessToken = data.accessToken;
        const userDetails = data.user;

        useAuthStore.getState().setRefreshedSession({ accessToken: newAccessToken, user: userDetails });

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError: any) {
        console.error("API Interceptor: Token refresh failed.", refreshError);
        // If refresh fails (e.g. refresh token invalid/expired), logout the user.
        // This logout will also clear the in-memory access token and persisted auth state.
        await useAuthStore.getState().logout();
        // It's important to reject the original promise so the caller knows the request ultimately failed.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For errors other than 401 or if retry already attempted/not applicable
  }
);

export default api;
