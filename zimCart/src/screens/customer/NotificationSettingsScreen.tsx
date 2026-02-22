import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface NotificationSetting {
  id: string;
  label: string;
  description?: string;
  icon: string;
  value: boolean;
  type: 'general' | 'order' | 'promo' | 'account';
}

const MOCK_SETTINGS: NotificationSetting[] = [
  // General
  { id: '1', type: 'general', label: 'Allow Push Notifications', description: 'Receive push notifications on this device', icon: 'bell-ring-outline', value: true },
  { id: '2', type: 'general', label: 'Sound', description: 'Play sound for incoming notifications', icon: 'volume-high', value: true },
  { id: '3', type: 'general', label: 'Vibration', description: 'Vibrate for incoming notifications', icon: 'vibrate', value: true },

  // Orders
  { id: '4', type: 'order', label: 'Order Status Updates', description: 'Get notified when your order is packed or shipped', icon: 'package-variant-closed', value: true },
  { id: '5', type: 'order', label: 'Delivery Updates', description: 'Get notified when your order is out for delivery', icon: 'truck-delivery-outline', value: true },
  
  // Promos
  { id: '6', type: 'promo', label: 'Discounts & Sales', description: 'Be the first to know about flash sales', icon: 'ticket-percent-outline', value: false },
  { id: '7', type: 'promo', label: 'New Arrivals', description: 'Updates on new products in store', icon: 'new-box', value: false },

  // Channels (Account)
  { id: '8', type: 'account', label: 'Email Notifications', description: 'Receive order receipts and newsletters via email', icon: 'email-outline', value: true },
  { id: '9', type: 'account', label: 'SMS Notifications', description: 'Receive critical updates via text message', icon: 'message-text-outline', value: false },
];

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [settings, setSettings] = useState<NotificationSetting[]>(MOCK_SETTINGS);

  const toggleSwitch = (id: string) => {
      setSettings(prev => prev.map(item => 
          item.id === id ? { ...item, value: !item.value } : item
      ));
  };

  const renderSectionHeader = (title: string, color: string) => (
      <View className="flex-row items-center px-4 py-3 bg-gray-50 border-y border-gray-100 mt-4 first:mt-0">
          <View className={`w-1 h-4 rounded-full mr-3`} style={{ backgroundColor: color }} />
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</Text>
      </View>
  );

  const renderItem = (item: NotificationSetting) => (
      <View key={item.id} className="bg-white px-4 py-4 flex-row items-center justify-between border-b border-gray-50">
          <View className="flex-row items-center flex-1 mr-4">
              <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
                  <MaterialCommunityIcons name={item.icon as any} size={20} color="#4B5563" />
              </View>
              <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900 mb-0.5">{item.label}</Text>
                  {item.description && (
                      <Text className="text-xs text-gray-500 leading-4">{item.description}</Text>
                  )}
              </View>
          </View>
          <Switch
              trackColor={{ false: "#E5E7EB", true: "#86efac" }}
              thumbColor={item.value ? "#2e7d32" : "#f4f3f4"}
              ios_backgroundColor="#E5E7EB"
              onValueChange={() => toggleSwitch(item.id)}
              value={item.value}
          />
      </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-200 z-10 flex-row items-center justify-between shadow-sm">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Notification Settings</Text>
          <View className="w-10" /> 
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
          
          {renderSectionHeader('General', '#3B82F6')}
          {settings.filter(s => s.type === 'general').map(renderItem)}

          {renderSectionHeader('Order Updates', '#10B981')}
          {settings.filter(s => s.type === 'order').map(renderItem)}

          {renderSectionHeader('Promotions & Deals', '#F59E0B')}
          {settings.filter(s => s.type === 'promo').map(renderItem)}

          {renderSectionHeader('Communnication Channels', '#8B5CF6')}
          {settings.filter(s => s.type === 'account').map(renderItem)}

          {/* Info Footer */}
          <View className="p-6 items-center">
              <Text className="text-center text-xs text-gray-400 leading-5">
                  Control how and when you receive notifications.{'\n'}
                  Note: Critical security alerts typically cannot be disabled.
              </Text>
          </View>

      </ScrollView>

    </View>
  );
}
