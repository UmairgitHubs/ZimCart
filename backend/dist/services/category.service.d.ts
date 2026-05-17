export declare const getCategories: (params: {
    search?: string;
    status?: string;
    storeId?: string;
    user: any;
}) => Promise<{
    items: {
        id: string;
        name: string;
        slug: string;
        description: string;
        image: string | null;
        productCount: number;
        status: any;
        parentCategoryId: string | undefined;
        parentCategory: string | undefined;
        lastUpdated: string;
        displayOrder: number;
        isFeatured: boolean;
    }[];
    stats: {
        total: number;
        published: number;
        draft: number;
        hidden: number;
    };
}>;
export declare const createCategory: (data: any, user: any) => Promise<{
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
}>;
export declare const updateCategory: (id: string, data: any, user: any) => Promise<{
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
}>;
export declare const deleteCategory: (id: string, user: any) => Promise<boolean>;
//# sourceMappingURL=category.service.d.ts.map