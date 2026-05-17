import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useRiderProfile, useRiderAvailability } from '@/hooks/useRider';
import { OnlineToggle } from '@/components/rider/OnlineToggle';
import { RIDER_GRADIENT } from '@/components/rider/theme';

export default function RiderProfileScreen() {
  const navigation = useNavigation();
  const { logout, isLoggingOut } = useAuth();
  const { data: profile, isLoading, refetch } = useRiderProfile();
  const availabilityMutation = useRiderAvailability();

  const handleToggleOnline = async (goOnline: boolean) => {
    try {
      await availabilityMutation.mutateAsync(goOnline ? 'AVAILABLE' : 'OFFLINE');
      refetch();
    } catch {
      refetch();
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Leave the rider app?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout('rider') },
    ]);
  };

  if (isLoading && !profile) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-5 pb-10 rounded-b-[32px]">
        <SafeAreaView edges={['top']}>
          <Text className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2">Profile</Text>
          <View className="flex-row items-center gap-4 mt-4">
            <View className="w-20 h-20 rounded-3xl bg-white/25 items-center justify-center border-2 border-white/30">
              <Text className="text-3xl font-black text-white">
                {profile?.name?.charAt(0)?.toUpperCase() || 'R'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-black text-white">{profile?.name}</Text>
              <Text className="text-white/80 text-sm mt-1">{profile?.email}</Text>
              <View className="flex-row items-center gap-1 mt-2">
                <MaterialCommunityIcons name="star" size={16} color="#fde047" />
                <Text className="text-white font-bold">{profile?.rating?.toFixed(1)} rating</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView className="flex-1 px-5 -mt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mb-5">
          <OnlineToggle
            isOnline={profile?.isOnline ?? false}
            isLoading={availabilityMutation.isPending}
            onToggle={handleToggleOnline}
          />
        </View>

        <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Fleet details</Text>
          {[
            { icon: 'motorbike', label: 'Vehicle', value: profile?.vehicleType },
            { icon: 'card-account-details', label: 'Plate', value: profile?.licensePlate || '—' },
            { icon: 'warehouse', label: 'Home base', value: profile?.homeBase || '—' },
            { icon: 'phone', label: 'Phone', value: profile?.phone || '—' },
          ].map((row) => (
            <View key={row.label} className="flex-row items-center gap-3 py-3 border-b border-slate-50 last:border-0">
              <View className="w-10 h-10 rounded-xl bg-teal-50 items-center justify-center">
                <MaterialCommunityIcons name={row.icon as any} size={20} color="#0d9488" />
              </View>
              <View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase">{row.label}</Text>
                <Text className="text-slate-800 font-semibold">{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 items-center">
            <Text className="text-2xl font-black text-teal-700">{profile?.stats.completedJobs ?? 0}</Text>
            <Text className="text-xs text-slate-500 font-bold mt-1">Deliveries</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 items-center">
            <Text className="text-2xl font-black text-teal-700">
              Rs {(profile?.stats.todayEarnings ?? 0).toLocaleString()}
            </Text>
            <Text className="text-xs text-slate-500 font-bold mt-1">Today</Text>
          </View>
        </View>

        {[
          { icon: 'account-edit', label: 'Edit profile', screen: 'RiderEditProfile' },
          { icon: 'lock-reset', label: 'Change password', screen: 'RiderChangePassword' },
          { icon: 'help-circle', label: 'Help & support', screen: 'RiderHelp' },
        ].map((item) => (
          <TouchableOpacity
            key={item.screen}
            onPress={() => navigation.navigate(item.screen as never)}
            className="bg-white rounded-2xl p-4 mb-2 border border-slate-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <MaterialCommunityIcons name={item.icon as any} size={22} color="#0d9488" />
              <Text className="font-bold text-slate-800">{item.label}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#94a3b8" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoggingOut}
          className="bg-white border border-red-100 rounded-2xl py-4 flex-row items-center justify-center gap-2"
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <>
              <MaterialCommunityIcons name="logout" size={22} color="#dc2626" />
              <Text className="text-red-600 font-black">Sign out</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
