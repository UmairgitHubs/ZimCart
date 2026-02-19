import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../services/customer';

/*
 * Use Customer Profile
 */
export const useProfile = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['profile'],
        queryFn: customerApi.getProfile,
    });

    const updateProfile = useMutation({
        mutationFn: customerApi.updateProfile,
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(['profile'], updatedProfile);
        },
    });

    return {
        ...query,
        update: updateProfile.mutate,
    };
};

/*
 * Use Customer Orders
 */
export const useOrders = (status?: 'active' | 'history') => {
    return useQuery({
        queryKey: ['orders', status],
        queryFn: () => customerApi.getOrders(status),
        staleTime: 5 * 60 * 1000, // 5 minutes fresh
    });
};

/*
 * Use User Vouchers
 */
export const useVouchers = () => {
    return useQuery({
        queryKey: ['vouchers'],
        queryFn: customerApi.getVouchers,
    });
};

/*
 * Use Favourites
 */
export const useFavourites = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['favourites'],
        queryFn: customerApi.getFavourites,
    });

    const toggleFavourite = useMutation({
        mutationFn: customerApi.toggleFavourite,
        onSuccess: (result, productId) => {
            queryClient.invalidateQueries({ queryKey: ['favourites'] });
            // Optimistic update could be implemented here
        },
    });

    return {
        ...query,
        toggle: toggleFavourite.mutate,
    };
};

/*
 * Use Addresses
 */
export const useAddresses = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['addresses'],
        queryFn: customerApi.getAddresses,
    });

    const addMutation = useMutation({
        mutationFn: customerApi.addAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (vars: { id: string; data: any }) => customerApi.updateAddress(vars.id, vars.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: customerApi.deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });

    return {
        ...query,
        add: addMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
        isMutating: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    };
};

/*
 * Use Security
 */
export const useSecurity = () => {
    const queryClient = useQueryClient();

    const updateSecurity = useMutation({
        mutationFn: customerApi.updateSecurity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });

    const deleteAccount = useMutation({
        mutationFn: customerApi.deleteAccount,
    });

    return {
        updateSecurity: updateSecurity.mutateAsync,
        deleteAccount: deleteAccount.mutateAsync,
        isUpdating: updateSecurity.isPending,
        isDeleting: deleteAccount.isPending,
    };
};
