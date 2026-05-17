import api from './api';
import { User, Order, OrderItem, Voucher, FavouriteItem, OrderTracking } from '@/types';

type ApiOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  platformFee?: number;
  discount?: number;
  createdAt: string;
  address: string;
  paymentMethod?: string;
  trackingUrl?: string | null;
  storeId: string;
  store?: { name?: string; image?: string | null };
  items?: Array<{
    id: string;
    productId: string;
    name?: string;
    quantity: number;
    price: number;
    product?: { name?: string; images?: string[] };
  }>;
};

function mapApiOrderStatus(status: string): Order['status'] {
  switch (status) {
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    case 'SHIPPING':
      return 'shipping';
    case 'PENDING':
      return 'pending';
    case 'CONFIRMED':
    case 'PREPARING':
      return 'active';
    default:
      return 'pending';
  }
}

function mapApiOrderToOrder(raw: ApiOrder): Order {
  const items: OrderItem[] = (raw.items ?? []).map((it) => {
    const name = it.name || it.product?.name || 'Item';
    const image = it.product?.images?.[0];
    return {
      id: it.productId,
      productId: it.productId,
      name,
      quantity: it.quantity,
      price: it.price,
      image,
    };
  });

  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    date: raw.createdAt,
    status: mapApiOrderStatus(raw.status),
    items,
    subtotal: raw.subtotal,
    deliveryFee: raw.deliveryFee,
    platformFee: raw.platformFee ?? 0,
    discount: raw.discount ?? 0,
    total: raw.total,
    store: {
      id: raw.storeId,
      name: raw.store?.name ?? 'Store',
      image: raw.store?.image || 'https://via.placeholder.com/200',
    },
    trackingUrl: raw.trackingUrl ?? undefined,
    paymentMethod: raw.paymentMethod ?? '',
    deliveryAddress: typeof raw.address === 'string' ? raw.address : '',
  };
}

type UserVoucherApiRow = {
  id: string;
  isUsed: boolean;
  voucher: {
    id: string;
    code: string;
    description: string | null;
    discountType: 'PERCENTAGE' | 'FIXED';
    value: number;
    minSpend: number | null;
    maxDiscount: number | null;
    expiryDate: string;
    isActive: boolean;
  };
};

function mapUserVoucherRow(row: UserVoucherApiRow): Voucher {
  const v = row.voucher;
  const exp = new Date(v.expiryDate);
  const now = new Date();
  let status: Voucher['status'] = 'active';
  if (row.isUsed) status = 'used';
  else if (!v.isActive || exp < now) status = 'expired';

  return {
    id: row.id,
    code: v.code,
    description: v.description ?? '',
    discountType: v.discountType,
    value: v.value,
    minSpend: v.minSpend ?? undefined,
    maxDiscount: v.maxDiscount ?? undefined,
    expiryDate: exp.toISOString(),
    status,
    title: v.code,
  };
}

