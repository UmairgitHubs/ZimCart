import { User } from '@/types';
import { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import api from './api';

// Response types based on backend ApiResponse
interface AuthResponse {
    statusCode: number;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
    message: string;
    success: boolean;
}

export const authApi = {
  login: async (credentials: LoginFormData) => {
    const response = await api.post('/auth/login', credentials);
    // The backend returns: { data: { user, accessToken, refreshToken } }
    // We need to return an object that matches what useAuth expects for setCredentials payload
    return {
        user: response.data.data.user,
        token: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
    };
  },

  register: async (data: RegisterFormData) => {
    // Destructure to remove confirmPassword
    const { confirmPassword, ...registerData } = data;
    const response = await api.post('/auth/register', registerData);
    return {
        user: response.data.data.user,
        token: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
    };
  },

  logout: async (): Promise<void> => {
     try {
         await api.post('/auth/logout');
     } catch (e) {
         console.error("Logout failed", e);
     }
  },

  forgotPassword: async (email: string): Promise<string> => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data.message;
  },

  resetPassword: async (data: any): Promise<string> => {
      const { password, token } = data;
      const response = await api.post('/auth/reset-password', { password, token });
      return response.data.message;
  }
};
