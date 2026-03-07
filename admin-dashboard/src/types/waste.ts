export type WasteReason = 'Expired' | 'Damaged' | 'Leaked' | 'Spoilage' | 'Lost';

export interface WasteLogEntry {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalLoss: number;
  reason: WasteReason;
  loggedBy: string;
  timestamp: string;
  notes?: string;
  imageUrl?: string;
}
