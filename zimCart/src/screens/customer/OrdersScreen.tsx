import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Order Type Definition
interface OrderItemType {
    id: string;
    storeName: string;
    items: string[];
    total: string;
    status: 'active' | 'completed' | 'cancelled';
    date: string;
    orderNumber: string;
    storeImage: string;
    itemCount: number;
}

// MOCK_ORDERS removed. Using useOrders hook.
import { useOrders } from '@/hooks/useCustomer';
import { Order } from '@/types/order';

const OrderCard = ({ item }: { item: Order }) => {
    const isCompleted = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';
    const isActive = item.status === 'active';

    let statusColor = "text-gray-600";
    let statusBg = "bg-gray-50";
    let statusLabel: string = item.status;
    let statusIcon: any = "help-circle-outline";

    if (isActive) {
        statusColor = "text-blue-600";
        statusBg = "bg-blue-50";
        statusLabel = "In Progress";
        statusIcon = "clock-outline";
    } else if (isCompleted) {
        statusColor = "text-green-600";
        statusBg = "bg-green-50";
        statusLabel = "Delivered";
        statusIcon = "check-circle-outline";
    } else if (isCancelled) {
        statusColor = "text-red-500";
        statusBg = "bg-red-50";
        statusLabel = "Cancelled";
        statusIcon = "close-circle-outline";
    }

    return (
        <View 
            className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2
            }}
        >
            {/* Header: Store Info & Status */}
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 mr-3">
                        <Image 
                            source={{ uri: item.store.image }} 
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900 leading-tight" numberOfLines={1}>
                            {item.store.name}
                        </Text>
                        <Text className="text-xs text-gray-400 mt-0.5">{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                </View>
                
                <View className={`px-3 py-1.5 rounded-full flex-row items-center ${statusBg}`}>
                    {/* Using simple text/icon logic to avoid context issues */}
                    <MaterialCommunityIcons name={statusIcon} size={14} color={isActive ? "#2563EB" : isCompleted ? "#16A34A" : "#EF4444"} style={{ marginRight: 4 }} />
                    <Text className={`text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>
                        {statusLabel}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-50 mb-4 w-full" />

            {/* Content: Items & Price */}
            <View className="mb-5">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order {item.orderNumber}</Text>
                    <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.items.length} Items</Text>
                </View>
                
                <Text className="text-gray-700 text-sm leading-6 font-medium" numberOfLines={2}>
                    {item.items.map(i => i.name).join(', ')}
                </Text>
                {item.items.length > 2 && (
                    <Text className="text-xs text-gray-400 mt-1 font-medium">+{item.items.length - 2} more items...</Text>
                )}
            </View>

            {/* Footer: Price & Action */}
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-xs text-gray-400 mb-0.5 font-medium">Total Amount</Text>
                    <Text className="text-xl font-extrabold text-gray-900">{item.total}</Text>
                </View>

                {isActive ? (
                    <Pressable 
                        className="bg-[#2e7d32] px-5 py-3 rounded-2xl flex-row items-center shadow-md shadow-green-200 active:opacity-80"
                    >
                        <Text className="text-white font-bold text-sm mr-2">Track Order</Text>
                        <MaterialCommunityIcons name="arrow-right" size={16} color="white" />
                    </Pressable>
                ) : (
                    <Pressable 
                        className="bg-white border border-gray-200 px-5 py-3 rounded-2xl flex-row items-center active:bg-gray-50"
                        style={{ elevation: 0 }}
                    >
                        <MaterialCommunityIcons name="refresh" size={18} color="#374151" style={{ marginRight: 6 }} />
                        <Text className="text-gray-700 font-bold text-sm">Reorder</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );

};

export default function OrdersScreen(props: any) {
  const navigation = props.navigation;
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const { data: orders, isLoading, error } = useOrders(activeTab === 'active' ? 'active' : 'history');

  const filteredOrders = orders || [];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Immersive Modern Header */}
      <View 
        style={{ paddingTop: insets.top }} 
        className="bg-white px-5 pb-6 border-b border-gray-50 shadow-sm z-10"
      >
          <View className="flex-row items-center justify-between mb-6 mt-2">
              <Pressable 
                onPress={() => navigation && navigation.goBack()} 
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
              >
                  <MaterialCommunityIcons name="arrow-left" size={20} color="#1F2937" />
              </Pressable>
              
              <Text className="text-xl font-bold text-gray-900">My Orders</Text>
              
              <Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                  <MaterialCommunityIcons name="magnify" size={20} color="#1F2937" />
              </Pressable>
          </View>

          {/* Segmented Control Tabs */}
          <View className="flex-row bg-gray-100 p-1 rounded-2xl">
              <Pressable 
                onPress={() => setActiveTab('active')}
                className={`flex-1 py-3 items-center rounded-xl transition-all ${
                    activeTab === 'active' ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}
              >
                  <Text className={`font-bold transition-all ${
                      activeTab === 'active' ? 'text-gray-900' : 'text-gray-500'
                  }`}>Active</Text>
              </Pressable>
              <Pressable 
                onPress={() => setActiveTab('history')}
                className={`flex-1 py-3 items-center rounded-xl transition-all ${
                    activeTab === 'history' ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}
              >
                  <Text className={`font-bold transition-all ${
                      activeTab === 'history' ? 'text-gray-900' : 'text-gray-500'
                  }`}>History</Text>
              </Pressable>
          </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
          {filteredOrders.length > 0 ? (
              filteredOrders.map(item => (
                  <OrderCard key={item.id} item={item} />
              ))
          ) : (
            <View className="items-center justify-center mt-20 px-10">
                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                    <MaterialCommunityIcons name="shopping-outline" size={48} color="#9CA3AF" />
                </View>
                <Text className="text-xl font-bold text-gray-900 mb-2 text-center">No orders yet</Text>
                <Text className="text-gray-500 text-center leading-6">
                    {activeTab === 'active' 
                        ? "You don't have any active orders. Why not explore our stores?" 
                        : "Your order history is empty. Start your first order today!"}
                </Text>
                <Pressable className="mt-8 bg-gray-900 px-8 py-3 rounded-2xl shadow-lg shadow-gray-400">
                    <Text className="text-white font-bold">Start Shopping</Text>
                </Pressable>
            </View>
          )}
      </ScrollView>
    </View>
  );
}
