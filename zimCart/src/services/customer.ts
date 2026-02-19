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
  }
};
