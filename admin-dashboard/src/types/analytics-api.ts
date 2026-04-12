import type {
  AnalyticsSummary,
  CategoryPerformance,
  RegionStats,
  RevenueDataPoint,
  TopProduct,
} from '@/types/analytics';

export interface DashboardOverviewDto {
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
  salesLast6Months: { name: string; sales: number }[];
  performanceLast30Days: {
    categorySales: { name: string; sales: number; orders: number }[];
    orderStatus: { name: string; value: number; color: string }[];
  };
}

export interface AnalyticsInsightsDto {
  range: string;
  summary: AnalyticsSummary;
  revenueTimeline: RevenueDataPoint[];
  categoryPerformance: CategoryPerformance[];
  topProducts: TopProduct[];
  regionStats: RegionStats[];
}
