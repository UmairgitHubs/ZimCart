import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { cartApi } from '../services/cart';

export const useCart = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const query = useQuery({
        queryKey: ['cart'],
        queryFn: cartApi.getCart,
        enabled: isAuthenticated,
    });

    const addMutation = useMutation({
        mutationFn: (vars: { productId: string; quantity: number; variants: any }) => 
            cartApi.addToCart(vars.productId, vars.quantity, vars.variants),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (vars: { id: string; quantity: number }) => 
            cartApi.updateCartItem(vars.id, vars.quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => cartApi.removeFromCart(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const clearMutation = useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return {
        ...query,
        add: addMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        clear: clearMutation.mutateAsync,
        isAdding: addMutation.isPending,
        isUpdating: updateMutation.isPending,
        isRemoving: removeMutation.isPending,
        isClearing: clearMutation.isPending,
    };
};
