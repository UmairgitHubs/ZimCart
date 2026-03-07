import api from './api';
import { User, Order, Voucher, FavouriteItem } from '@/types';

export const customerApi = {
  // Profile
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/customers/profile');
    return data.data; // Assuming standardized ApiResponse wrapper
  },
  
  updateProfile: async (updateData: Partial<User>): Promise<User> => {
    const { data } = await api.patch('/customers/profile', updateData);
    return data.data;
  },

  // Orders
  getOrders: async (status?: 'active' | 'history'): Promise<Order[]> => {
    const { data } = await api.get('/customers/orders', { params: { status } });
    return data.data;
  },
  
  placeOrder: async (orderData: any): Promise<Order> => {
    const { data } = await api.post('/customers/orders', orderData);
    return data.data;
  },

  // Vouchers
  getVouchers: async (): Promise<Voucher[]> => {
    const { data } = await api.get('/customers/vouchers');
    return data.data;
  },

  validateVoucher: async (code: string): Promise<Voucher> => {
    const { data } = await api.post('/customers/vouchers/validate', { code });
    return data.data;
  },

  // Favourites
  getFavourites: async (): Promise<FavouriteItem[]> => {
    const { data } = await api.get('/customers/favourites');
    return data.data;
  },

  toggleFavourite: async (productId: string): Promise<{ isFavourited: boolean }> => {
    const { data } = await api.post(`/customers/favourites/${productId}`);
    return data.data;
  },

  // Addresses
  getAddresses: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/addresses');
    return data.data;
  },

  addAddress: async (address: any): Promise<any> => {
    const { data } = await api.post('/customers/addresses', address);
    return data.data;
  },

  updateAddress: async (id: string, address: any): Promise<any> => {
    const { data } = await api.put(`/customers/addresses/${id}`, address);
    return data.data;
  },

  deleteAddress: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/customers/addresses/${id}`);
    return data.data;
  },

  // Payment Methods
  getPaymentMethods: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/payment-methods');
    return data.data;
  },

  addPaymentMethod: async (method: any): Promise<any> => {
    const { data } = await api.post('/customers/payment-methods', method);
    return data.data;
  },

  setDefaultPaymentMethod: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/customers/payment-methods/${id}/default`);
    return data.data;
  },

  deletePaymentMethod: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/customers/payment-methods/${id}`);
    return data.data;
  },

  // Security
  updateSecurity: async (settings: { isTwoFactorEnabled?: boolean, dataSharingConsent?: boolean }): Promise<any> => {
    const { data } = await api.patch('/customers/security', settings);
    return data.data;
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.post('/customers/account/delete', { password });
  },

  // Data Management
  exportData: async (): Promise<{ message: string }> => {
    const { data } = await api.post('/customers/data/export');
    return data.data;
  },

  clearHistory: async (type: 'search' | 'view' | 'all'): Promise<{ message: string }> => {
    const { data } = await api.post('/customers/data/clear-history', { type });
    return data.data;
  },

  // Sessions
  getSessions: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/sessions');
    return data.data;
  },

  revokeSession: async (id: string): Promise<void> => {
    await api.delete(`/customers/sessions/${id}`);
  },

  revokeAllOtherSessions: async (): Promise<void> => {
    await api.delete('/customers/sessions');
  },

  updatePushToken: async (pushToken: string): Promise<any> => {
    const { data } = await api.post('/customers/push-token', { pushToken });
    return data.data;
  },

  updateNotificationPreferences: async (preferences: any): Promise<any> => {
    const { data } = await api.patch('/customers/notifications/preferences', preferences);
    return data.data;
  },

  getNotifications: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/notifications');
    return data.data;
  },

  markNotificationRead: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/customers/notifications/${id}/read`);
    return data.data;
  },

  markAllNotificationsRead: async (): Promise<any> => {
    const { data } = await api.post('/customers/notifications/read-all');
    return data.data;
  }
};
