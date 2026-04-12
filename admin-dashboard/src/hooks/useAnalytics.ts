import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/analytics.service';

export function useAnalyticsOverview(storeId?: string | null) {
  return useQuery({
    queryKey: ['analytics-overview', storeId ?? 'all'],
    queryFn: () => analyticsApi.getOverview(storeId || undefined),
  });
}

export function useAnalyticsInsights(range: string, storeId?: string | null) {
  return useQuery({
    queryKey: ['analytics-insights', range, storeId ?? 'all'],
    queryFn: () => analyticsApi.getInsights(range, storeId || undefined),
    placeholderData: keepPreviousData,
  });
}
