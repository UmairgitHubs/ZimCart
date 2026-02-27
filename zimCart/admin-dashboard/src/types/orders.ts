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
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending';
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
}
