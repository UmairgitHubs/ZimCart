import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNotificationsInbox } from '@/hooks/useCustomer';
import { parseApiError } from '@/utils/errorUtils';

type InboxNotification = {
  id: string;
  type: string;
  title: string;
  body?: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown> | null;
};

function groupNotificationsByDay(data: InboxNotification[]) {
  const groups: Record<string, InboxNotification[]> = { Today: [], Yesterday: [], Earlier: [] };
  const now = new Date();
  const todayString = now.toLocaleDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayString = yesterday.toLocaleDateString();

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    const dateString = date.toLocaleDateString();
    if (dateString === todayString) groups.Today.push(item);
    else if (dateString === yesterdayString) groups.Yesterday.push(item);
    else groups.Earlier.push(item);
  });

  return Object.keys(groups)
    .map((day) => ({ day, data: groups[day] }))
    .filter((g) => g.data.length > 0);
}

function getIconConfig(type: string) {
  const t = (type || '').toLowerCase();
  switch (t) {
    case 'order':
      return { icon: 'package-variant-closed', color: '#16A34A', bg: '#F0FDF4' };
    case 'delivery':
      return { icon: 'truck-delivery-outline', color: '#0D9488', bg: '#ECFDF5' };
    case 'promo':
    case 'new_arrival':
      return { icon: 'lightning-bolt', color: '#EA580C', bg: '#FFF7ED' };
    case 'account':
    case 'welcome_onboarding':
      return { icon: 'party-popper', color: '#8B5CF6', bg: '#F5F3FF' };
    case 'system':
      return { icon: 'shield-alert-outline', color: '#DC2626', bg: '#FEF2F2' };
    default:
      return { icon: 'bell-outline', color: '#4B5563', bg: '#F3F4F6' };
  }
}

function notificationBody(item: InboxNotification) {
  return item.body ?? item.message ?? '';
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data: serverNotifications,
    isLoading,
    isRefetching,
    error,
    refetch,
    markRead,
    markAllRead,
    isMarking,
  } = useNotificationsInbox();

  const list = (serverNotifications ?? []) as InboxNotification[];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filters = ['All', 'Orders', 'Offers', 'System'];

  const filteredNotifications = useMemo(() => {
    const base = list.filter((item) => {
      const t = (item.type || '').toLowerCase();
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Orders') return t === 'order' || t === 'delivery';
      if (activeFilter === 'Offers') return t === 'promo' || t === 'new_arrival';
      if (activeFilter === 'System') {
        return t === 'system' || t === 'account' || t === 'welcome_onboarding';
      }
      return true;
    });
    return groupNotificationsByDay(base);
  }, [activeFilter, list]);

  const unreadCount = useMemo(() => list.filter((n) => !n.isRead).length, [list]);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllRead();
    } catch (e) {
      Alert.alert('Could not update', parseApiError(e));
    }
  };

  const handleOpenNotification = async (item: InboxNotification) => {
    try {
      if (!item.isRead) {
        await markRead(item.id);
      }
      const payload = item.data;
      if (payload && typeof payload === 'object' && 'orderId' in payload) {
        navigation.navigate('Orders');
      }
    } catch (e) {
      Alert.alert('Could not update', parseApiError(e));
    }
  };

  const emptyTitle =
    activeFilter === 'All'
      ? 'No notifications yet'
      : `No ${activeFilter.toLowerCase()} notifications`;

  const showInitialLoader = isLoading && list.length === 0 && !error;

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="bg-white border-b border-gray-100" style={{ paddingTop: insets.top }}>
          <View className="px-5 pb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-black text-gray-900 mr-10">
              Notifications
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="bell-outline" size={56} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-900 mt-6 mb-2 text-center">Sign in to view alerts</Text>
          <Text className="text-gray-500 text-center mb-8">
            Order updates, offers, and delivery notifications appear here after you log in.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CustomerLogin')}
            className="bg-green-700 w-full py-4 rounded-2xl items-center"
          >
            <Text className="text-white font-black text-base">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="bg-white border-b border-gray-100 z-20" style={{ paddingTop: insets.top }}>
        <View className="px-5 pb-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2937" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-xl font-black text-gray-900">Notifications</Text>
            {unreadCount > 0 ? (
              <Text className="text-[11px] font-bold text-gray-400 mt-0.5">
                {unreadCount} unread
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationSettings')}
            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View className="px-5 pb-4 pt-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  className={`mr-3 px-6 py-2 rounded-2xl border ${isActive ? 'bg-green-700 border-green-700' : 'bg-white border-gray-100'}`}
                >
                  <Text className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {error && list.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8 pt-16">
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#9CA3AF" />
          <Text className="text-center text-gray-900 font-bold text-lg mt-4 mb-2">Something went wrong</Text>
          <Text className="text-center text-gray-500 text-sm mb-6">{parseApiError(error)}</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-green-700 px-8 py-3 rounded-full"
          >
            <Text className="text-white font-black text-sm">Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={() => refetch()}
              colors={['#15803d']}
              tintColor="#15803d"
            />
          }
        >
          <View className="flex-row justify-between items-center px-5 py-4 mt-2">
            <View className="flex-row items-center">
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-none">
                {activeFilter} activity
              </Text>
              {activeFilter !== 'All' && (
                <View className="ml-2 px-2 py-0.5 bg-gray-100 rounded-md">
                  <Text className="text-[10px] text-gray-500 font-bold">
                    {filteredNotifications.reduce((acc, curr) => acc + curr.data.length, 0)}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={handleMarkAllRead}
              disabled={unreadCount === 0 || isMarking}
            >
              <Text
                className={`font-bold text-sm ${unreadCount === 0 ? 'text-gray-300' : 'text-green-700'}`}
              >
                Mark all as read
              </Text>
            </TouchableOpacity>
          </View>

          {showInitialLoader ? (
            <View className="flex-1 items-center justify-center pt-20">
              <ActivityIndicator size="large" color="#15803d" />
              <Text className="text-gray-400 font-bold mt-4">Loading notifications…</Text>
            </View>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((section) => (
              <View key={section.day} className="mb-6">
                <View className="px-5 mb-3">
                  <Text className="text-lg font-black text-gray-900">{section.day}</Text>
                </View>

                {section.data.map((item) => {
                  const { icon, color, bg } = getIconConfig(item.type);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleOpenNotification(item)}
                      disabled={isMarking}
                      className={`flex-row px-5 py-5 border-b border-gray-50 ${!item.isRead ? 'bg-green-50/20' : 'bg-white'}`}
                    >
                      <View
                        style={{ backgroundColor: bg }}
                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                      >
                        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
                        {!item.isRead && (
                          <View className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-600 rounded-full border-2 border-white" />
                        )}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-1">
                          <Text
                            className={`text-[15px] flex-1 mr-2 ${!item.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}
                          >
                            {item.title}
                          </Text>
                          <Text className="text-[11px] text-gray-400 font-medium">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                        <Text className="text-[13px] text-gray-500 leading-5" numberOfLines={3}>
                          {notificationBody(item)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center pt-20 px-10">
              <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6">
                <MaterialCommunityIcons name="bell-off-outline" size={40} color="#D1D5DB" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2 text-center">{emptyTitle}</Text>
              <Text className="text-center text-gray-400 leading-5">
                We will notify you when something important happens — orders, offers, and account updates
                appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
