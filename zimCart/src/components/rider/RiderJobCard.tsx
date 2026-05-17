import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { RiderJob } from '@/types/rider';
import { parseDeliveryAddress } from '@/utils/address';
import { RIDER_COLORS } from './theme';

interface RiderJobCardProps {
  job: RiderJob;
  onPress: () => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#fef3c7', text: '#b45309' },
  Confirmed: { bg: '#e0e7ff', text: '#4338ca' },
  Preparing: { bg: '#f3e8ff', text: '#7c3aed' },
  'Out for delivery': { bg: '#cffafe', text: '#0e7490' },
  Delivered: { bg: '#d1fae5', text: '#047857' },
  Cancelled: { bg: '#fee2e2', text: '#b91c1c' },
};

export function RiderJobCard({ job, onPress }: RiderJobCardProps) {
  const colors = statusColors[job.status] || { bg: '#f1f5f9', text: '#475569' };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      className="mb-4 rounded-3xl overflow-hidden"
      style={{
        shadowColor: '#0d9488',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <LinearGradient
        colors={['#ffffff', '#f0fdfa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5 border border-teal-100/80"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {job.orderNumber}
            </Text>
            <Text className="text-lg font-black text-slate-900 mt-0.5" numberOfLines={1}>
              {job.store.name}
            </Text>
          </View>
          <View style={{ backgroundColor: colors.bg }} className="px-3 py-1.5 rounded-full">
            <Text style={{ color: colors.text }} className="text-[10px] font-black uppercase">
              {job.status}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mb-2">
          <MaterialCommunityIcons name="account-outline" size={16} color={RIDER_COLORS.muted} />
          <Text className="text-sm font-semibold text-slate-600 flex-1" numberOfLines={1}>
            {job.customer.name}
          </Text>
        </View>

        <View className="flex-row items-start gap-2 mb-4">
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={RIDER_COLORS.primary} style={{ marginTop: 2 }} />
          <Text className="text-sm text-slate-500 flex-1 leading-5" numberOfLines={2}>
            {parseDeliveryAddress(job.deliveryAddress).address}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="package-variant" size={16} color={RIDER_COLORS.primary} />
              <Text className="text-xs font-bold text-slate-600">{job.itemCount} items</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="cash" size={16} color={RIDER_COLORS.success} />
              <Text className="text-xs font-bold text-emerald-700">
                Rs {job.deliveryFee.toLocaleString()} fee
              </Text>
            </View>
          </View>
          <View className="w-9 h-9 rounded-full bg-teal-600 items-center justify-center">
            <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
