import { Order } from "@/types/orders";

export const STATUS_TABS = ["All Orders", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export const TIME_RANGES = ["All Time", "Today", "This Week", "This Month"];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-8822",
    customer: {
      id: "C-1",
      name: "Ahmed Khan",
      email: "ahmed.k@example.com",
      avatar: "https://ui-avatars.com/api/?name=Ahmed+Khan&background=10B981&color=fff"
    },
    items: [{ id: "I-1", name: "Wireless Headphones", quantity: 2, price: 60 }],
    totalAmount: 120.00,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    createdAt: "2026-02-24T10:30:00Z",
    updatedAt: "2026-02-24T10:30:00Z",
    shippingAddress: "Street 5, F-10, Islamabad"
  },
  {
    id: "ORD-8821",
    customer: {
      id: "C-2",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=3B82F6&color=fff"
    },
    items: [{ id: "I-2", name: "Premium Coffee Beans", quantity: 1, price: 45 }],
    totalAmount: 45.00,
    status: "Confirmed",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    createdAt: "2026-02-24T09:15:00Z",
    updatedAt: "2026-02-24T09:15:00Z",
    shippingAddress: "DHA Phase 6, Karachi"
  },
  {
    id: "ORD-8820",
    customer: {
      id: "C-3",
      name: "Umar Ali",
      email: "umar.ali@example.com",
      avatar: "https://ui-avatars.com/api/?name=Umar+Ali&background=F59E0B&color=fff"
    },
    items: [
      { id: "I-3", name: "Smart Watch", quantity: 1, price: 150.20 },
      { id: "I-4", name: "Leather Strap", quantity: 4, price: 50 }
    ],
    totalAmount: 350.20,
    status: "Shipped",
    paymentMethod: "ZimWallet",
    paymentStatus: "Paid",
    createdAt: "2026-02-23T16:45:00Z",
    updatedAt: "2026-02-24T11:45:00Z",
    shippingAddress: "Gulberg III, Lahore"
  },
  {
    id: "ORD-8819",
    customer: {
      id: "C-4",
      name: "Maria Garcia",
      email: "maria.g@example.com",
      avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=8B5CF6&color=fff"
    },
    items: [{ id: "I-5", name: "Yoga Mat", quantity: 2, price: 44.99 }],
    totalAmount: 89.99,
    status: "Delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    createdAt: "2026-02-23T14:20:00Z",
    updatedAt: "2026-02-24T18:20:00Z",
    shippingAddress: "Bahria Town, Rawalpindi"
  },
  {
    id: "ORD-8818",
    customer: {
      id: "C-5",
      name: "John Smith",
      email: "john.s@example.com",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=EF4444&color=fff"
    },
    items: [{ id: "I-6", name: "Mechanical Keyboard", quantity: 1, price: 210 }],
    totalAmount: 210.00,
    status: "Cancelled",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    createdAt: "2026-02-23T11:05:00Z",
    updatedAt: "2026-02-23T15:05:00Z",
    shippingAddress: "Blue Area, Islamabad"
  }
];
