import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../services/customer.service';
import { Customer } from '@/types/customers';

interface UseCustomersProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useCustomers = (params: UseCustomersProps = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerApi.getAll(params),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => customerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Customer> }) => 
      customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    customers: query.data?.customers || [],
    pagination: query.data?.pagination || { total: 0, page: 1, pages: 1 },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    createCustomer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCustomer: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCustomer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  };
};
