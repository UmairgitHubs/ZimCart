export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
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
  tax?: number;
  deliveryFee?: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  notes?: string;
}
