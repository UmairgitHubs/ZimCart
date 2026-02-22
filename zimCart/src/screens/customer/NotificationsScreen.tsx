import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface NotificationItem {
  id: string;
  type: 'order' | 'promo' | 'system' | 'account';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  color: string;
  bg: string;
}

const NOTIFICATIONS_DATA: { day: string; data: NotificationItem[] }[] = [
  {
    day: 'Today',
    data: [
      {
        id: '1',
        type: 'order',
        title: 'Order Delivered!',
        message: 'Your order #ZM-8821 has been delivered. Enjoy your shopping!',
        time: '2h ago',
        isRead: false,
        icon: 'package-variant-closed',
        color: '#16A34A',
        bg: '#F0FDF4',
      },
      {
        id: '2',
        type: 'promo',
        title: 'Flash Sale Live! ⚡️',
        message: 'Up to 70% off on electronics for the next 4 hours. Don\'t miss out!',
        time: '5h ago',
        isRead: false,
        icon: 'lightning-bolt',
        color: '#EA580C',
        bg: '#FFF7ED',
      },
    ]
  },
  {
    day: 'Yesterday',
    data: [
      {
        id: '3',
        type: 'system',
        title: 'Security Alert',
        message: 'A new login was detected from a Chrome browser on Windows 11.',
        time: 'Yesterday, 4:20 PM',
        isRead: true,
        icon: 'shield-alert-outline',
        color: '#DC2626',
        bg: '#FEF2F2',
      },
      {
        id: '4',
        type: 'order',
        title: 'Refund Processed',
        message: 'Refund for order #ZM-8815 has been credited to your wallet.',
        time: 'Yesterday, 10:15 AM',
        isRead: true,
        icon: 'cash-backwards',
        color: '#2563EB',
        bg: '#EFF6FF',
      },
    ]
  },
  {
    day: 'Earlier',
    data: [
      {
        id: '5',
        type: 'account',
        title: 'Welcome to ZimCart!',
        message: 'Thanks for joining us! Start exploring the best products in town.',
        time: 'Feb 18, 2026',
        isRead: true,
        icon: 'party-popper',
        color: '#8B5CF6',
        bg: '#F5F3FF',
      },
    ]
  }
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const filters = ['All', 'Orders', 'Offers', 'System'];

  const markAllRead = () => {
    setNotifications(prev => prev.map(section => ({
      ...section,
      data: section.data.map(item => ({ ...item, isRead: true }))
    })));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.map(section => {
      const filteredData = section.data.filter(item => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Orders') return item.type === 'order';
        if (activeFilter === 'Offers') return item.type === 'promo';
        if (activeFilter === 'System') return item.type === 'system' || item.type === 'account';
        return true;
      });
      return { ...section, data: filteredData };
    }).filter(section => section.data.length > 0);
  }, [activeFilter, notifications]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Sticky Header */}
      <View 
        className="bg-white border-b border-gray-100 z-20"
        style={{ paddingTop: insets.top }}
      >
        <View className="px-5 pb-2 flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
            >
                <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2937" />
            </TouchableOpacity>
            
            <Text className="text-xl font-black text-gray-900">Notifications</Text>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('NotificationSettings')}
              className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
            >
                <MaterialCommunityIcons name="cog-outline" size={24} color="#4B5563" />
            </TouchableOpacity>
        </View>

        {/* Chip Filter bar */}
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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="flex-1"
      >
          {/* Action Row */}
          <View className="flex-row justify-between items-center px-5 py-4 mt-2">
              <View className="flex-row items-center">
                <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-none">{activeFilter} Activity</Text>
                {activeFilter !== 'All' && (
                    <View className="ml-2 px-2 py-0.5 bg-gray-100 rounded-md">
                        <Text className="text-[10px] text-gray-500 font-bold">
                            {filteredNotifications.reduce((acc, curr) => acc + curr.data.length, 0)}
                        </Text>
                    </View>
                )}
              </View>
              <TouchableOpacity onPress={markAllRead}>
                  <Text className="text-green-700 font-bold text-sm">Mark all as read</Text>
              </TouchableOpacity>
          </View>

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((section) => (
              <View key={section.day} className="mb-6">
                  <View className="px-5 mb-3">
                      <Text className="text-lg font-black text-gray-900">{section.day}</Text>
                  </View>
                  
                  {section.data.map((item) => (
                      <Pressable 
                        key={item.id}
                        className={`flex-row px-5 py-5 border-b border-gray-50 ${!item.isRead ? 'bg-green-50/20' : 'bg-white'}`}
                      >
                          <View 
                            style={{ backgroundColor: item.bg }}
                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                          >
                              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                              {!item.isRead && (
                                  <View className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-600 rounded-full border-2 border-white" />
                              )}
                          </View>

                          <View className="flex-1">
                              <View className="flex-row justify-between items-start mb-1">
                                  <Text className={`text-[15px] flex-1 mr-2 ${!item.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                                      {item.title}
                                  </Text>
                                  <Text className="text-[11px] text-gray-400 font-medium">{item.time}</Text>
                              </View>
                              <Text className="text-[13px] text-gray-500 leading-5" numberOfLines={2}>
                                  {item.message}
                              </Text>
                          </View>
                      </Pressable>
                  ))}
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center pt-20 px-10">
                <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6">
                    <MaterialCommunityIcons name="bell-off-outline" size={40} color="#D1D5DB" />
                </View>
                <Text className="text-xl font-bold text-gray-900 mb-2">No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} notifications</Text>
                <Text className="text-center text-gray-400 leading-5">
                    We'll notify you when something important happens. Stay tuned!
                </Text>
            </View>
          )}

      </ScrollView>
    </View>
  );
}
