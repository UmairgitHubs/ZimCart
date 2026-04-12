import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { martSettingsApi } from '@/services/martSettings.service';

interface UseMartSettingsOptions {
  /** Required when acting as admin to choose which mart to edit */
  adminStoreId?: string | null;
  enabled?: boolean;
}

export function useMartSettings(options: UseMartSettingsOptions = {}) {
  const { adminStoreId, enabled = true } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['mart-settings', adminStoreId ?? 'me'],
    queryFn: () => martSettingsApi.get(adminStoreId ?? undefined),
    enabled,
  });

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => martSettingsApi.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mart-settings'] });
    },
  });

  return {
    store: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
}
