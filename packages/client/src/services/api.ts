import axios from 'axios';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    // Assuming you store your token in localStorage or a state management solution
    // For example, using localStorage:
    const token = localStorage.getItem('accessToken'); // Adjust key as needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for global error handling or token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;
    // Example: Handle token expiry and refresh
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refreshToken = localStorage.getItem('refreshToken'); // Adjust key
    //     const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
    //     localStorage.setItem('accessToken', data.accessToken);
    //     api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
    //     originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
    //     return api(originalRequest);
    //   } catch (refreshError) {
    //     // Handle refresh token failure (e.g., logout user)
    //     console.error("Token refresh failed:", refreshError);
    //     // window.location.href = '/login'; // Or dispatch a logout action
    //     return Promise.reject(refreshError);
    //   }
    // }
    return Promise.reject(error);
  }
);

export default api;
