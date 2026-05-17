import React, { useState } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRiderJobs, useRiderProfile, useRiderAvailability, useRiderNotifications } from '@/hooks/useRider';
import { RiderJobCard } from '@/components/rider/RiderJobCard';
import { OnlineToggle } from '@/components/rider/OnlineToggle';
import { RIDER_GRADIENT } from '@/components/rider/theme';

type Tab = 'active' | 'completed';

export default function RiderJobsScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<Tab>('active');
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useRiderProfile();
  const { data: jobs = [], isLoading, refetch, isRefetching } = useRiderJobs(tab);
  const availabilityMutation = useRiderAvailability();
  const { data: notifData } = useRiderNotifications();
  const unread = notifData?.unreadCount ?? 0;

  const handleRefresh = () => {
    refetch();
    refetchProfile();
  };

  const handleToggleOnline = async (goOnline: boolean) => {
    try {
      await availabilityMutation.mutateAsync(goOnline ? 'AVAILABLE' : 'OFFLINE');
    } catch {
      // profile refetch shows current state
      refetchProfile();
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-5 pt-2 pb-8 rounded-b-[28px]">
        <SafeAreaView edges={['top']}>
          <View className="flex-row justify-between items-center mb-1">
            <View>
              <Text className="text-white/70 text-xs font-bold uppercase tracking-widest">Fleet partner</Text>
              <Text className="text-white text-2xl font-black">
                {profileLoading ? '…' : `Hi, ${profile?.name?.split(' ')[0] || 'Rider'}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('RiderNotifications')}
              className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center relative"
            >
              <MaterialCommunityIcons name="bell-outline" size={26} color="#fff" />
              {unread > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1">
                  <Text className="text-white text-[10px] font-black">{unread > 9 ? '9+' : unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 mt-4">
            <View className="flex-1 bg-white/15 rounded-2xl p-3 border border-white/10">
              <Text className="text-white/70 text-[10px] font-bold uppercase">Active</Text>
              <Text className="text-white text-2xl font-black">{profile?.stats.activeJobs ?? 0}</Text>
            </View>
            <View className="flex-1 bg-white/15 rounded-2xl p-3 border border-white/10">
              <Text className="text-white/70 text-[10px] font-bold uppercase">Completed</Text>
              <Text className="text-white text-2xl font-black">{profile?.stats.completedJobs ?? 0}</Text>
            </View>
            <View className="flex-1 bg-white/15 rounded-2xl p-3 border border-white/10">
              <Text className="text-white/70 text-[10px] font-bold uppercase">Rating</Text>
              <Text className="text-white text-2xl font-black">{profile?.rating?.toFixed(1) ?? '—'}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5 -mt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor="#0d9488" />}
      >
        <View className="mb-5">
          <OnlineToggle
            isOnline={profile?.isOnline ?? false}
            isLoading={availabilityMutation.isPending || profileLoading}
            onToggle={handleToggleOnline}
          />
        </View>

        <View className="flex-row bg-white rounded-2xl p-1 mb-5 border border-slate-100">
          {(['active', 'completed'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl ${tab === t ? 'bg-teal-600' : ''}`}
            >
              <Text className={`text-center text-sm font-bold capitalize ${tab === t ? 'text-white' : 'text-slate-500'}`}>
                {t === 'active' ? 'Active jobs' : 'History'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator size="large" color="#0d9488" />
          </View>
        ) : jobs.length === 0 ? (
          <View className="bg-white rounded-3xl p-10 items-center border border-slate-100">
            <View className="w-20 h-20 rounded-full bg-teal-50 items-center justify-center mb-4">
              <MaterialCommunityIcons name="package-variant-closed" size={40} color="#0d9488" />
            </View>
            <Text className="text-lg font-black text-slate-800 text-center">
              {tab === 'active' ? 'No active deliveries' : 'No completed trips yet'}
            </Text>
            <Text className="text-slate-500 text-sm text-center mt-2 leading-5">
              {tab === 'active'
                ? 'Stay online — your manager will assign orders from the dashboard.'
                : 'Finished deliveries will appear here.'}
            </Text>
          </View>
        ) : (
          jobs.map((job) => (
            <RiderJobCard
              key={job.id}
              job={job}
              onPress={() => navigation.navigate('RiderJobDetail', { orderId: job.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
