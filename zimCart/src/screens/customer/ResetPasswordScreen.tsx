import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function ResetPasswordScreen() {
    const navigation = useNavigation();
    const { resetPassword, isResetPasswordLoading } = useAuth();
    
    // RHF Setup
    const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data: ResetPasswordData) => {
        try {
            await resetPassword(data);
            Alert.alert(
                'Success', 
                'Your password has been reset successfully. Please login.',
                [{ text: 'Go to Login', onPress: () => navigation.navigate('CustomerLogin' as never) }]
            );
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
            Alert.alert('Error', message);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1 px-6 pt-10">
                
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6 w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>

                {/* Header */}
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-gray-900 mb-2">Reset Password</Text>
                    <Text className="text-gray-500 text-lg">Enter the token from your email and set a new password.</Text>
                </View>

                {/* Form */}
                <View className="space-y-6">
                    {/* Token Input (Usually pre-filled via deep link, but manual entry for now) */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Reset Token</Text>
                        <Controller
                            control={control}
                            name="token"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.token ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                                    <MaterialCommunityIcons name="key-outline" size={20} color={errors.token ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 font-medium text-base h-full"
                                        placeholder="Paste token here"
                                        placeholderTextColor="#9CA3AF"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                    />
                                </View>
                            )}
                        />
                        {errors.token && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.token.message}</Text>}
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
                                        secureTextEntry
                                    />
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
                                        secureTextEntry
                                    />
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
