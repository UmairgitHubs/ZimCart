import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
    const navigation = useNavigation<any>();
    const { forgotPassword, isForgotPasswordLoading } = useAuth();
    
    // RHF Setup
    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data: ForgotPasswordData) => {
        try {
            await forgotPassword(data.email);
            // Senior Implementation: Navigate to code entry screen first
            navigation.navigate('VerifyResetCode', { email: data.email });
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to send reset code. Please try again.';
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
                    <Text className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</Text>
                    <Text className="text-gray-500 text-lg">Don't worry! It happens. Please enter the email associated with your account.</Text>
                </View>

                {/* Form */}
                <View className="space-y-6">
                    {/* Email Input */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Email Address</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                                    <MaterialCommunityIcons name="email-outline" size={20} color={errors.email ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 font-medium text-base h-full"
                                        placeholder="name@example.com"
                                        placeholderTextColor="#9CA3AF"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            )}
                        />
                        {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</Text>}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        className={`bg-green-700 rounded-2xl py-4 mt-6 shadow-lg shadow-green-200 items-center ${isForgotPasswordLoading ? 'opacity-70' : ''}`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isForgotPasswordLoading}
                    >
                        {isForgotPasswordLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Send Reset Code</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}
