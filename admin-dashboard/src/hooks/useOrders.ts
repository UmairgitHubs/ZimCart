import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../services/order.service';

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });

  const statsQuery = useQuery({
    queryKey: ['order-stats'],
    queryFn: ordersApi.getStats,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: any) => ordersApi.createManualOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => ordersApi.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    }
  });

  return {
    orders: ordersQuery.data || [],
    stats: statsQuery.data || { totalVolume: 0, pendingOrders: 0, grossRevenue: 0, canceledRate: '0.0%' },
    isLoading: ordersQuery.isLoading || statsQuery.isLoading,
    error: ordersQuery.error || statsQuery.error,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
    deleteOrder: deleteOrderMutation.mutateAsync,
    isDeleting: deleteOrderMutation.isPending,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    updateOrder: updateOrderMutation.mutateAsync,
    isUpdatingOrder: updateOrderMutation.isPending,
    refetch: ordersQuery.refetch,
  };
};