export const customerApi = {
  // Profile
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/customers/profile');
    return data.data; // Assuming standardized ApiResponse wrapper
  },
  
  updateProfile: async (updateData: Partial<User>): Promise<User> => {
    const { data } = await api.patch('/customers/profile', updateData);
    return data.data;
  },

  // Orders
  getOrders: async (status?: 'active' | 'history'): Promise<Order[]> => {
    const { data } = await api.get('/customers/orders', { params: { status } });
    const raw = data.data;
    if (!Array.isArray(raw)) return [];
    return raw.map((row: unknown) => mapApiOrderToOrder(row as ApiOrder));
  },
  
  previewOrder: async (payload: {
    storeId: string;
    items: { productId: string; quantity: number }[];
    deliveryFee?: number;
    voucherCode?: string;
  }): Promise<{
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    discount: number;
    total: number;
  }> => {
    const { data } = await api.post('/customers/orders/preview', payload);
    return data.data;
  },

  placeOrder: async (orderData: any): Promise<Order> => {
    const { data } = await api.post('/customers/orders', orderData);
    return mapApiOrderToOrder(data.data as ApiOrder);
  },

  getOrderTracking: async (orderId: string): Promise<OrderTracking> => {
    const { data } = await api.get(`/customers/orders/${orderId}/tracking`);
    return data.data as OrderTracking;
  },

  // Vouchers (API returns UserVoucher rows with nested `voucher`)
  getVouchers: async (): Promise<Voucher[]> => {
    const { data } = await api.get('/customers/vouchers');
    const raw = data.data;
    if (!Array.isArray(raw)) return [];
    return raw.map((row: unknown) => {
      const r = row as Partial<UserVoucherApiRow>;
      if (r?.voucher && typeof r.voucher === 'object' && r.id != null && typeof r.isUsed === 'boolean') {
        return mapUserVoucherRow(row as UserVoucherApiRow);
      }
      return row as Voucher;
    });
  },

  validateVoucher: async (code: string): Promise<Voucher> => {
    const { data } = await api.post('/customers/vouchers/validate', { code });
    return data.data;
  },

  // Favourites
  getFavourites: async (): Promise<FavouriteItem[]> => {
    const { data } = await api.get('/customers/favourites');
    return data.data;
  },

  toggleFavourite: async (productId: string): Promise<{ isFavourited: boolean }> => {
    const { data } = await api.post(`/customers/favourites/${productId}`);
    return data.data;
  },

  // Addresses
  getAddresses: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/addresses');
    return data.data;
  },

  addAddress: async (address: any): Promise<any> => {
    const { data } = await api.post('/customers/addresses', address);
    return data.data;
  },

  updateAddress: async (id: string, address: any): Promise<any> => {
    const { data } = await api.put(`/customers/addresses/${id}`, address);
    return data.data;
  },

  deleteAddress: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/customers/addresses/${id}`);
    return data.data;
  },

  // Payment Methods
  getPaymentMethods: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/payment-methods');
    return data.data;
  },

  addPaymentMethod: async (method: any): Promise<any> => {
    const { data } = await api.post('/customers/payment-methods', method);
    return data.data;
  },

  setDefaultPaymentMethod: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/customers/payment-methods/${id}/default`);
    return data.data;
  },

  deletePaymentMethod: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/customers/payment-methods/${id}`);
    return data.data;
  },

  // Security
  updateSecurity: async (settings: { isTwoFactorEnabled?: boolean, dataSharingConsent?: boolean }): Promise<any> => {
    const { data } = await api.patch('/customers/security', settings);
    return data.data;
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.post('/customers/account/delete', { password });
  },

  // Data Management
  exportData: async (): Promise<{ message: string }> => {
    const { data } = await api.post('/customers/data/export');
    return data.data;
  },

  clearHistory: async (type: 'search' | 'view' | 'all'): Promise<{ message: string }> => {
    const { data } = await api.post('/customers/data/clear-history', { type });
    return data.data;
  },

  // Sessions
  getSessions: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/sessions');
    return data.data;
  },

  revokeSession: async (id: string): Promise<void> => {
    await api.delete(`/customers/sessions/${id}`);
  },

  revokeAllOtherSessions: async (): Promise<void> => {
    await api.delete('/customers/sessions');
  },

  updatePushToken: async (pushToken: string): Promise<any> => {
    const { data } = await api.post('/customers/push-token', { pushToken });
    return data.data;
  },

  updateNotificationPreferences: async (preferences: any): Promise<any> => {
    const { data } = await api.patch('/customers/notifications/preferences', preferences);
    return data.data;
  },

  getNotifications: async (): Promise<any[]> => {
    const { data } = await api.get('/customers/notifications');
    return data.data;
  },

  markNotificationRead: async (id: string): Promise<any> => {
    const { data } = await api.patch(`/customers/notifications/${id}/read`);
    return data.data;
  },

  markAllNotificationsRead: async (): Promise<any> => {
    const { data } = await api.post('/customers/notifications/read-all');
    return data.data;
  }
};
