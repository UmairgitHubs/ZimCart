export declare const getProfile: (userId: string) => Promise<{
    addresses: {
        id: string;
        address: string;
        label: string;
        detail: string | null;
        instructions: string | null;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
        userId: string;
    }[];
    notifications: {
        id: string;
        userId: string;
        emailEnabled: boolean;
        smsEnabled: boolean;
        pushEnabled: boolean;
        soundEnabled: boolean;
        vibrationEnabled: boolean;
        orderUpdatesEnabled: boolean;
        deliveryUpdatesEnabled: boolean;
        promotionalEnabled: boolean;
        newArrivalsEnabled: boolean;
    } | null;
    _count: {
        orders: number;
        favourites: number;
        vouchers: number;
    };
    name: string;
    id: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    isPremium: boolean;
    country: string | null;
    status: import("@prisma/client").$Enums.UserStatus;
    isTwoFactorEnabled: boolean;
    termsConsent: boolean;
    privacyConsent: boolean;
    dataSharingConsent: boolean;
    refreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    twoFactorCode: string | null;
    twoFactorExpires: Date | null;
    pushToken: string | null;
}>;
export declare const updateProfile: (userId: string, data: any) => Promise<{
    name: string;
    id: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    isPremium: boolean;
    country: string | null;
    status: import("@prisma/client").$Enums.UserStatus;
    isTwoFactorEnabled: boolean;
    termsConsent: boolean;
    privacyConsent: boolean;
    dataSharingConsent: boolean;
    refreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    twoFactorCode: string | null;
    twoFactorExpires: Date | null;
    pushToken: string | null;
}>;
export declare const getOrders: (userId: string, status?: string) => Promise<({
    store: {
        name: string;
        image: string | null;
    };
    items: ({
        product: {
            name: string;
            images: string[];
        };
    } & {
        name: string;
        id: string;
        total: number;
        productId: string;
        price: number;
        quantity: number;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.OrderStatus;
    address: string;
    userId: string;
    orderNumber: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    storeId: string;
    paymentMethod: string;
    notes: string | null;
    trackingUrl: string | null;
})[]>;
export declare const placeOrder: (userId: string, data: any) => Promise<{
    store: {
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
        openingHours: import("@prisma/client/runtime/client").JsonValue | null;
        managerId: string | null;
    };
    items: ({
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
            variants: import("@prisma/client/runtime/client").JsonValue | null;
            sales: number;
            reviewsCount: number;
            categoryId: string;
        };
    } & {
        name: string;
        id: string;
        total: number;
        productId: string;
        price: number;
        quantity: number;
        orderId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.OrderStatus;
    address: string;
    userId: string;
    orderNumber: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    storeId: string;
    paymentMethod: string;
    notes: string | null;
    trackingUrl: string | null;
}>;
export declare const getVouchers: (userId: string, status?: string) => Promise<({
    voucher: {
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
    };
} & {
    id: string;
    userId: string;
    isUsed: boolean;
    usedAt: Date | null;
    voucherId: string;
})[]>;
export declare const validateVoucher: (userId: string, code: string) => Promise<{
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
export declare const getFavourites: (userId: string) => Promise<any[]>;
export declare const toggleFavourite: (userId: string, productId: string) => Promise<{
    isFavourited: boolean;
}>;
export declare const getAddresses: (userId: string) => Promise<{
    id: string;
    address: string;
    label: string;
    detail: string | null;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
    isDefault: boolean;
    userId: string;
}[]>;
export declare const addAddress: (userId: string, data: any) => Promise<{
    id: string;
    address: string;
    label: string;
    detail: string | null;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
    isDefault: boolean;
    userId: string;
}>;
export declare const updateAddress: (userId: string, addressId: string, data: any) => Promise<{
    id: string;
    address: string;
    label: string;
    detail: string | null;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
    isDefault: boolean;
    userId: string;
}>;
export declare const deleteAddress: (userId: string, addressId: string) => Promise<{
    id: string;
    address: string;
    label: string;
    detail: string | null;
    instructions: string | null;
    latitude: number | null;
    longitude: number | null;
    isDefault: boolean;
    userId: string;
}>;
export declare const updateSecuritySettings: (userId: string, data: {
    isTwoFactorEnabled?: boolean;
    dataSharingConsent?: boolean;
}) => Promise<{
    id: string;
    isTwoFactorEnabled: boolean;
    dataSharingConsent: boolean;
}>;
export declare const updateNotificationPreferences: (userId: string, data: any) => Promise<{
    id: string;
    userId: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    orderUpdatesEnabled: boolean;
    deliveryUpdatesEnabled: boolean;
    promotionalEnabled: boolean;
    newArrivalsEnabled: boolean;
}>;
export declare const getNotifications: (userId: string) => Promise<{
    data: import("@prisma/client/runtime/client").JsonValue | null;
    id: string;
    createdAt: Date;
    userId: string;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
}[]>;
export declare const markNotificationRead: (userId: string, notificationId: string) => Promise<{
    data: import("@prisma/client/runtime/client").JsonValue | null;
    id: string;
    createdAt: Date;
    userId: string;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
}>;
export declare const markAllNotificationsRead: (userId: string) => Promise<import("@prisma/client").Prisma.BatchPayload>;
export declare const exportUserData: (userId: string) => Promise<{
    message: string;
}>;
export declare const clearHistory: (userId: string, type: "search" | "view" | "all") => Promise<{
    message: string;
}>;
export declare const getSessions: (userId: string, currentIp?: string) => Promise<any[]>;
export declare const revokeSession: (userId: string, sessionId: string) => Promise<{
    id: string;
    createdAt: Date;
    pushToken: string | null;
    userId: string;
    deviceName: string;
    deviceType: string;
    os: string;
    ipAddress: string | null;
    lastActive: Date;
    isCurrent: boolean;
}>;
export declare const revokeAllOtherSessions: (userId: string, currentSessionId?: string) => Promise<import("@prisma/client").Prisma.BatchPayload>;
export declare const deleteAccount: (userId: string, passwordConfirmation: string) => Promise<any>;
export declare const getAllCustomersForAdmin: (query: any, user: any) => Promise<{
    customers: {
        id: string;
        name: string;
        email: string;
        joinDate: Date;
        status: any;
        totalSpent: number;
        totalOrders: number;
        lastLogin: Date | undefined;
        location: string | undefined;
        avatar: string;
        phone: string;
    }[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}>;
export declare const createCustomerForAdmin: (data: any) => Promise<{
    id: string;
    name: string;
    email: string;
    joinDate: Date;
    status: string;
    totalSpent: number;
    totalOrders: number;
    lastLogin: Date;
    location: string;
    avatar: string;
    phone: string;
}>;
export declare const updateCustomerForAdmin: (id: string, data: any) => Promise<{
    id: string;
    name: string;
    email: string;
    phone: string;
    status: any;
}>;
export declare const deleteCustomerForAdmin: (id: string, user: any) => Promise<{
    name: string;
    id: string;
    email: string;
    password: string;
    phone: string | null;
    avatar: string | null;
    role: import("@prisma/client").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    isPremium: boolean;
    country: string | null;
    status: import("@prisma/client").$Enums.UserStatus;
    isTwoFactorEnabled: boolean;
    termsConsent: boolean;
    privacyConsent: boolean;
    dataSharingConsent: boolean;
    refreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    twoFactorCode: string | null;
    twoFactorExpires: Date | null;
    pushToken: string | null;
}>;
export declare const getPaymentMethods: (userId: string) => Promise<{
    id: string;
    isDefault: boolean;
    userId: string;
    type: import("@prisma/client").$Enums.PaymentType;
    last4: string | null;
    expiry: string | null;
    brand: string | null;
    token: string | null;
}[]>;
export declare const addPaymentMethod: (userId: string, data: any) => Promise<{
    id: string;
    isDefault: boolean;
    userId: string;
    type: import("@prisma/client").$Enums.PaymentType;
    last4: string | null;
    expiry: string | null;
    brand: string | null;
    token: string | null;
}>;
export declare const setDefaultPaymentMethod: (userId: string, paymentMethodId: string) => Promise<{
    id: string;
    isDefault: boolean;
    userId: string;
    type: import("@prisma/client").$Enums.PaymentType;
    last4: string | null;
    expiry: string | null;
    brand: string | null;
    token: string | null;
}>;
export declare const deletePaymentMethod: (userId: string, paymentMethodId: string) => Promise<boolean>;
//# sourceMappingURL=customer.service.d.ts.map