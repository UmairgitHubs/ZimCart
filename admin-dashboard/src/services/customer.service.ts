import apiClient from '../lib/api-client';
import { Customer } from '@/types/customers';

export const customerApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<{ customers: Customer[], pagination: any }> => {
    const response = await apiClient.get('/customers/admin/all', { params });
    return response.data.data;
  },
  create: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.post('/customers/admin/create', data);
    return response.data.data.customer;
  },
  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.patch(`/customers/admin/${id}`, data);
    return response.data.data.customer;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/admin/${id}`);
  }
};
