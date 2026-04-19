import type { VoucherDto } from '@/types/vouchers';
import type { DiscountType, Promotion, PromotionStatus } from '@/types/promotions';

export function voucherDtoToPromotion(v: VoucherDto): Promotion {
  const now = Date.now();
  const exp = new Date(v.expiryDate).getTime();
  let status: PromotionStatus;
  if (exp < now) status = 'Expired';
  else if (!v.isActive) status = 'Scheduled';
  else status = 'Active';

  const type: DiscountType =
    v.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount';

  return {
    id: v.id,
    code: v.code,
    name: v.name,
    description: v.description || '',
    type,
    value: v.value,
    minPurchase: v.minSpend ?? undefined,
    startDate: '',
    endDate: v.expiryDate,
    usageCount: v.usageCount,
    usageLimit: undefined,
    status,
    targetCategory: v.store?.name,
    isActive: v.isActive,
    discountType: v.discountType,
    maxDiscount: v.maxDiscount ?? undefined,
  };
}

export function promotionToCreatePayload(p: {
  name: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  endDate: string;
  deploymentActive: boolean;
}): import('@/types/vouchers').CreateVoucherPayload {
  const end = new Date(`${p.endDate}T23:59:59`);
  return {
    code: p.code.trim().toUpperCase(),
    name: p.name.trim(),
    description: p.description.trim() || undefined,
    discountType: p.type === 'Percentage' ? 'PERCENTAGE' : 'FIXED',
    value: p.value,
    minSpend: p.minPurchase > 0 ? p.minPurchase : null,
    maxDiscount: p.maxDiscount && p.maxDiscount > 0 ? p.maxDiscount : null,
    expiryDate: end.toISOString(),
    isActive: p.deploymentActive,
  };
}

export function promotionToUpdatePayload(p: {
  name: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  endDate: string;
  deploymentActive: boolean;
}): import('@/types/vouchers').UpdateVoucherPayload {
  const end = new Date(`${p.endDate}T23:59:59`);
  return {
    code: p.code.trim().toUpperCase(),
    name: p.name.trim(),
    description: p.description.trim() || undefined,
    discountType: p.type === 'Percentage' ? 'PERCENTAGE' : 'FIXED',
    value: p.value,
    minSpend: p.minPurchase > 0 ? p.minPurchase : null,
    maxDiscount: p.maxDiscount && p.maxDiscount > 0 ? p.maxDiscount : null,
    expiryDate: end.toISOString(),
    isActive: p.deploymentActive,
  };
}
