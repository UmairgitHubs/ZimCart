import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation, StackActions } from '@react-navigation/native';
import { authApi } from '../services/auth';
import { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/store/slices/auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data: any) => {
            if (!data.mfaRequired) {
                dispatch(setCredentials({ 
                    user: data.user, 
                    token: data.token, 
                    refreshToken: data.refreshToken 
                }));
            }
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

    const clearAuth = () => {
        dispatch(logout());
        queryClient.clear();
        // Senior Implementation: Reset navigation to the absolute root to prevent "ghost" screens
        navigation.dispatch(StackActions.popToTop());
        navigation.dispatch(
            StackActions.replace('CustomerApp', {
                screen: 'Onboarding'
            })
        );
    };

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            clearAuth();
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
    });

    const resetPasswordMutation = useMutation({
        mutationFn: authApi.resetPassword,
    });

    const changePasswordMutation = useMutation({
        mutationFn: authApi.changePassword,
    });

    const verify2FAMutation = useMutation({
        mutationFn: ({ mfaToken, code }: { mfaToken: string, code: string }) => authApi.verify2FA(mfaToken, code),
        onSuccess: (data) => {
             dispatch(setCredentials({ 
                user: data.user, 
                token: data.token, 
                refreshToken: data.refreshToken 
            }));
        }
    });

    const resend2FAMutation = useMutation({
        mutationFn: authApi.resend2FA,
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
        changePassword: changePasswordMutation.mutateAsync,
        isChangingPassword: changePasswordMutation.isPending,
        verify2FA: verify2FAMutation.mutateAsync,
        isVerifying2FA: verify2FAMutation.isPending,
        resend2FA: resend2FAMutation.mutateAsync,
        isResending2FA: resend2FAMutation.isPending,
        clearAuth,
    };
};
