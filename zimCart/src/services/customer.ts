import api from './api';
import { User, Order, Voucher, FavouriteItem } from '@/types';

export const customerApi = {
  // Profile
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/customer/profile');
    return data.data; // Assuming standardized ApiResponse wrapper
  },
  
  updateProfile: async (updateData: Partial<User>): Promise<User> => {
    const { data } = await api.patch('/customer/profile', updateData);
    return data.data;
  },

  // Orders
  getOrders: async (status?: 'active' | 'history'): Promise<Order[]> => {
    const { data } = await api.get('/customer/orders', { params: { status } });
    return data.data;
  },
  
  placeOrder: async (orderData: any): Promise<Order> => {
    const { data } = await api.post('/customer/orders', orderData);
    return data.data;
  },

  // Vouchers
  getVouchers: async (): Promise<Voucher[]> => {
    const { data } = await api.get('/customer/vouchers');
    return data.data;
  },

  // Favourites
  getFavourites: async (): Promise<FavouriteItem[]> => {
    const { data } = await api.get('/customer/favourites');
    return data.data;
  },

  toggleFavourite: async (productId: string): Promise<{ isFavourited: boolean }> => {
    const { data } = await api.post(`/customer/favourites/${productId}`);
    return data.data;
  },

  // Addresses
  getAddresses: async (): Promise<any[]> => {
    const { data } = await api.get('/customer/addresses');
    return data.data;
  },

  addAddress: async (address: any): Promise<any> => {
    const { data } = await api.post('/customer/addresses', address);
    return data.data;
  },

  updateAddress: async (id: string, address: any): Promise<any> => {
    const { data } = await api.put(`/customer/addresses/${id}`, address);
    return data.data;
  },

  deleteAddress: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/customer/addresses/${id}`);
    return data.data;
  },

  // Security
  updateSecurity: async (settings: { isTwoFactorEnabled?: boolean, dataSharingConsent?: boolean }): Promise<any> => {
    const { data } = await api.patch('/customer/security', settings);
    return data.data;
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.post('/customer/account/delete', { password });
  },

  // Data Management
  exportData: async (): Promise<{ message: string }> => {
    const { data } = await api.post('/customer/data/export');
    return data.data;
  },

  clearHistory: async (type: 'search' | 'view' | 'all'): Promise<{ message: string }> => {
    const { data } = await api.post('/customer/data/clear-history', { type });
    return data.data;
  },

  // Sessions
  getSessions: async (): Promise<any[]> => {
    const { data } = await api.get('/customer/sessions');
    return data.data;
  },

  revokeSession: async (id: string): Promise<void> => {
    await api.delete(`/customer/sessions/${id}`);
  },

  revokeAllOtherSessions: async (): Promise<void> => {
    await api.delete('/customer/sessions');
  },

  updatePushToken: async (pushToken: string): Promise<any> => {
    const { data } = await api.post('/customer/push-token', { pushToken });
    return data.data;
  },

  updateNotificationPreferences: async (preferences: any): Promise<any> => {
    const { data } = await api.patch('/customer/notifications/preferences', preferences);
    return data.data;
  },

  getNotifications: async (): Promise<any[]> => {
    const { data } = await api.get('/customer/notifications');
    return data.data;
  },

  markNotificationRead: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/customer/notifications/${id}/read`);
    return data.data;
  },

  markAllNotificationsRead: async (): Promise<any> => {
    const { data } = await api.post('/customer/notifications/read-all');
    return data.data;
  }
};
