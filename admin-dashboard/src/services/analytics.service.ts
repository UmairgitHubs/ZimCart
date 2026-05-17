import apiClient from '@/lib/api-client';
import type {
  AnalyticsInsightsDto,
  DashboardOverviewDto,
} from '@/types/analytics-api';

function getMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (typeof r === 'string') return r;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export const analyticsApi = {
  getOverview: async (storeId?: string): Promise<DashboardOverviewDto> => {
    try {
      const res = await apiClient.get('/analytics/overview', {
        params: storeId ? { storeId } : undefined,
      });
      return res.data.data as DashboardOverviewDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },

  getRecentActivity: async (storeId?: string) => {
    const res = await apiClient.get('/analytics/activity', {
      params: storeId ? { storeId } : undefined,
    });
    return res.data.data.activities as {
      title: string;
      subtitle: string;
      time: string;
      color: string;
    }[];
  },

  getInsights: async (range: string, storeId?: string): Promise<AnalyticsInsightsDto> => {
    try {
      const res = await apiClient.get('/analytics/insights', {
        params: {
          range,
          ...(storeId ? { storeId } : {}),
        },
      });
      return res.data.data as AnalyticsInsightsDto;
    } catch (e) {
      throw new Error(getMessage(e));
    }
  },
};
