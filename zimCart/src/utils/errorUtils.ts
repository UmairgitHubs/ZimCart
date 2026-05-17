import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

type ParseApiErrorOptions = {
  /** Skip LogBox/console noise for expected validation errors (e.g. 409 duplicate email). */
  quiet?: boolean;
};

/**
 * Standardized error message extraction.
 * Returns a user-friendly string for UI display.
 */
export const parseApiError = (error: unknown, options?: ParseApiErrorOptions): string => {
  const quiet = options?.quiet ?? false;

  if (!quiet) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const isClientError = status !== undefined && status >= 400 && status < 500;
      const log = isClientError ? console.warn : console.error;
      log('API Error Details:', {
        endpoint: error.config?.url,
        method: error.config?.method,
        status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('Unexpected Error:', error);
    }
  }

  // 2. Return clean user-facing message
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Specific Backend Error Format (e.g., from ApiError class)
    if (data && typeof data === 'object') {
       if (data.message) return data.message;
       if (data.error) return data.error;
    }

    // HTTP Status Fallbacks
    if (error.response) {
      switch (error.response.status) {
        case 400: return 'Invalid request. Please check your inputs.';
        case 401: return 'Session expired or unauthorized. Please log in.';
        case 403: return 'You do not have permission to perform this action.';
        case 404: return 'Resource not found.';
        case 429: return 'Too many requests. Please try again later.';
        case 500: return 'Server error. Our team is working on it.';
        case 503: return 'Service unavailable. Please try again later.';
        default: return 'Something went wrong. Please try again.';
      }
    }

    // Network Errors (no response — backend unreachable, wrong IP, or server stopped)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      if (__DEV__) {
        return `Cannot reach the server at ${API_BASE_URL}. Start the backend (npm run dev in /backend) and ensure your phone is on the same Wi‑Fi.`;
      }
      return 'Network connection lost. Please check your internet.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
  }

  // Fallback for non-Axios errors
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};
