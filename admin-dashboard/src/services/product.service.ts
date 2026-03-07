import apiClient from '@/lib/api-client';
import { Product } from '@/types/products';

export const productService = {
  async getProducts(params?: { page?: number; limit?: number; category?: string; status?: string; search?: string }) {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  async getProduct(id: string) {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  async createProduct(productData: Partial<Product>) {
    const { data } = await apiClient.post('/products', productData);
    return data;
  },

  async updateProduct(id: string, productData: Partial<Product>) {
    const { data } = await apiClient.patch(`/products/${id}`, productData);
    return data;
  },

  async deleteProduct(id: string) {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  async bulkUpdateStatus(ids: string[], status: string) {
    const { data } = await apiClient.patch('/products/bulk-status', { ids, status });
    return data;
  },
};
