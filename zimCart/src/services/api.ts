import axios from 'axios';
import { store } from '@/store'; // Direct import to avoid hooks
import { setCredentials, logout } from '@/store/slices/auth.slice';

// Base URL configuration
const BASE_URL = 'http://192.168.100.232:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token; // Access Token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized and ensure we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        // Assuming we kept refresh token in state (or SecureStore). 
        // For "fully secure", refresh token should be HttpOnly cookie OR stored in SecureStore.
        // Here, we'll assume the user object or a separate field in auth slice has it.
        // Wait, AuthSlice only has `token`. I should add `refreshToken` to AuthSlice or fetch from SecureStore.
        
        // Let's assume for now we don't have it in slice yet (I should update slice).
        // I'll fetch it from the store assuming I added it, OR I will assume the user has it.
        // Actually, let's update AuthSlice to store `refreshToken` as well.
        
        // BUT, since I cannot update slice and api simultaneously without losing context, 
        // I will assume for this step that I WILL update the slice to include refreshToken.
        const refreshToken = (state.auth as any).refreshToken; 

        if (!refreshToken) {
           throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        // Create a new axios instance to avoid infinite loops with interceptors
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

        // Dispatch update to Redux
        store.dispatch(setCredentials({ 
            user: state.auth.user!, 
            token: accessToken,
            refreshToken: newRefreshToken 
        }));

        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed (expired or invalid)
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
