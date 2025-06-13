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
    const token = useAuthStore.getState().accessToken;

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

// Optional: Response interceptor for global error handling or token refresh logic
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Example: Call a refreshToken endpoint
//         // const { data } = await api.post('/auth/refresh-token', { refreshToken: useAuthStore.getState().refreshToken });
//         // const newAccessToken = data.accessToken;
//         // useAuthStore.getState().setAccessToken(newAccessToken); // Assuming you have a setAccessToken action
//         // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         // return api(originalRequest);
//         console.log("Original request was unauthorized, need to implement refresh token logic or logout.");
//         useAuthStore.getState().logout(); // Simple logout on 401 for now
//         // window.location.href = '/'; // Or redirect to login
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
