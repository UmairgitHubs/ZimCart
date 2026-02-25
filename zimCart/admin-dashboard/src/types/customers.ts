export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  joinDate: string;
  location: string;
}

export interface CustomerFilters {
  searchTerm: string;
  status: 'All' | CustomerStatus;
}
