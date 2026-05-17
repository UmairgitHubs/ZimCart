export declare const getInventory: (params: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    warehouse?: string;
    user: any;
}) => Promise<{
    items: {
        id: string;
        productId: string;
        productName: string;
        sku: string;
        category: string;
        currentStock: number;
        reservedStock: number;
        availableStock: number;
        restockThreshold: number;
        status: string;
        warehouseLocation: string;
        lastRestocked: string;
        unitPrice: number;
        totalValue: number;
        image: string | undefined;
    }[];
    stats: {
        totalValue: number;
        lowStockCount: number;
        outOfStockCount: number;
        reservedStockCount: number;
    };
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}>;
export declare const updateStock: (id: string, currentStock: number, user: any, reason?: string) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    storeId: string;
    brand: string | null;
    description: string | null;
    rating: number;
    images: string[];
    price: number;
    discountPrice: number | null;
    costPrice: number | null;
    taxPercentage: number;
    sku: string;
    barcode: string | null;
    inventory: number;
    subCategory: string | null;
    isDeal: boolean;
    discountPercentage: number;
    weight: string | null;
    baseUnit: string | null;
    variants: import("@prisma/client/runtime/client").JsonValue | null;
    sales: number;
    reviewsCount: number;
    categoryId: string;
}>;
export declare const getInventoryHistory: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    productId: string;
    metadata: import("@prisma/client/runtime/client").JsonValue | null;
    description: string | null;
    event: string;
}[]>;
export declare const deleteInventory: (id: string, user: any) => Promise<boolean>;
//# sourceMappingURL=inventory.service.d.ts.map