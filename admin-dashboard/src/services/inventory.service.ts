import apiClient from '@/lib/api-client';

export const inventoryService = {
  async getInventory(params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    status?: string; 
    search?: string;
    warehouse?: string;
  }) {
    const { data } = await apiClient.get('/inventory', { params });
    return data;
  },

  async updateStock(id: string, updateData: { currentStock: number; reason?: string }) {
    const { data } = await apiClient.patch(`/inventory/${id}`, updateData);
    return data;
  },

  async getInventoryHistory(id: string) {
    const { data } = await apiClient.get(`/inventory/${id}/history`);
    return data;
  },

  async deleteInventory(id: string) {
    const { data } = await apiClient.delete(`/inventory/${id}`);
    return data;
  }
};
