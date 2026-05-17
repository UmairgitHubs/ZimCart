import apiClient from '@/lib/api-client';
import type { Transaction, TransactionStatus } from '@/types/transactions';

type PaymentApiRow = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  currency: 'USD' | 'ZiG';
  status: TransactionStatus;
  paymentMethod: string;
  timestamp: string;
  reference: string;
  paidAt?: string | null;
};

type ListResponse = {
  payments: PaymentApiRow[];
  pagination: { total: number; page: number; pages: number };
};

function mapPaymentRow(row: PaymentApiRow): Transaction {
  return {
    paymentId: row.id,
    id: `TRX-${row.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
    orderId: row.orderId,
    orderNumber: row.orderNumber,
    customerName: row.customerName,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    paymentMethod: row.paymentMethod,
    timestamp: row.timestamp,
    reference: row.reference,
  };
}

export const paymentsApi = {
  async list(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const { data } = await apiClient.get('/payments', { params });
    const payload = data.data as ListResponse;
    return {
      payments: payload.payments.map(mapPaymentRow),
      pagination: payload.pagination,
    };
  },

  async reconcile(paymentId: string, adminNotes?: string) {
    const { data } = await apiClient.post(`/payments/${paymentId}/reconcile`, { adminNotes });
    return data.data;
  },

  async updateStatus(paymentId: string, status: TransactionStatus, adminNotes?: string) {
    const { data } = await apiClient.patch(`/payments/${paymentId}`, { status, adminNotes });
    return data.data;
  },

  async remove(paymentId: string) {
    await apiClient.delete(`/payments/${paymentId}`);
  },
};
