export interface Voucher {
    id: string;
    code: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    value: number;
    minSpend?: number;
    maxDiscount?: number;
    expiryDate: string; // ISO 8601
    status: 'active' | 'used' | 'expired';
    title?: string;
    applicableCategories?: string[]; // e.g. ["Electronics", "Food"]
}

export interface LoyaltyPoints {
    currentPoints: number;
    totalEarned: number;
    history: {
        date: string;
        points: number;
        reason: string; // e.g. "Order #1234"
    }[];
}
