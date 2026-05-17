import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/services/payment.service';
import type { TransactionStatus } from '@/types/transactions';

export function usePayments(params?: { status?: string; search?: string }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['payments', params?.status ?? 'All', params?.search ?? ''],
    queryFn: () =>
      paymentsApi.list({
        status: params?.status && params.status !== 'All' ? params.status : undefined,
        search: params?.search,
        limit: 200,
      }),
  });

  const reconcileMutation = useMutation({
    mutationFn: (paymentId: string) => paymentsApi.reconcile(paymentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      paymentId,
      status,
      adminNotes,
    }: {
      paymentId: string;
      status: TransactionStatus;
      adminNotes?: string;
    }) => paymentsApi.updateStatus(paymentId, status, adminNotes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (paymentId: string) => paymentsApi.remove(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    payments: query.data?.payments ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    reconcile: reconcileMutation.mutateAsync,
    updatePayment: updateMutation.mutateAsync,
    deletePayment: deleteMutation.mutateAsync,
    isReconciling: reconcileMutation.isPending,
  };
}
