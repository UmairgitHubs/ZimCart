export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';
export type PaymentMethod = string;

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  currency: 'USD' | 'ZiG';
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  timestamp: string;
  reference: string;
}

export interface TransactionFilters {
  searchTerm: string;
  status: 'All' | TransactionStatus;
  paymentMethod: 'All' | PaymentMethod;
}
