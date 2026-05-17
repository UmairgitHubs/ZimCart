import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  useRiderNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/useRider';

export default function RiderNotificationsScreen() {
  const navigation = useNavigation();
  const { data, isLoading, refetch, isRefetching } = useRiderNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const handlePress = async (id: string, orderId?: string) => {
    await markRead.mutateAsync(id);
    if (orderId) {
      navigation.navigate('RiderJobDetail' as never, { orderId } as never);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} className="bg-white border-b border-slate-100">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-black text-slate-900">Notifications</Text>
          <TouchableOpacity onPress={() => markAll.mutate()} disabled={!data?.unreadCount}>
            <Text className="text-teal-700 font-bold text-xs">Read all</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {isLoading ? (
          <ActivityIndicator color="#0d9488" className="py-16" />
        ) : !data?.notifications.length ? (
          <View className="items-center py-16">
            <MaterialCommunityIcons name="bell-off-outline" size={56} color="#cbd5e1" />
            <Text className="text-slate-500 font-semibold mt-4">No notifications yet</Text>
          </View>
        ) : (
          data.notifications.map((n) => {
            const orderId = (n.data as { orderId?: string })?.orderId;
            return (
              <TouchableOpacity
                key={n.id}
                onPress={() => handlePress(n.id, orderId)}
                className={`rounded-2xl p-4 mb-3 border ${
                  n.isRead ? 'bg-white border-slate-100' : 'bg-teal-50 border-teal-200'
                }`}
              >
                <View className="flex-row items-start gap-3">
                  <View className="w-10 h-10 rounded-xl bg-teal-100 items-center justify-center">
                    <MaterialCommunityIcons
                      name={n.type === 'delivery' ? 'truck-delivery' : 'bell'}
                      size={22}
                      color="#0d9488"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-black text-slate-900">{n.title}</Text>
                    <Text className="text-slate-600 text-sm mt-1 leading-5">{n.body}</Text>
                    <Text className="text-slate-400 text-xs mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
