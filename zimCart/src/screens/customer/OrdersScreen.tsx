import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { goToCartTab } from '@/utils/navigation';
import { useOrders } from '@/hooks/useCustomer';
import { useCart } from '@/hooks/useCart';
import { Order } from '@/types/order';
import { parseApiError } from '@/utils/errorUtils';

const { width } = Dimensions.get('window');

function formatTotal(total: number) {
  return `Rs. ${Number(total).toFixed(0)}`;
}

const OrderCard = ({
  item,
  navigation,
}: {
  item: Order;
  navigation: { navigate: (name: string, params?: object) => void; goBack: () => void };
}) => {
  const { clear, add, isClearing, isAdding } = useCart();
  const inProgress = item.status !== 'completed' && item.status !== 'cancelled';

  let statusConfig: {
    color: string;
    bg: string;
    label: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  } = {
    color: '#1F2937',
    bg: 'bg-gray-100',
    label: 'Pending',
    icon: 'clock-outline',
  };

  if (item.status === 'active' || item.status === 'shipping') {
    statusConfig = {
      color: '#16A34A',
      bg: 'bg-green-50',
      label: item.status === 'shipping' ? 'Out for delivery' : 'In progress',
      icon: 'moped',
    };
  } else if (item.status === 'completed') {
    statusConfig = {
      color: '#1d4ed8',
      bg: 'bg-blue-50',
      label: 'Delivered',
      icon: 'check-decagram',
    };
  } else if (item.status === 'cancelled') {
    statusConfig = {
      color: '#B91C1C',
      bg: 'bg-red-50',
      label: 'Cancelled',
      icon: 'close-circle-outline',
    };
  }

  const handleTrack = () => {
    navigation.navigate('OrderTracking', { orderId: item.id });
  };

  const handleReorder = () => {
    const lines = item.items.filter((i) => i.productId || i.id);
    if (lines.length === 0) {
      Alert.alert('Cannot reorder', 'This order has no line items we can add to the cart.');
      return;
    }

    Alert.alert(
      'Reorder',
      'Replace your current basket with these items? Your current cart will be cleared first.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              await clear();
              for (const line of lines) {
                const productId = line.productId ?? line.id;
                await add({ productId, quantity: line.quantity, variants: {} });
              }
              Alert.alert('Cart updated', 'Review your basket and checkout when ready.', [
                {
                  text: 'Go to cart',
                  onPress: () => goToCartTab(navigation),
                },
                { text: 'OK' },
              ]);
            } catch (e) {
              Alert.alert('Reorder failed', parseApiError(e));
            }
          },
        },
      ]
    );
  };

  const handleChat = () => {
    navigation.navigate('HelpSupport');
  };

  const busy = isClearing || isAdding;

  return (
    <View className="bg-white rounded-[32px] p-5 mb-5 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 mr-3">
            <Image source={{ uri: item.store.image }} className="w-full h-full" />
          </View>
          <View style={{ maxWidth: width * 0.55 }}>
            <Text className="text-gray-900 font-black text-sm">{item.store.name}</Text>
            <Text className="text-gray-400 text-[10px] font-bold uppercase mt-0.5">
              {new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} •{' '}
              {item.orderNumber}
            </Text>
          </View>
        </View>
        <View className={`${statusConfig.bg} px-3 py-1.5 rounded-full flex-row items-center`}>
          <MaterialCommunityIcons name={statusConfig.icon} size={14} color={statusConfig.color} style={{ marginRight: 4 }} />
          <Text style={{ color: statusConfig.color }} className="text-[10px] font-black uppercase tracking-widest">
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-gray-50 mb-4" />

      <View className="flex-row justify-between items-end">
        <View className="flex-1 pr-4">
          <Text className="text-gray-500 font-bold text-xs uppercase mb-1">Order summary</Text>
          <Text className="text-gray-900 font-black text-xs leading-4" numberOfLines={2}>
            {item.items.map((i) => i.name).join(', ')}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Total</Text>
          <Text className="text-gray-900 font-black text-lg">{formatTotal(item.total)}</Text>
        </View>
      </View>

      <View className="flex-row mt-6">
        {inProgress ? (
          <TouchableOpacity
            onPress={handleTrack}
            disabled={busy}
            className="flex-1 bg-green-700 h-12 rounded-2xl flex-row items-center justify-center shadow-lg shadow-green-900/40"
            style={{ opacity: busy ? 0.6 : 1 }}
          >
            <MaterialCommunityIcons name="map-marker-path" size={18} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-black text-xs uppercase tracking-widest">Track</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleReorder}
            disabled={busy}
            className="flex-1 bg-gray-900 h-12 rounded-2xl flex-row items-center justify-center shadow-lg shadow-gray-900/40"
            style={{ opacity: busy ? 0.6 : 1 }}
          >
            <MaterialCommunityIcons name="refresh" size={18} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-black text-xs uppercase tracking-widest">Reorder</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleChat}
          className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center ml-3 border border-gray-100"
        >
          <MaterialCommunityIcons name="chat-outline" size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const { data: orders, isLoading } = useOrders(activeTab === 'active' ? 'active' : 'history');

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <StatusBar style="dark" />

      <View style={{ paddingTop: insets.top }} className="bg-white px-5 pb-6 rounded-b-[40px] shadow-sm z-10">
        <View className="flex-row items-center justify-between mt-2 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-11 h-11 bg-gray-50 rounded-full items-center justify-center"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">My account</Text>
            <Text className="text-gray-900 font-black text-xl">Order hub</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'SearchTab' })}
            className="w-11 h-11 bg-gray-50 rounded-full items-center justify-center"
          >
            <MaterialCommunityIcons name="magnify" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View className="bg-gray-100 p-1.5 rounded-[24px] flex-row">
          {(['active', 'history'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 items-center rounded-[20px] ${activeTab === tab ? 'bg-white shadow-md' : ''}`}
            >
              <Text
                className={`text-xs font-black uppercase tracking-widest ${activeTab === tab ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {tab === 'active' ? 'Live' : 'History'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="items-center justify-center mt-20">
            <ActivityIndicator color="#16A34A" />
          </View>
        ) : orders && orders.length > 0 ? (
          orders.map((item) => <OrderCard key={item.id} item={item} navigation={navigation} />)
        ) : (
          <View className="items-center justify-center mt-20 px-10">
            <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-8 shadow-sm">
              <MaterialCommunityIcons name="shopping-outline" size={40} color="#E5E7EB" />
            </View>
            <Text className="text-2xl font-black text-gray-900 mb-2">No orders</Text>
            <Text className="text-gray-400 text-center font-bold text-sm leading-5">
              {activeTab === 'active'
                ? "You don't have any active orders right now."
                : 'Your order history is empty.'}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Main')}
              className="mt-10 bg-gray-900 px-10 py-4 rounded-full shadow-xl shadow-gray-400"
            >
              <Text className="text-white font-black uppercase tracking-widest text-xs">Start shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
