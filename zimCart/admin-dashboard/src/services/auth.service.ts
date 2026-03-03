import apiClient from '@/lib/api-client';
import { LoginInput, SignupInput, ForgotPasswordInput, ResetPasswordInput } from '@/validations/auth';

export const authService = {
  async login(data: LoginInput) {
    const response = await apiClient.post('/auth/login', {
      email: data.email,
      password: data.password
    });
    return response.data;
  },

  async signup(data: SignupInput & { name?: string; role?: string }) {
    const response = await apiClient.post('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.martName,
      phone: data.phone,
      country: data.country,
      role: data.role,
      termsConsent: data.agreeToTerms,
      privacyConsent: data.agreeToPrivacy
    });
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordInput) {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  async verifyResetCode(data: { email: string; code: string }) {
    const response = await apiClient.post('/auth/verify-reset-code', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordInput & { token: string }) {
    const response = await apiClient.post('/auth/reset-password', {
      token: data.token,
      password: data.password
    });
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};
