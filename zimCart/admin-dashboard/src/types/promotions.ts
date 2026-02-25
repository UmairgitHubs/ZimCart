export type PromotionStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled';
export type DiscountType = 'Percentage' | 'Fixed Amount' | 'Free Shipping';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  minPurchase?: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit?: number;
  status: PromotionStatus;
  targetCategory?: string;
}

export interface PromotionFilters {
  searchTerm: string;
  status: 'All' | PromotionStatus;
  type: 'All' | DiscountType;
}
