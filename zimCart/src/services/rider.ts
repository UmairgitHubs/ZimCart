import api from './api';
import type {
  DeliveryAction,
  RiderEarnings,
  RiderJob,
  RiderNotification,
  RiderProfile,
  RiderPayout,
  RiderWallet,
} from '@/types/rider';

export const riderApi = {
  getMe: async (): Promise<RiderProfile> => {
    const response = await api.get('/rider/me');
    return response.data.data.rider;
  },

  getJobs: async (filter: 'active' | 'completed' = 'active'): Promise<RiderJob[]> => {
    const response = await api.get('/rider/jobs', { params: { filter } });
    return response.data.data.jobs;
  },

  getJob: async (orderId: string): Promise<RiderJob> => {
    const response = await api.get(`/rider/jobs/${encodeURIComponent(orderId)}`);
    return response.data.data.job;
  },

  setAvailability: async (availability: 'AVAILABLE' | 'OFFLINE') => {
    const response = await api.patch('/rider/availability', { availability });
    return response.data.data as { availability: string; isOnline: boolean };
  },

  updateJobStatus: async (
    orderId: string,
    action: DeliveryAction,
    note?: string,
    proofOfDeliveryUrl?: string
  ): Promise<RiderJob> => {
    const response = await api.patch(`/rider/jobs/${encodeURIComponent(orderId)}/status`, {
      action,
      note,
      ...(proofOfDeliveryUrl ? { proofOfDeliveryUrl } : {}),
    });
    return response.data.data.job;
  },

  getEarnings: async (): Promise<RiderEarnings> => {
    const response = await api.get('/rider/earnings');
    return response.data.data.earnings;
  },

  getNotifications: async (): Promise<{ unreadCount: number; notifications: RiderNotification[] }> => {
    const response = await api.get('/rider/notifications');
    return response.data.data;
  },

  markNotificationRead: async (id: string) => {
    await api.patch(`/rider/notifications/${id}/read`);
  },

  markAllNotificationsRead: async () => {
    await api.patch('/rider/notifications/read-all');
  },

  updateProfile: async (data: { phone?: string; name?: string }): Promise<RiderProfile> => {
    const response = await api.patch('/rider/profile', data);
    return response.data.data.rider;
  },

  updatePushToken: async (pushToken: string) => {
    await api.post('/rider/push-token', { pushToken });
  },

  updateLocation: async (latitude: number, longitude: number) => {
    await api.post('/rider/location', { latitude, longitude });
  },

  getWallet: async (): Promise<RiderWallet> => {
    const response = await api.get('/rider/wallet');
    return response.data.data.wallet;
  },

  requestPayout: async (payload: {
    amount: number;
    method: string;
    accountRef: string;
    accountName?: string;
    notes?: string;
  }): Promise<RiderPayout> => {
    const response = await api.post('/rider/payouts', payload);
    return response.data.data.payout;
  },
};
