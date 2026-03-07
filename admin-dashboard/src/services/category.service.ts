import apiClient from '@/lib/api-client';
import { Category } from '@/types/categories';

export const categoryService = {
  async getCategories(params?: { search?: string; status?: string }) {
    const { data } = await apiClient.get('/categories', { params });
    return data;
  },

  async createCategory(categoryData: Partial<Category>) {
    const { data } = await apiClient.post('/categories', categoryData);
    return data;
  },

  async updateCategory(id: string, categoryData: Partial<Category>) {
    const { data } = await apiClient.put(`/categories/${id}`, categoryData);
    return data;
  },

  async deleteCategory(id: string) {
    const { data } = await apiClient.delete(`/categories/${id}`);
    return data;
  },
};
