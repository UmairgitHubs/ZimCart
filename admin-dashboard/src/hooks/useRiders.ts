import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riderAdminApi } from '@/services/riderAdmin.service';
export function useRiders(params: { page?: number; limit?: number; search?: string; status?: string }) {
  return useQuery({
    queryKey: ['riders', params],
    queryFn: () => riderAdminApi.list(params),
  });
}

export function useUpdateRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof riderAdminApi.update>[1] }) =>
      riderAdminApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['riders'] });
    },
  });
}

export function useDeleteRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => riderAdminApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['riders'] });
    },
  });
}
