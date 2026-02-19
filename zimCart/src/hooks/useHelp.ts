import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { helpApi } from '../services/help';

export const useFAQs = (category?: string) => {
    return useQuery({
        queryKey: ['faqs', category],
        queryFn: () => helpApi.getFAQs(category),
    });
};

export const useSupportTicket = () => {
    const createTicket = useMutation({
        mutationFn: (data: { subject: string, message: string }) => helpApi.createTicket(data.subject, data.message),
    });

    return {
        createTicket: createTicket.mutateAsync,
        isCreating: createTicket.isPending,
    };
};
