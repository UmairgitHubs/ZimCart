import type { DiscountType } from '@prisma/client';
type StaffUser = {
    id: string;
    role: string;
};
export declare function assertCanAccessVoucher(voucherId: string, staff: StaffUser): Promise<{
    id: string;
    storeId: string | null;
}>;
export declare function packDescription(name: string, description?: string | null): string;
export declare function unpackVoucherDescription(raw: string | null, code: string): {
    name: string;
    description: string;
};
export declare function listVouchers(staff: StaffUser, search?: string): Promise<{
    campaignName: string;
    campaignDescription: string;
    usageCount: number;
    store: {
        name: string;
        id: string;
    } | null;
    id: string;
    storeId: string | null;
    code: string;
    description: string | null;
    isActive: boolean;
    discountType: import("@prisma/client").$Enums.DiscountType;
    value: number;
    minSpend: number | null;
    maxDiscount: number | null;
    expiryDate: Date;
}[]>;
type CreateInput = {
    code: string;
    name: string;
    description?: string | null;
    discountType: DiscountType;
    value: number;
    minSpend?: number | null;
    maxDiscount?: number | null;
    expiryDate: string;
    isActive?: boolean;
    storeId?: string | null;
};
export declare function createVoucher(staff: StaffUser, input: CreateInput): Promise<{
    store: {
        name: string;
        id: string;
    } | null;
} & {
    id: string;
    storeId: string | null;
    code: string;
    description: string | null;
    isActive: boolean;
    discountType: import("@prisma/client").$Enums.DiscountType;
    value: number;
    minSpend: number | null;
    maxDiscount: number | null;
    expiryDate: Date;
}>;
type UpdateInput = Partial<{
    code: string;
    name: string;
    description: string | null;
    discountType: DiscountType;
    value: number;
    minSpend: number | null;
    maxDiscount: number | null;
    expiryDate: string;
    isActive: boolean;
    storeId: string | null;
}>;
export declare function updateVoucher(voucherId: string, staff: StaffUser, input: UpdateInput): Promise<{
    store: {
        name: string;
        id: string;
    } | null;
} & {
    id: string;
    storeId: string | null;
    code: string;
    description: string | null;
    isActive: boolean;
    discountType: import("@prisma/client").$Enums.DiscountType;
    value: number;
    minSpend: number | null;
    maxDiscount: number | null;
    expiryDate: Date;
}>;
export declare function deleteVoucher(voucherId: string, staff: StaffUser): Promise<void>;
export declare function countVoucherRedemptions(voucherId: string): Promise<number>;
export {};
//# sourceMappingURL=voucher.service.d.ts.map