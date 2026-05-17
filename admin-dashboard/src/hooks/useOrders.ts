import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type OrdersListParams } from '../services/order.service';

export const useOrders = (params?: OrdersListParams) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getAll(params),
  });

  const statsQuery = useQuery({
    queryKey: ['order-stats'],
    queryFn: ordersApi.getStats,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
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
    mutationFn: (data: unknown) => ordersApi.createManualOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => ordersApi.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });

  const assignRiderMutation = useMutation({
    mutationFn: ({ id, riderId }: { id: string; riderId: string }) =>
      ordersApi.assignRider(id, riderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['riders'] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-candidates'] });
    },
  });

  const unassignRiderMutation = useMutation({
    mutationFn: (id: string) => ordersApi.unassignRider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });

  const autoDispatchMutation = useMutation({
    mutationFn: (id: string) => ordersApi.autoDispatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });

  return {
    orders: ordersQuery.data?.orders ?? [],
    pagination: ordersQuery.data?.pagination,
    stats: statsQuery.data ?? {
      totalVolume: 0,
      pendingOrders: 0,
      grossRevenue: 0,
      canceledRate: '0.0%',
    },
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
    assignRider: assignRiderMutation.mutateAsync,
    unassignRider: unassignRiderMutation.mutateAsync,
    isAssigningRider:
      assignRiderMutation.isPending ||
      unassignRiderMutation.isPending ||
      autoDispatchMutation.isPending,
    autoDispatch: autoDispatchMutation.mutateAsync,
    refetch: ordersQuery.refetch,
  };
};
