export interface Order {
    id: string;
    orderNumber: string;
    date: string; // ISO 8601
    status: 'active' | 'completed' | 'cancelled' | 'pending' | 'shipping';
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    platformFee?: number;
    discount: number;
    total: number;
    store: {
        id: string;
        name: string;
        image: string;
    };
    trackingUrl?: string; // If 'shipping'
    paymentMethod: string; // e.g. "Visa ending in 4242"
    deliveryAddress: string;
}

export interface OrderItem {
    id: string;
    /** Present when mapped from API; used for reorder add-to-cart */
    productId?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    options?: Record<string, string>; // e.g. { size: "L", color: "red" }
}

export interface OrderSummary {
    totalOrders: number;
    totalActive: number;
    totalCompleted: number;
    totalCancelled: number;
    totalSpent: number;
}

export type OrderTrackingTimelineStep = {
    step: string;
    label: string;
    completed: boolean;
    current: boolean;
};

export type OrderTracking = {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    discount: number;
    total: number;
    address: string;
    paymentMethod: string;
    trackingUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    store: { id: string; name: string; image?: string | null };
    timeline: OrderTrackingTimelineStep[];
    rider: {
        id: string;
        name: string;
        phone: string | null;
        avatar: string | null;
        vehicleType: string;
        licensePlate: string | null;
    } | null;
    riderLocation: {
        latitude: number;
        longitude: number;
        updatedAt: string | null;
    } | null;
};
