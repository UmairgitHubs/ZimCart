import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherApi } from '@/services/voucher.service';
import type { CreateVoucherPayload, UpdateVoucherPayload } from '@/types/vouchers';

export const useVouchers = (search?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['vouchers', search ?? ''],
    queryFn: () => voucherApi.list({ search }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateVoucherPayload) => voucherApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVoucherPayload }) =>
      voucherApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => voucherApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    },
  });

  return {
    vouchers: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    createVoucher: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateVoucher: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteVoucher: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
