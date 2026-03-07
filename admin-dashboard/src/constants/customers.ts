import { Customer } from "@/types/customers";

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "Tadiwa Mukucha",
    email: "tadiwa.m@gmail.com",
    phone: "+263 771 234 567",
    status: "Active",
    totalOrders: 12,
    totalSpent: 1240.50,
    lastOrderDate: "2026-02-24T10:30:00Z",
    joinDate: "2025-11-15T08:00:00Z",
    location: "Harare, ZW",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "CUST-002",
    name: "Nyasha Chidambaram",
    email: "nyasha.c@outlook.com",
    phone: "+263 712 987 654",
    status: "Active",
    totalOrders: 8,
    totalSpent: 856.20,
    lastOrderDate: "2026-02-20T15:45:00Z",
    joinDate: "2025-12-01T11:30:00Z",
    location: "Bulawayo, ZW",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "CUST-003",
    name: "Farai Matombo",
    email: "farai.m@yahoo.com",
    phone: "+263 733 456 789",
    status: "Active",
    totalOrders: 24,
    totalSpent: 3450.00,
    lastOrderDate: "2026-02-24T09:20:00Z",
    joinDate: "2025-10-20T14:45:00Z",
    location: "Gweru, ZW",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "CUST-004",
    name: "Rufaro Sibanda",
    email: "rufaro.s@gmail.com",
    phone: "+263 775 111 222",
    status: "Inactive",
    totalOrders: 2,
    totalSpent: 120.00,
    lastOrderDate: "2026-01-15T14:10:00Z",
    joinDate: "2026-01-05T09:00:00Z",
    location: "Mutare, ZW",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "CUST-005",
    name: "Tendai Shumba",
    email: "tendai.s@domain.zw",
    phone: "+263 782 555 666",
    status: "Blocked",
    totalOrders: 0,
    totalSpent: 0.00,
    lastOrderDate: "N/A",
    joinDate: "2026-02-10T11:05:00Z",
    location: "Harare, ZW",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
  }
];
