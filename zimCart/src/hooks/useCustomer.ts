import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { customerApi } from '../services/customer';

/*
 * Use Customer Profile
 */
export const useProfile = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['profile'],
        queryFn: customerApi.getProfile,
        enabled: isAuthenticated,
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
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return useQuery({
        queryKey: ['orders', status],
        queryFn: () => customerApi.getOrders(status),
        staleTime: 5 * 60 * 1000, // 5 minutes fresh
        enabled: isAuthenticated,
    });
};

/*
 * Use User Vouchers
 */
export const useVouchers = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return useQuery({
        queryKey: ['vouchers'],
        queryFn: customerApi.getVouchers,
        enabled: isAuthenticated,
    });
};

/*
 * Use Favourites
 */
export const useFavourites = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['favourites'],
        queryFn: customerApi.getFavourites,
        enabled: isAuthenticated,
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
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['addresses'],
        queryFn: customerApi.getAddresses,
        enabled: isAuthenticated,
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

/*
 * Use Data Management
 */
export const useDataManagement = () => {
    const exportData = useMutation({
        mutationFn: customerApi.exportData,
    });

    const clearHistory = useMutation({
        mutationFn: customerApi.clearHistory,
    });

    return {
        exportData: exportData.mutateAsync,
        isExporting: exportData.isPending,
        clearHistory: clearHistory.mutateAsync,
        isClearing: clearHistory.isPending,
    };
};

/*
 * Use Devices
 */
export const useDevices = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['sessions'],
        queryFn: customerApi.getSessions,
        enabled: isAuthenticated,
    });

    const revokeMutation = useMutation({
        mutationFn: customerApi.revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    const revokeOthersMutation = useMutation({
        mutationFn: customerApi.revokeAllOtherSessions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    return {
        ...query,
        revoke: revokeMutation.mutateAsync,
        revokeOthers: revokeOthersMutation.mutateAsync,
        isRevoking: revokeMutation.isPending,
        isRevokingOthers: revokeOthersMutation.isPending,
    };
};

/*
 * Use Notification Settings
 */
export const useNotificationSettings = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['profile'], // Notifications are included in profile
        queryFn: customerApi.getProfile,
        enabled: isAuthenticated,
        select: (data) => data.notifications,
    });

    const updateNotifications = useMutation({
        mutationFn: customerApi.updateNotificationPreferences,
        onSuccess: (updatedPrefs) => {
            // Update the profile query data with new notifications
            queryClient.setQueryData(['profile'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    notifications: updatedPrefs
                };
            });
        },
    });

    return {
        ...query,
        update: updateNotifications.mutateAsync,
        isUpdating: updateNotifications.isPending,
    };
};

/*
 * Use Notifications (Inbox)
 */
export const useNotificationsInbox = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['notifications'],
        queryFn: customerApi.getNotifications,
        enabled: isAuthenticated,
        refetchInterval: 60000, // Refresh every minute
    });

    const markRead = useMutation({
        mutationFn: customerApi.markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllRead = useMutation({
        mutationFn: customerApi.markAllNotificationsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return {
        ...query,
        markRead: markRead.mutateAsync,
        markAllRead: markAllRead.mutateAsync,
        isReading: markRead.isPending || markAllRead.isPending,
    };
};
