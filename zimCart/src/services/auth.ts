import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { User } from '@/types';
import { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import api from './api';

// Helper to get device info
const getDeviceMetadata = () => ({
    name: Constants.deviceName || (Platform.OS === 'ios' ? 'iPhone' : 'Android Device'),
    type: 'mobile',
    os: Platform.OS === 'ios' ? 'iOS' : 'Android',
});

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
    const response = await api.post('/auth/login', {
        ...credentials,
        deviceInfo: getDeviceMetadata()
    });
    const data = response.data.data;

    if (data.mfaRequired) {
        return {
            mfaRequired: true,
            mfaToken: data.mfaToken,
            email: data.email
        };
    }

    return {
        user: data.user,
        token: data.accessToken,
        refreshToken: data.refreshToken
    };
  },

  register: async (data: RegisterFormData) => {
    // Destructure to remove confirmPassword
    const { confirmPassword, ...registerData } = data;
    const response = await api.post('/auth/register', {
        ...registerData,
        deviceInfo: getDeviceMetadata()
    });
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

  verifyResetCode: async (email: string, code: string): Promise<string> => {
      const response = await api.post('/auth/verify-reset-code', { email, code });
      return response.data.data.token; // Returns the secure token for the next step
  },

  resetPassword: async (data: any): Promise<string> => {
      const { password, token } = data;
      const response = await api.post('/auth/reset-password', { password, token });
      return response.data.message;
  },

  changePassword: async (data: any): Promise<string> => {
      const response = await api.post('/auth/change-password', data);
      return response.data.message;
  },

  verify2FA: async (mfaToken: string, code: string) => {
      const response = await api.post('/auth/verify-2fa', { 
          mfaToken, 
          code,
          deviceInfo: getDeviceMetadata()
      });
      return {
          user: response.data.data.user,
          token: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken
      };
  },

  resend2FA: async (mfaToken: string) => {
      const response = await api.post('/auth/resend-2fa', { mfaToken });
      return response.data.message;
  }
};
