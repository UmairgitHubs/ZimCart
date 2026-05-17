import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRiderJob, useUpdateDeliveryStatus } from '@/hooks/useRider';
import { parseApiError } from '@/utils/errorUtils';
import type { DeliveryAction } from '@/types/rider';
import { parseDeliveryAddress } from '@/utils/address';
import { openMapsSearch, openTurnByTurnDirections } from '@/utils/maps';
import { DeliveryMap } from '@/components/rider/DeliveryMap';
import { RIDER_GRADIENT } from '@/components/rider/theme';

export default function RiderJobDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const orderId = route.params?.orderId as string;
  const { data: job, isLoading, refetch } = useRiderJob(orderId);
  const updateStatus = useUpdateDeliveryStatus();
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: DeliveryAction, label: string) => {
    const run = async (note?: string, proofOfDeliveryUrl?: string) => {
      setError(null);
      try {
        await updateStatus.mutateAsync({ orderId, action, note, proofOfDeliveryUrl });
        refetch();
        if (action === 'delivered') navigation.goBack();
      } catch (e) {
        setError(parseApiError(e));
      }
    };

    if (action === 'failed_delivery') {
      if (Platform.OS === 'ios') {
        Alert.prompt(
          'Delivery issue',
          'Describe the problem (customer absent, wrong address, etc.)',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Submit', onPress: (text) => run(text || undefined) },
          ],
          'plain-text'
        );
      } else {
        Alert.alert('Delivery issue', 'Report a failed delivery attempt?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Report', onPress: () => run('Delivery attempt failed — rider reported via app') },
        ]);
      }
      return;
    }

    if (action === 'delivered' && Platform.OS === 'ios') {
      Alert.prompt(
        'Proof of delivery (optional)',
        'Paste a photo URL from your camera roll upload, or leave blank.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: (url) => run(undefined, url?.trim() || undefined),
          },
        ],
        'plain-text'
      );
      return;
    }

    Alert.alert('Confirm', `Mark this delivery as "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => run() },
    ]);
  };

  const openMaps = () => {
    if (!job) return;
    if (job.deliveryCoords) {
      openTurnByTurnDirections(
        job.deliveryCoords.lat,
        job.deliveryCoords.lng,
        parseDeliveryAddress(job.deliveryAddress).address
      );
      return;
    }
    openMapsSearch(parseDeliveryAddress(job.deliveryAddress).address);
  };

  const callCustomer = () => {
    if (job?.customer.phone) Linking.openURL(`tel:${job.customer.phone}`);
  };

  if (isLoading || !job) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  const isDelivered = job.dbStatus === 'COMPLETED' || job.dbStatus === 'CANCELLED';
  const actions: { action: DeliveryAction; label: string; icon: string; color: string }[] = [];

  if (!isDelivered) {
    if (['PENDING', 'CONFIRMED'].includes(job.dbStatus)) {
      actions.push({
        action: 'arrived_at_store',
        label: 'Arrived at store',
        icon: 'store-marker',
        color: '#8b5cf6',
      });
    }
    if (['PENDING', 'CONFIRMED', 'PREPARING'].includes(job.dbStatus)) {
      actions.push({
        action: 'picked_up',
        label: 'Picked up from store',
        icon: 'store-check',
        color: '#6366f1',
      });
    }
    actions.push({
      action: 'out_for_delivery',
      label: 'Out for delivery',
      icon: 'truck-delivery',
      color: '#0891b2',
    });
    actions.push({
      action: 'delivered',
      label: 'Mark delivered',
      icon: 'check-circle',
      color: '#059669',
    });
    actions.push({
      action: 'failed_delivery',
      label: 'Report delivery issue',
      icon: 'alert-circle',
      color: '#dc2626',
    });
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-5 pb-6 rounded-b-[28px]">
        <SafeAreaView edges={['top']}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-4"
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white/70 text-xs font-bold uppercase tracking-widest">{job.orderNumber}</Text>
          <Text className="text-white text-2xl font-black mt-1">{job.store.name}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">{job.status}</Text>
            </View>
            <Text className="text-white/80 text-sm font-semibold">{job.itemCount} items</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView className="flex-1 px-5 -mt-2" contentContainerStyle={{ paddingBottom: 40 }}>
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <Text className="text-red-700 text-sm font-medium">{error}</Text>
          </View>
        )}

        <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Customer</Text>
          <Text className="text-lg font-black text-slate-900">{job.customer.name}</Text>
          {job.customer.phone && (
            <TouchableOpacity onPress={callCustomer} className="flex-row items-center gap-2 mt-3">
              <MaterialCommunityIcons name="phone" size={18} color="#0d9488" />
              <Text className="text-teal-700 font-bold">{job.customer.phone}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Drop-off</Text>
          <DeliveryMap destination={job.deliveryCoords} height={180} />
          <Text className="text-slate-700 leading-6 mt-4">{parseDeliveryAddress(job.deliveryAddress).address}</Text>
          <TouchableOpacity onPress={openMaps} className="flex-row items-center gap-2 mt-4 bg-teal-600 self-start px-4 py-2.5 rounded-xl">
            <MaterialCommunityIcons name="navigation" size={18} color="#fff" />
            <Text className="text-white font-bold text-sm">Start navigation</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Order items</Text>
          {job.items.map((item) => (
            <View key={item.id} className="flex-row justify-between py-2 border-b border-slate-50 last:border-0">
              <Text className="text-slate-800 font-medium flex-1 mr-2">
                {item.quantity}× {item.name}
              </Text>
              <Text className="text-slate-500 font-semibold">Rs {item.price.toLocaleString()}</Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-4 pt-3 border-t border-slate-100">
            <Text className="font-bold text-slate-600">Delivery fee</Text>
            <Text className="font-black text-emerald-700">Rs {job.deliveryFee.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-slate-400 text-sm">Payment</Text>
            <Text className="text-slate-600 font-semibold text-sm">{job.paymentMethod}</Text>
          </View>
        </View>

        {job.notes ? (
          <View className="bg-amber-50 rounded-2xl p-4 mb-4 border border-amber-100">
            <Text className="text-amber-800 text-sm font-medium">{job.notes}</Text>
          </View>
        ) : null}

        {!isDelivered && (
          <View className="gap-3">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Update status</Text>
            {actions.map((a) => (
              <TouchableOpacity
                key={a.action}
                onPress={() => handleAction(a.action, a.label)}
                disabled={updateStatus.isPending}
                activeOpacity={0.9}
                className="rounded-2xl overflow-hidden"
              >
                <View style={{ backgroundColor: a.color }} className="py-4 px-5 flex-row items-center gap-3">
                  {updateStatus.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name={a.icon as any} size={24} color="#fff" />
                  )}
                  <Text className="text-white font-black text-base flex-1">{a.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
