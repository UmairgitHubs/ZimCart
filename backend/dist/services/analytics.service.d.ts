type StaffUser = {
    id: string;
    role: string;
};
export declare function getStaffOverview(user: StaffUser, queryStoreId?: string): Promise<{
    windowLabel: string;
    kpis: {
        totalOrders: number;
        grossRevenue: number;
        lowStockItems: number;
        ordersGrowthPct: number;
        revenueGrowthPct: number;
        averageOrderValue: number;
        aovGrowthPct: number;
        fulfillmentRatePct: number;
        fulfillmentGrowthPct: number;
    };
    salesLast6Months: {
        name: string;
        sales: number;
    }[];
    performanceLast30Days: {
        categorySales: {
            name: string;
            sales: number;
            orders: number;
        }[];
        orderStatus: {
            name: string;
            value: number;
            color: string;
        }[];
    };
}>;
export declare function getStaffInsights(user: StaffUser, opts: {
    range: string;
    queryStoreId?: string;
}): Promise<{
    range: "7d" | "30d" | "quarter" | "ytd";
    summary: {
        totalRevenue: number;
        revenueGrowth: number;
        totalOrders: number;
        ordersGrowth: number;
        averageOrderValue: number;
        aovGrowth: number;
        conversionRate: number;
        conversionGrowth: number;
    };
    revenueTimeline: {
        date: string;
        revenue: number;
        orders: number;
    }[];
    categoryPerformance: {
        name: string;
        sales: number;
        revenue: number;
        percentage: number;
    }[];
    topProducts: {
        id: string;
        name: string;
        sold: number;
        revenue: number;
        trend: "up" | "down" | "neutral";
        trendValue: number;
    }[];
    regionStats: {
        region: string;
        sales: number;
        revenue: number;
        percentage: number;
    }[];
}>;
export {};
//# sourceMappingURL=analytics.service.d.ts.map