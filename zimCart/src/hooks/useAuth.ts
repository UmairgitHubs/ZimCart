import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { authApi } from '../services/auth';
import { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';
import { useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction } from '@/store/slices/auth.slice';
import { resetToAppForUser, resetToCustomerMain, resetToRiderWelcome } from '@/utils/navigation';
import type { User } from '@/types';

export const useAuth = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    const afterAuth = (user: User, token: string, refreshToken?: string) => {
        dispatch(setCredentials({ user, token, refreshToken }));
        resetToAppForUser(navigation, user);
    };

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data: any) => {
            if (!data.mfaRequired) {
                dispatch(setCredentials({
                    user: data.user,
                    token: data.token,
                    refreshToken: data.refreshToken,
                }));
            }
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
             afterAuth(data.user, data.token, data.refreshToken);
        },
    });

    const clearAuth = (destination: 'customer' | 'rider' = 'customer') => {
        dispatch(logoutAction());
        queryClient.clear();
        InteractionManager.runAfterInteractions(() => {
            if (destination === 'rider') {
                resetToRiderWelcome(navigation);
            } else {
                resetToCustomerMain(navigation);
            }
        });
    };

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
    });

    const logout = (destination: 'customer' | 'rider' = 'customer') => {
        clearAuth(destination);
        logoutMutation.mutate();
    };

    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
    });

    const verifyResetCodeMutation = useMutation({
        mutationFn: ({ email, code }: { email: string, code: string }) => authApi.verifyResetCode(email, code),
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
             afterAuth(data.user, data.token, data.refreshToken);
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
        logout,
        isLoggingOut: logoutMutation.isPending,
        forgotPassword: forgotPasswordMutation.mutateAsync,
        isForgotPasswordLoading: forgotPasswordMutation.isPending,
        verifyResetCode: verifyResetCodeMutation.mutateAsync,
        isVerifyResetCodeLoading: verifyResetCodeMutation.isPending,
        resetPassword: resetPasswordMutation.mutateAsync,
        isResetPasswordLoading: resetPasswordMutation.isPending,
        changePassword: changePasswordMutation.mutateAsync,
        isChangingPassword: changePasswordMutation.isPending,
        verify2FA: verify2FAMutation.mutateAsync,
        isVerifying2FA: verify2FAMutation.isPending,
        resend2FA: resend2FAMutation.mutateAsync,
        isResending2FA: resend2FAMutation.isPending,
        clearAuth,
        afterAuth,
    };
};
