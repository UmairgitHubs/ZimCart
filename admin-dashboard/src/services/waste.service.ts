import apiClient from '@/lib/api-client';
import type { WasteLogEntry, WasteReason } from '@/types/waste';

function getMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (typeof r === 'string') return r;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

const REASON_TO_API: Record<WasteReason, string> = {
  Expired: 'EXPIRED',
  Damaged: 'DAMAGED',
  Leaked: 'LEAKED',
  Spoilage: 'SPOILAGE',
  Lost: 'LOST',
};

const REASON_FROM_API: Record<string, WasteReason> = {
  EXPIRED: 'Expired',
  DAMAGED: 'Damaged',
  LEAKED: 'Leaked',
  SPOILAGE: 'Spoilage',
  LOST: 'Lost',
};

type ApiLog = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalLoss: number;
  reason: string;
  loggedBy: string;
  timestamp: string;
  notes?: string;
  imageUrl?: string;
};

function mapLog(row: ApiLog): WasteLogEntry {
  return {
    id: row.id,
    productId: row.productId,
    productName: row.productName,
    sku: row.sku,
    category: row.category,
    quantity: row.quantity,
    unitCost: row.unitCost,
    totalLoss: row.totalLoss,
    reason: REASON_FROM_API[row.reason] ?? 'Damaged',
    loggedBy: row.loggedBy,
    timestamp: row.timestamp,
    notes: row.notes,
    imageUrl: row.imageUrl,
  };
}

export const wasteApi = {
  list: async (params?: {
    search?: string;
    reason?: WasteReason;
    page?: number;
    limit?: number;
  }): Promise<WasteLogEntry[]> => {
    try {
      const res = await apiClient.get('/waste', {
        params: {
          ...params,
          reason: params?.reason ? REASON_TO_API[params.reason] : undefined,
        },
      });
      const logs = (res.data.data.logs ?? []) as ApiLog[];
      return logs.map(mapLog);
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  create: async (payload: {
    productId: string;
    quantity: number;
    reason: WasteReason;
    notes?: string;
    unitCost?: number;
    imageUrl?: string;
  }): Promise<WasteLogEntry> => {
    const res = await apiClient.post('/waste', {
      productId: payload.productId,
      quantity: payload.quantity,
      reason: REASON_TO_API[payload.reason],
      notes: payload.notes,
      unitCost: payload.unitCost,
      imageUrl: payload.imageUrl,
    });
    return mapLog(res.data.data.log as ApiLog);
  },

  update: async (
    id: string,
    payload: Partial<{
      quantity: number;
      reason: WasteReason;
      notes: string;
      unitCost: number;
    }>
  ): Promise<WasteLogEntry> => {
    const res = await apiClient.patch(`/waste/${id}`, {
      ...payload,
      ...(payload.reason ? { reason: REASON_TO_API[payload.reason] } : {}),
    });
    return mapLog(res.data.data.log as ApiLog);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/waste/${id}`);
  },
};
