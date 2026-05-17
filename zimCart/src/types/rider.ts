export type RiderAvailability = 'AVAILABLE' | 'DISPATCHED' | 'OFFLINE';

export interface RiderProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string;
  vehicleType: string;
  licensePlate: string | null;
  homeBase: string | null;
  rating: number;
  completedDeliveries: number;
  availability: RiderAvailability;
  isOnline: boolean;
  stats: {
    activeJobs: number;
    completedJobs: number;
    todayEarnings: number;
  };
}

export interface RiderJobItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

export interface RiderJob {
  id: string;
  orderNumber: string;
  status: string;
  dbStatus: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  assignedAt: string | null;
  store: {
    id: string;
    name: string;
    image: string | null;
    deliveryTime: string | null;
  };
  customer: {
    id: string;
    name: string;
    phone: string | null;
  };
  deliveryAddress: string;
  deliveryCoords: { lat: number; lng: number } | null;
  items: RiderJobItem[];
  itemCount: number;
}

export type DeliveryAction =
  | 'arrived_at_store'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery';

export interface RiderEarnings {
  today: number;
  week: number;
  month: number;
  allTime: number;
  recent: {
    orderId: string;
    orderNumber: string;
    storeName: string;
    amount: number;
    completedAt: string;
  }[];
}

export interface RiderWallet {
  totalEarned: number;
  totalPaidOut: number;
  pending: number;
  available: number;
  payouts: RiderPayout[];
}

export interface RiderPayout {
  id: string;
  amount: number;
  method: string;
  accountRef: string;
  accountName: string | null;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export interface RiderNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}
