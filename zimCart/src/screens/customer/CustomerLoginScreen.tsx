import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Simplified type for navigation prop
type AuthStackParamList = {
  CustomerLogin: undefined;
  CustomerRegister: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Main: undefined; // Added Main screen target
};

export default function CustomerLoginScreen() {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
    const { login, isLoggingIn } = useAuth();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // RHF Setup
    const { control, handleSubmit, reset, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            Alert.alert('Success', 'Logged in successfully!');
            reset(); // Clear form fields
            
            // Navigate to Main Application (Profile/Home)
            // Using reset to prevent going back to login screen on back press
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Login Failed', 'Invalid credentials or network error.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center">
            <StatusBar style="dark" />
            
            {/* Header / Logo Area */}
            <View className="items-center mb-10">
                <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                    <MaterialCommunityIcons name="shopping" size={40} color="#2e7d32" />
                </View>
                <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
                <Text className="text-gray-500 mt-2 text-center">Sign in to continue your shopping journey</Text>
            </View>

            {/* Login Form */}
            <View className="space-y-4">
                
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

                {/* Forgot Password Link */}
                <TouchableOpacity 
                    className="self-end py-1"
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text className="text-green-600 font-bold text-sm">Forgot Password?</Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity 
                    className={`bg-green-700 rounded-2xl py-4 mt-4 shadow-lg shadow-green-200 items-center ${isLoggingIn ? 'opacity-70' : ''}`}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Login</Text>
                    )}
                </TouchableOpacity>

            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
                <Text className="text-gray-500 font-medium">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerRegister')}>
                    <Text className="text-green-700 font-bold">Sign Up</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}
