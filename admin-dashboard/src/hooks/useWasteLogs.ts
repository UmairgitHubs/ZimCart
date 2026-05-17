import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wasteApi } from '@/services/waste.service';
import type { WasteLogEntry, WasteReason } from '@/types/waste';

export function useWasteLogs(params?: { search?: string; reason?: string }) {
  const reason =
    params?.reason && params.reason !== 'All'
      ? (params.reason as WasteReason)
      : undefined;

  return useQuery({
    queryKey: ['waste-logs', params?.search, reason],
    queryFn: () => wasteApi.list({ search: params?.search, reason, limit: 100 }),
    staleTime: 30_000,
  });
}

export function useWasteMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['waste-logs'] });
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
  };

  const create = useMutation({
    mutationFn: wasteApi.create,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Parameters<typeof wasteApi.update>[1]) =>
      wasteApi.update(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: wasteApi.delete,
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export type { WasteLogEntry };
