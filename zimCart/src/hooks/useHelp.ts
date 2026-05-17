import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { helpApi } from '../services/help';

export const useFAQs = (category?: string) => {
    return useQuery({
        queryKey: ['faqs', category],
        queryFn: () => helpApi.getFAQs(category),
    });
};

export const useMyTickets = () => {
    return useQuery({
        queryKey: ['my-tickets'],
        queryFn: () => helpApi.listTickets(),
    });
};

export const useSupportTicket = () => {
    const queryClient = useQueryClient();

    const createTicket = useMutation({
        mutationFn: (data: { subject: string; message: string }) =>
            helpApi.createTicket(data.subject, data.message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
        },
    });

    return {
        createTicket: createTicket.mutateAsync,
        isCreating: createTicket.isPending,
    };
};
