export interface Order {
    id: string;
    orderNumber: string;
    date: string; // ISO 8601
    status: 'active' | 'completed' | 'cancelled' | 'pending' | 'shipping';
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
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
    id: string; // Product ID
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
