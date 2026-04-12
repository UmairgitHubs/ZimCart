export type ApiDiscountType = 'PERCENTAGE' | 'FIXED';

export interface VoucherDto {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: ApiDiscountType;
  value: number;
  minSpend: number | null;
  maxDiscount: number | null;
  expiryDate: string;
  isActive: boolean;
  storeId: string | null;
  store?: { id: string; name: string } | null;
  usageCount: number;
}

export interface CreateVoucherPayload {
  code: string;
  name: string;
  description?: string;
  discountType: ApiDiscountType;
  value: number;
  minSpend?: number | null;
  maxDiscount?: number | null;
  expiryDate: string;
  isActive?: boolean;
  storeId?: string | null;
}

export type UpdateVoucherPayload = Partial<CreateVoucherPayload>;
