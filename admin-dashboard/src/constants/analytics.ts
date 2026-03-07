import { 
  RevenueDataPoint, 
  CategoryPerformance, 
  TopProduct, 
  RegionStats, 
  AnalyticsSummary 
} from "@/types/analytics";

export const MOCK_REVENUE_TIMELINE: RevenueDataPoint[] = [
  { date: "Jan", revenue: 45000, orders: 1200 },
  { date: "Feb", revenue: 52000, orders: 1450 },
  { date: "Mar", revenue: 48000, orders: 1300 },
  { date: "Apr", revenue: 61000, orders: 1700 },
  { date: "May", revenue: 59000, orders: 1650 },
  { date: "Jun", revenue: 75000, orders: 2100 },
  { date: "Jul", revenue: 82000, orders: 2300 },
  { date: "Aug", revenue: 78000, orders: 2200 },
  { date: "Sep", revenue: 85000, orders: 2450 },
  { date: "Oct", revenue: 92000, orders: 2600 },
  { date: "Nov", revenue: 110000, orders: 3100 },
  { date: "Dec", revenue: 125000, orders: 3500 },
];

export const MOCK_CATEGORY_PERFORMANCE: CategoryPerformance[] = [
  { name: "Electronics", sales: 8400, revenue: 420000, percentage: 45 },
  { name: "Fashion", sales: 12500, revenue: 250000, percentage: 27 },
  { name: "Home & Garden", sales: 5200, revenue: 104000, percentage: 11 },
  { name: "Beauty", sales: 9100, revenue: 91000, percentage: 10 },
  { name: "Sports", sales: 3400, revenue: 68000, percentage: 7 },
];

export const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { id: "PROD-1001", name: "Wireless Noise Cancelling Headphones", sold: 1245, revenue: 373487, trend: "up", trendValue: 12.5 },
  { id: "PROD-1002", name: "Smart Watch Series 8", sold: 890, revenue: 355911, trend: "up", trendValue: 8.2 },
  { id: "PROD-2001", name: "Men's Classic Cotton T-Shirt", sold: 3400, revenue: 84966, trend: "down", trendValue: 2.1 },
  { id: "PROD-4001", name: "Premium Skincare Gift Set", sold: 560, revenue: 49840, trend: "neutral", trendValue: 0.5 },
  { id: "PROD-3001", name: "Ceramic Non-Stick Cookware Set", sold: 420, revenue: 62995, trend: "up", trendValue: 18.4 },
];

export const MOCK_REGION_STATS: RegionStats[] = [
  { region: "Harare Region", sales: 12450, revenue: 560250, percentage: 61 },
  { region: "Bulawayo Region", sales: 4200, revenue: 189000, percentage: 21 },
  { region: "Midlands Province", sales: 1800, revenue: 81000, percentage: 9 },
  { region: "Manicaland", sales: 1000, revenue: 45000, percentage: 5 },
  { region: "Other Areas", sales: 950, revenue: 36750, percentage: 4 },
];

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalRevenue: 912000,
  revenueGrowth: 14.5,
  totalOrders: 25400,
  ordersGrowth: 12.8,
  averageOrderValue: 35.90,
  aovGrowth: 2.1,
  conversionRate: 3.2,
  conversionGrowth: -0.4,
};
