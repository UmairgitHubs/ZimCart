import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { parseApiError } from '@/utils/errorUtils';

export default function ResetPasswordScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const params = route.params as { token?: string } | undefined;
    const token = params?.token;
    const { resetPassword, isResetPasswordLoading } = useAuth();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // RHF Setup
    const { control, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token || '',
            password: '',
            confirmPassword: '',
        }
    });

    // Senior Implementation: Ensure token is synchronized if it arrives late
    React.useEffect(() => {
        if (token) {
            reset({ token, password: '', confirmPassword: '' });
        }
    }, [token, reset]);

    const onSubmit = async (data: ResetPasswordData) => {
        setApiError(null);
        try {
            await resetPassword(data);
            setIsSuccess(true);
        } catch (error: any) {
            const message = parseApiError(error);
            setApiError(message);
        }
    };

    if (isSuccess) {
        return (
          <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <StatusBar style="dark" />
            <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-8">
              <MaterialCommunityIcons name="check-circle" size={60} color="#166534" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-3">Success!</Text>
            <Text className="text-gray-500 text-center text-lg mb-10 leading-6">
                Your password has been reset successfully. You can now login with your new credentials.
            </Text>
            <TouchableOpacity 
              className="bg-green-700 w-full py-4 rounded-2xl items-center shadow-lg shadow-green-200 active:bg-green-800"
              onPress={() => navigation.navigate('CustomerLogin' as never)}
            >
              <Text className="text-white font-bold text-lg">Back to Login</Text>
            </TouchableOpacity>
          </SafeAreaView>
        );
      }

    if (!token && !isSuccess) {
        return (
          <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <StatusBar style="dark" />
            <MaterialCommunityIcons name="alert-decagram" size={60} color="#EF4444" className="mb-6" />
            <Text className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</Text>
            <Text className="text-gray-500 text-center mb-8">
                We couldn't find your verification session. Please go back and request a new code.
            </Text>
            <TouchableOpacity 
              className="bg-gray-900 w-full py-4 rounded-xl items-center"
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text className="text-white font-bold">Try Again</Text>
            </TouchableOpacity>
          </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1 px-6 pt-10">
                
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6 w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>

                {/* Header */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">Set New Password</Text>
                    <Text className="text-gray-500 text-lg">Your code is verified! Please enter your new secure password below.</Text>
                </View>

                {/* API Error Display */}
                {apiError && (
                    <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 flex-row items-center">
                        <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#EF4444" />
                        <Text className="text-red-600 ml-2 flex-1 text-sm font-medium">{apiError}</Text>
                    </View>
                )}

                {/* Form */}
                <View className="space-y-6">
                    {/* Hidden Token Input (controlled by RHF but not visible) */}
                    <View className="hidden">
                        <Controller
                            control={control}
                            name="token"
                            render={({ field: { value } }) => (
                                <TextInput value={value} />
                            )}
                        />
                    </View>

                    {/* New Password Input */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">New Password</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                                    <MaterialCommunityIcons name="lock-outline" size={20} color={errors.password ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 font-medium text-base h-full"
                                        placeholder="••••••••"
                                        placeholderTextColor="#9CA3AF"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <MaterialCommunityIcons 
                                            name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                            size={20} 
                                            color="#9CA3AF" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.password && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</Text>}
                    </View>

                    {/* Confirm Password Input */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Confirm New Password</Text>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                                    <MaterialCommunityIcons name="lock-check-outline" size={20} color={errors.confirmPassword ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 font-medium text-base h-full"
                                        placeholder="••••••••"
                                        placeholderTextColor="#9CA3AF"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <MaterialCommunityIcons 
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                            size={20} 
                                            color="#9CA3AF" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.confirmPassword && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</Text>}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        className={`bg-green-700 rounded-2xl py-4 mt-6 shadow-lg shadow-green-200 items-center ${isResetPasswordLoading ? 'opacity-70' : ''}`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isResetPasswordLoading}
                    >
                        {isResetPasswordLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Reset Password</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}
