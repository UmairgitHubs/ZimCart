import { Prisma } from '@prisma/client';
export declare const getCart: (userId: string) => Promise<any>;
export declare const addToCart: (userId: string, productId: string, quantity: number, variants?: any) => Promise<{
    product: {
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
        variants: Prisma.JsonValue | null;
        sales: number;
        reviewsCount: number;
        categoryId: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    variants: Prisma.JsonValue | null;
    quantity: number;
    cartId: string;
}>;
export declare const updateCartItem: (userId: string, itemId: string, quantity: number) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    variants: Prisma.JsonValue | null;
    quantity: number;
    cartId: string;
}>;
export declare const removeFromCart: (userId: string, itemId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    variants: Prisma.JsonValue | null;
    quantity: number;
    cartId: string;
}>;
export declare const clearCart: (userId: string) => Promise<Prisma.BatchPayload>;
//# sourceMappingURL=cart.service.d.ts.map