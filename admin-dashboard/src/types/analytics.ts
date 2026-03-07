export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategoryPerformance {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
}

export interface RegionStats {
  region: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
}
