import axios from 'axios';
import { store } from '@/store'; // Direct import to avoid hooks
import { setCredentials, logout } from '@/store/slices/auth.slice';
import { API_BASE_URL } from '@/config/apiConfig';

const BASE_URL = API_BASE_URL;

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

    const requestUrl = String(originalRequest?.url ?? '');
    const isLogoutRequest = requestUrl.includes('/auth/logout');

    // Logout with an expired/invalid token is fine — do not refresh or clear auth here
    if (error.response?.status === 401 && isLogoutRequest) {
      return Promise.reject(error);
    }

    // Check for 401 Unauthorized and ensure we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = (state.auth as any).refreshToken; 

        if (!refreshToken) {
           // Silently logout instead of throwing a raw error string
           store.dispatch(logout());
           return Promise.reject(error);
        }

        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

        store.dispatch(setCredentials({ 
            user: state.auth.user!, 
            token: accessToken,
            refreshToken: newRefreshToken 
        }));

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
