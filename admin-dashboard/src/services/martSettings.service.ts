import apiClient from '@/lib/api-client';
import type { MartStoreSettingsDto } from '@/types/martSettings';

function getMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (typeof r === 'string') return r;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export const martSettingsApi = {
  get: async (storeId?: string): Promise<MartStoreSettingsDto> => {
    try {
      const response = await apiClient.get('/marts/admin/settings', {
        params: storeId ? { storeId } : undefined,
      });
      return response.data.data.store as MartStoreSettingsDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  update: async (body: Record<string, unknown>): Promise<MartStoreSettingsDto> => {
    try {
      const response = await apiClient.patch('/marts/admin/settings', body);
      return response.data.data.store as MartStoreSettingsDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },
};
