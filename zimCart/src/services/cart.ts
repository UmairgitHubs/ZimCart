import api from './api';

export const cartApi = {
  getCart: async () => {
    const { data } = await api.get('/cart');
    return data.data;
  },

  addToCart: async (productId: string, quantity: number, variants: any) => {
    const { data } = await api.post('/cart/add', { productId, quantity, variants });
    return data.data;
  },

  updateCartItem: async (id: string, quantity: number) => {
    const { data } = await api.patch(`/cart/item/${id}`, { quantity });
    return data.data;
  },

  removeFromCart: async (id: string) => {
    const { data } = await api.delete(`/cart/item/${id}`);
    return data.data;
  },

  clearCart: async () => {
    const { data } = await api.delete('/cart/clear');
    return data.data;
  }
};
