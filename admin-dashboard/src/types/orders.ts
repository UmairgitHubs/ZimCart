export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface AssignedRider {
  id: string;
  name: string;
  phone: string | null;
  avatar: string;
  vehicleType: string;
  licensePlate: string | null;
}

export interface OrderItem {
  id: string;
  productId: string; // Added to match backend
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string; // Public Order Number
  dbId: string; // Internal DB UUID
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  subtotal?: number;
  platformFee?: number;
  discount?: number;
  deliveryFee?: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  trackingUrl?: string | null;
  proofOfDeliveryUrl?: string | null;
  notes?: string;
  assignedRider?: AssignedRider | null;
  assignedAt?: string | null;
}
