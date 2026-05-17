import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/auth.slice';
import { useNavigation } from '@react-navigation/native';
import { parseApiError } from '@/utils/errorUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RIDER_GRADIENT } from '@/components/rider/theme';

export default function RiderLoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { login, isLoggingIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const result = await login(data);
      if (result && (result as { mfaRequired?: boolean }).mfaRequired) {
        setApiError('Two-factor login is not supported in the rider app yet. Use the web dashboard.');
        return;
      }
      const user = (result as { user?: { role?: string } })?.user;
      if (user && user.status === 'BLOCKED') {
        dispatch(logout());
        setApiError('Your account has been suspended. Contact fleet support.');
        return;
      }
      if (user && user.role !== 'RIDER') {
        dispatch(logout());
        setApiError('This account is not a delivery partner. Ask your manager to create a rider account.');
        return;
      }
      navigation.reset({ index: 0, routes: [{ name: 'RiderMain' }] });
    } catch (error) {
      setApiError(parseApiError(error));
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-6 pt-14 pb-10 rounded-b-[32px]">
        <SafeAreaView edges={['top']}>
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-6">
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center mb-4">
            <MaterialCommunityIcons name="bike-fast" size={32} color="#fff" />
          </View>
          <Text className="text-3xl font-black text-white">Rider sign in</Text>
          <Text className="text-white/80 mt-2 text-base">Fleet accounts only</Text>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAwareScrollView className="flex-1" contentContainerStyle={{ padding: 24 }} enableOnAndroid extraScrollHeight={60}>
        {apiError && (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex-row gap-3">
            <MaterialCommunityIcons name="alert-circle" size={22} color="#dc2626" />
            <Text className="text-red-700 flex-1 text-sm font-medium">{apiError}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className={`flex-row items-center bg-white border rounded-2xl px-4 py-3.5 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 font-medium"
                  placeholder="rider@zimcart.com"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</Text>}
        </View>

        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className={`flex-row items-center bg-white border rounded-2xl px-4 py-3.5 ${errors.password ? 'border-red-400' : 'border-slate-200'}`}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!isPasswordVisible}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <MaterialCommunityIcons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</Text>}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoggingIn}
          activeOpacity={0.9}
          className="rounded-2xl overflow-hidden"
        >
          <LinearGradient colors={['#0f766e', '#14b8a6']} className="py-4 items-center flex-row justify-center gap-2">
            {isLoggingIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white font-black text-base">Sign in</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text className="text-center text-slate-400 text-xs mt-6 leading-5">
          Rider accounts are created by your fleet manager in the admin dashboard.
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}
