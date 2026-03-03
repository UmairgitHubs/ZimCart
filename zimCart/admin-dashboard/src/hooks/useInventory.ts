import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory.service';

export const useInventory = (params?: { 
  page?: number; 
  limit?: number; 
  category?: string; 
  status?: string; 
  search?: string;
  warehouse?: string;
}) => {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => inventoryService.getInventory(params),
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentStock, reason }: { id: string; currentStock: number; reason?: string }) => 
      inventoryService.updateStock(id, { currentStock, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useInventoryHistory = (id: string) => {
  return useQuery({
    queryKey: ['inventory-history', id],
    queryFn: () => inventoryService.getInventoryHistory(id),
    enabled: !!id,
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
