import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOrderTracking } from '@/hooks/useCustomer';
import { useCustomerOrderSocket } from '@/hooks/useCustomerOrderSocket';
import { DeliveryMap } from '@/components/rider/DeliveryMap';
import { openTurnByTurnDirections } from '@/utils/maps';
import { parseApiError } from '@/utils/errorUtils';

function parseAddressSnippet(addressJson: string): string {
  try {
    const o = JSON.parse(addressJson) as { address?: string; detail?: string };
    return [o.address, o.detail].filter(Boolean).join(', ');
  } catch {
    return addressJson.slice(0, 120);
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'SHIPPING':
      return 'Out for delivery';
    case 'PREPARING':
      return 'Preparing your order';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'COMPLETED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Order received';
  }
}

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const orderId = route.params?.orderId as string;

  useCustomerOrderSocket();
  const { data, isLoading, error, refetch, isRefetching } = useOrderTracking(orderId);

  const handleOpenMaps = () => {
    if (!data) return;
    if (data.riderLocation) {
      openTurnByTurnDirections(
        data.riderLocation.latitude,
        data.riderLocation.longitude,
        data.rider?.name ?? 'Rider'
      );
      return;
    }
    const snippet = parseAddressSnippet(data.address);
    if (snippet) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(snippet)}`);
    }
  };

  if (isLoading && !data) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#b91c1c" />
        <Text className="text-gray-900 font-bold text-center mt-4">
          {error ? parseApiError(error) : 'Order not found'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6 bg-green-700 px-6 py-3 rounded-2xl">
          <Text className="text-white font-black">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const mapDestination = data.riderLocation
    ? { lat: data.riderLocation.latitude, lng: data.riderLocation.longitude }
    : null;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text className="text-xl font-black text-gray-900">Track order</Text>
            <Text className="text-gray-500 text-xs font-bold">{data.orderNumber}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#15803d" />}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-gray-100">
          <Text className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</Text>
          <Text className="text-2xl font-black text-green-700 mt-1">{statusLabel(data.status)}</Text>
          <Text className="text-gray-500 text-sm mt-1">{data.store.name}</Text>
        </View>

        {(data.status === 'SHIPPING' || data.riderLocation) && (
          <View className="mx-4 mt-4">
            <DeliveryMap destination={mapDestination} height={220} />
            {data.rider && (
              <View className="mt-3 bg-white rounded-2xl p-4 border border-gray-100 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-100 items-center justify-center">
                  <MaterialCommunityIcons name="moped" size={22} color="#0d9488" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-black text-gray-900">{data.rider.name}</Text>
                  <Text className="text-xs text-gray-500">
                    {data.rider.vehicleType}
                    {data.rider.licensePlate ? ` · ${data.rider.licensePlate}` : ''}
                  </Text>
                </View>
                {data.rider.phone ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${data.rider!.phone}`)}
                    className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center"
                  >
                    <MaterialCommunityIcons name="phone" size={20} color="#15803d" />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        )}

        <View className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-gray-100">
          <Text className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Timeline</Text>
          {data.timeline.map((step, idx) => (
            <View key={step.step} className="flex-row">
              <View className="items-center mr-3">
                <View
                  className={`w-3 h-3 rounded-full ${step.completed ? 'bg-green-600' : 'bg-gray-200'} ${step.current ? 'ring-4 ring-green-100' : ''}`}
                />
                {idx < data.timeline.length - 1 && (
                  <View className={`w-0.5 flex-1 min-h-[28px] ${step.completed ? 'bg-green-200' : 'bg-gray-100'}`} />
                )}
              </View>
              <View className="flex-1 pb-4">
                <Text className={`font-bold ${step.current ? 'text-green-800' : 'text-gray-700'}`}>{step.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mx-4 mt-2 bg-white rounded-3xl p-5 border border-gray-100">
          <Text className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery</Text>
          <Text className="text-gray-800 font-medium mt-2 leading-5">{parseAddressSnippet(data.address)}</Text>
          <TouchableOpacity
            onPress={handleOpenMaps}
            className="mt-4 bg-green-700 h-12 rounded-2xl flex-row items-center justify-center"
          >
            <MaterialCommunityIcons name="map-marker-path" size={20} color="white" />
            <Text className="text-white font-black ml-2 text-sm">Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
