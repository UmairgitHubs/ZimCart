import apiClient from '@/lib/api-client';
import type { CreateVoucherPayload, UpdateVoucherPayload, VoucherDto } from '@/types/vouchers';

function getMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (typeof r === 'string') return r;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export const voucherApi = {
  list: async (params?: { search?: string }): Promise<VoucherDto[]> => {
    try {
      const response = await apiClient.get('/vouchers', { params });
      return response.data.data.vouchers as VoucherDto[];
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  create: async (data: CreateVoucherPayload): Promise<VoucherDto> => {
    try {
      const response = await apiClient.post('/vouchers', data);
      return response.data.data.voucher as VoucherDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  update: async (id: string, data: UpdateVoucherPayload): Promise<VoucherDto> => {
    try {
      const response = await apiClient.patch(`/vouchers/${id}`, data);
      return response.data.data.voucher as VoucherDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/vouchers/${id}`);
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },
};
