export type PromotionStatus = 'Active' | 'Scheduled' | 'Expired';

export type DiscountType = 'Percentage' | 'Fixed Amount';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  /** Not persisted; empty when backed by API vouchers (expiry only). */
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit?: number;
  status: PromotionStatus;
  targetCategory?: string;
  /** Present when mapped from API; drives edit payloads. */
  isActive?: boolean;
  discountType?: 'PERCENTAGE' | 'FIXED';
  maxDiscount?: number;
}

export interface PromotionFilters {
  searchTerm: string;
  status: 'All' | PromotionStatus;
  type: 'All' | DiscountType;
}
