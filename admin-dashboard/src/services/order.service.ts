import apiClient from '../lib/api-client';
import { Order } from '@/types/orders';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders');
    return response.data.data.orders;
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
  }
};
