import apiClient from '../lib/api-client';
import { Order } from '@/types/orders';

export type OrdersListParams = {
  q?: string;
  status?: string;
  range?: string;
  page?: number;
  limit?: number;
};

export const ordersApi = {
  getAll: async (
    params?: OrdersListParams
  ): Promise<{ orders: Order[]; pagination: { total: number; page: number; pages: number; limit: number } }> => {
    const response = await apiClient.get('/orders', {
      params: {
        search: params?.q,
        status: params?.status && params.status !== 'All Orders' ? params.status : undefined,
        range: params?.range && params.range !== 'All Time' ? params.range : undefined,
        page: params?.page,
        limit: params?.limit,
      },
    });
    return response.data.data;
  },

  getDispatchCandidates: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${encodeURIComponent(orderId)}/dispatch-candidates`);
    return response.data.data.candidates as {
      id: string;
      name: string;
      availability: string;
      distanceKm: number | null;
      activeJobs: number;
      canAssign: boolean;
    }[];
  },

  updateStatus: async (orderId: string, status: string): Promise<any> => {
    const response = await apiClient.patch(`/orders/${encodeURIComponent(orderId)}/status`, { status });
    return response.data.data.order;
  },

  deleteOrder: async (orderId: string): Promise<any> => {
    const { data } = await apiClient.delete(`/orders/${orderId}`);
    return data;
  },

  getStats: async () => {
    const response = await apiClient.get('/orders/stats');
    return response.data.data;
  },
  
  createManualOrder: async (orderData: any): Promise<Order> => {
    const response = await apiClient.post('/orders', orderData);
    return response.data.data.order;
  },

  updateOrder: async (orderId: string, orderData: any): Promise<Order> => {
    const response = await apiClient.put(`/orders/${orderId}`, orderData);
    return response.data.data.order;
  },

  assignRider: async (orderId: string, riderId: string): Promise<void> => {
    await apiClient.patch(`/orders/${encodeURIComponent(orderId)}/assign-rider`, { riderId });
  },

  unassignRider: async (orderId: string): Promise<void> => {
    await apiClient.patch(`/orders/${encodeURIComponent(orderId)}/unassign-rider`);
  },

  autoDispatch: async (orderId: string): Promise<{ order: Order; dispatch: { riderName: string; distanceKm: number } }> => {
    const response = await apiClient.post(`/orders/${encodeURIComponent(orderId)}/auto-dispatch`);
    return response.data.data;
  },
};
