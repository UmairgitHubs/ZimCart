import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  supportTicketApi,
  type CreateAdminTicketPayload,
  type ListSupportTicketsParams,
} from '@/services/supportTicket.service';

export const useSupportTickets = (params: ListSupportTicketsParams = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['support-tickets', params.search ?? '', params.status ?? ''],
    queryFn: () => supportTicketApi.list(params),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'; staffReply?: string };
    }) => supportTicketApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminTicketPayload) => supportTicketApi.createForCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });

  return {
    tickets: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    updateTicket: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    createTicketForCustomer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
