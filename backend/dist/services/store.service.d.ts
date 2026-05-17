import type { Prisma, StoreStatus } from '@prisma/client';
type StaffUser = {
    id: string;
    role: string;
};
export declare function resolveManagedStoreId(userId: string): Promise<string | null>;
export declare function getStoreSettingsForStaff(staff: StaffUser, queryStoreId?: string): Promise<{
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.StoreStatus;
    deliveryFee: number;
    image: string | null;
    description: string | null;
    rating: number;
    deliveryTime: string | null;
    minOrder: number;
    isActive: boolean;
    openingHours: Prisma.JsonValue;
    managerId: string | null;
}>;
export declare function updateStoreSettingsForStaff(staff: StaffUser, input: {
    storeId?: string;
    name?: string;
    description?: string | null;
    image?: string | null;
    deliveryTime?: string | null;
    minOrder?: number;
    deliveryFee?: number;
    isActive?: boolean;
    status?: StoreStatus;
    openingHours?: Prisma.InputJsonValue;
}): Promise<{
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.StoreStatus;
    deliveryFee: number;
    image: string | null;
    description: string | null;
    rating: number;
    deliveryTime: string | null;
    minOrder: number;
    isActive: boolean;
    openingHours: Prisma.JsonValue;
    managerId: string | null;
}>;
export declare const getAllMarts: () => Promise<{
    tags: string[];
    deliveryFee: string;
    minOrder: string;
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.StoreStatus;
    image: string | null;
    description: string | null;
    rating: number;
    deliveryTime: string | null;
    categories: {
        name: string;
    }[];
}[]>;
/** Full mart list for admin tooling (e.g. settings picker), including inactive or HIDDEN. */
export declare function getMartsDirectoryForAdmin(): Promise<{
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.StoreStatus;
    isActive: boolean;
}[]>;
export declare const getMartById: (id: string, search?: string, category?: string) => Promise<({
    categories: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        status: string;
        storeId: string;
        image: string | null;
        description: string | null;
        slug: string | null;
        isFeatured: boolean;
        displayOrder: number;
        parentCategoryId: string | null;
    }[];
    products: ({
        category: {
            name: string;
        };
    } & {
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
    })[];
} & {
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.StoreStatus;
    deliveryFee: number;
    image: string | null;
    description: string | null;
    rating: number;
    deliveryTime: string | null;
    minOrder: number;
    isActive: boolean;
    openingHours: Prisma.JsonValue | null;
    managerId: string | null;
}) | null>;
export {};
//# sourceMappingURL=store.service.d.ts.map