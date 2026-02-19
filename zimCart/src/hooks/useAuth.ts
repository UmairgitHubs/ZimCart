import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/auth';
import { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/store/slices/auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // data now has { user, token, refreshToken } correctly mapped from authApi
            dispatch(setCredentials({ 
                user: data.user, 
                token: data.token, 
                refreshToken: data.refreshToken 
            }));
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
             dispatch(setCredentials({ 
                user: data.user, 
                token: data.token, 
                refreshToken: data.refreshToken 
            }));
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            dispatch(logout());
            queryClient.clear();
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
    });

    const resetPasswordMutation = useMutation({
        mutationFn: authApi.resetPassword,
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        logout: logoutMutation.mutate,
        forgotPassword: forgotPasswordMutation.mutateAsync,
        isForgotPasswordLoading: forgotPasswordMutation.isPending,
        resetPassword: resetPasswordMutation.mutateAsync,
        isResetPasswordLoading: resetPasswordMutation.isPending,
    };
};
