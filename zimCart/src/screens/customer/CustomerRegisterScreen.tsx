import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { parseApiError } from '@/utils/errorUtils';

// Simplified type for navigation prop
type AuthStackParamList = {
  CustomerLogin: undefined;
  CustomerRegister: undefined;
};

export default function CustomerRegisterScreen() {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { register: registerUser, isRegistering } = useAuth();
    
    // UI State for password visibility
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // RHF Setup
    const { control, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setApiError(null);
        try {
            await registerUser(data);
            Alert.alert(
                'Success', 
                'Account created successfully! Please log in.',
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            reset(); // Clear form
                            navigation.replace('CustomerLogin');
                        } 
                    }
                ]
            );
        } catch (error: any) {
            const message = parseApiError(error);
            setApiError(message);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                
                {/* Header / Logo Area */}
                <View className="items-center mb-10 mt-6">
                    <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                        <MaterialCommunityIcons name="account-plus" size={40} color="#2e7d32" />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
                    <Text className="text-gray-500 mt-2 text-center">Join ZimCart for exclusive deals</Text>
                </View>

                {/* API Error Display */}
                {apiError && (
                    <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-center">
                        <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#EF4444" />
                        <Text className="text-red-600 ml-2 flex-1 text-sm font-medium">{apiError}</Text>
                    </View>
                )}

                {/* Register Form */}
                <View className="space-y-4">
                    
                    {/* Name Input */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Full Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                                    <MaterialCommunityIcons name="account-outline" size={20} color={errors.name ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 font-medium text-base h-full"
                                        placeholder="John Doe"
                                        placeholderTextColor="#9CA3AF"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                    />
                                </View>
                            )}
                        />
                        {errors.name && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</Text>}
                    </View>

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

                    {/* Password Input */}
                    <View>
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Password</Text>
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
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-1">
                                        <MaterialCommunityIcons 
                                            name={isPasswordVisible ? "eye-off" : "eye"} 
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
                        <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Confirm Password</Text>
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
                                        secureTextEntry={!isConfirmPasswordVisible}
                                    />
                                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="p-1">
                                            <MaterialCommunityIcons 
                                                name={isConfirmPasswordVisible ? "eye-off" : "eye"} 
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
                        className={`bg-green-700 rounded-2xl py-4 mt-6 shadow-lg shadow-green-200 items-center ${isRegistering ? 'opacity-70' : ''}`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isRegistering}
                    >
                        {isRegistering ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Create Account</Text>
                        )}
                    </TouchableOpacity>

                </View>

                {/* Footer */}
                <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-500 font-medium">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CustomerLogin')}>
                        <Text className="text-green-700 font-bold">Log In</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
