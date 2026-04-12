import api from './api';

export const marketplaceApi = {
  getMarts: async () => {
    const { data } = await api.get('/marts');
    return data.data;
  },

  getMartDetails: async (id: string, params?: { q?: string; category?: string }, signal?: AbortSignal) => {
    const { data } = await api.get(`/marts/${id}`, { params, signal });
    return data.data;
  },

  getProducts: async (params: {
    storeId?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
    isDeal?: boolean;
    /** Marketplace catalog filter (e.g. Published) */
    status?: string;
  }) => {
    const { data } = await api.get('/products', { params });
    return data.data;
  },

  getCategories: async (params: { storeId?: string }) => {
    const { data } = await api.get('/categories', { params });
    return data.data;
  }
};
