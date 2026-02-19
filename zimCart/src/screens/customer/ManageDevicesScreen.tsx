import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface DeviceSession {
    id: string;
    name: string;
    type: string; // 'mobile' | 'desktop'
    os: string;
    lastActive: string;
    isCurrent: boolean;
}

const MOCK_DEVICES: DeviceSession[] = [
    { id: '1', name: 'iPhone 15 Pro', type: 'mobile', os: 'iOS 18.2', lastActive: 'Active now', isCurrent: true },
    { id: '2', name: 'MacBook Air', type: 'desktop', os: 'macOS Sonoma', lastActive: '2 hours ago', isCurrent: false },
    { id: '3', name: 'Samsung S23', type: 'mobile', os: 'Android 14', lastActive: '3 days ago', isCurrent: false },
];

export default function ManageDevicesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [devices, setDevices] = useState(MOCK_DEVICES);

  const handleLogoutDevice = (id: string, name: string) => {
      Alert.alert(
          "Log Out Device",
          `Are you sure you want to log out from ${name}?`,
          [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: () => {
                  setDevices(prev => prev.filter(d => d.id !== id));
              }}
          ]
      );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Manage Devices</Text>
          <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
          <Text className="text-gray-500 font-bold text-xs uppercase mb-4 ml-1">Active Sessions</Text>
          
          {devices.map((device) => (
              <View key={device.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex-row items-center">
                  <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${device.isCurrent ? 'bg-green-50' : 'bg-gray-100'}`}>
                      <MaterialCommunityIcons 
                        name={device.type === 'mobile' ? 'cellphone' : 'monitor'} 
                        size={24} 
                        color={device.isCurrent ? '#2e7d32' : '#6B7280'} 
                      />
                  </View>
                  
                  <View className="flex-1">
                      <View className="flex-row items-center">
                          <Text className="text-base font-bold text-gray-900 mr-2">{device.name}</Text>
                          {device.isCurrent && (
                              <View className="bg-green-100 px-2 py-0.5 rounded">
                                  <Text className="text-[10px] font-bold text-primary uppercase">This Device</Text>
                              </View>
                          )}
                      </View>
                      <Text className="text-sm text-gray-500">{device.os} • {device.lastActive}</Text>
                  </View>

                  {!device.isCurrent && (
                       <TouchableOpacity 
                         onPress={() => handleLogoutDevice(device.id, device.name)}
                         className="p-2"
                       >
                           <MaterialCommunityIcons name="logout-variant" size={20} color="#EF4444" />
                       </TouchableOpacity>
                  )}
              </View>
          ))}

          <TouchableOpacity className="mt-4 flex-row items-center justify-center p-4">
              <Text className="text-primary font-bold">Log Out All Other Devices</Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
