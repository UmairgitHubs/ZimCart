import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useDevices } from '@/hooks/useCustomer';
import { parseApiError } from '@/utils/errorUtils';

export default function ManageDevicesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data: devices, isLoading, isRefetching, refetch, revoke, revokeOthers, isRevoking, isRevokingOthers } = useDevices();

  const handleLogoutDevice = (id: string, name: string) => {
      Alert.alert(
          "Log Out Device",
          `Are you sure you want to log out from ${name}?`,
          [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: async () => {
                  try {
                      await revoke(id);
                      Alert.alert("Success", "Device logged out successfully");
                  } catch (error) {
                      Alert.alert("Error", parseApiError(error));
                  }
              }}
          ]
      );
  };

  const handleLogoutAllOthers = () => {
      Alert.alert(
          "Log Out All Others",
          "This will log you out from all other devices except this one. Continue?",
          [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out All", style: "destructive", onPress: async () => {
                  try {
                      await revokeOthers();
                      Alert.alert("Success", "Logged out from all other devices");
                  } catch (error) {
                      Alert.alert("Error", parseApiError(error));
                  }
              }}
          ]
      );
  };

  const formatLastActive = (dateString: string, isCurrent: boolean) => {
    if (isCurrent) return 'Active now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
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

      <ScrollView 
        className="flex-1 px-4 pt-6"
        refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#166534"]} tintColor="#166534" />
        }
      >
          <View className="flex-row items-center justify-between mb-4 px-1">
            <Text className="text-gray-500 font-bold text-xs uppercase">Active Sessions</Text>
            {(isRevoking || isRevokingOthers) && <ActivityIndicator size="small" color="#166534" />}
          </View>
          
          {isLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#166534" />
              </View>
          ) : devices?.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center justify-center shadow-sm">
                  <MaterialCommunityIcons name="cellphone-off" size={48} color="#D1D5DB" />
                  <Text className="text-gray-500 mt-4 text-center">No active sessions found.</Text>
              </View>
          ) : (
              <>
                {devices?.map((device: any) => (
                    <View key={device.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex-row items-center">
                        <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${device.isCurrent ? 'bg-green-50' : 'bg-gray-100'}`}>
                            <MaterialCommunityIcons 
                                name={device.deviceType === 'mobile' ? 'cellphone' : 'monitor'} 
                                size={24} 
                                color={device.isCurrent ? '#166534' : '#6B7280'} 
                            />
                        </View>
                        
                        <View className="flex-1">
                            <View className="flex-row items-center">
                                <Text className="text-base font-bold text-gray-900 mr-2">{device.deviceName}</Text>
                                {device.isCurrent && (
                                    <View className="bg-green-100 px-2 py-0.5 rounded">
                                        <Text className="text-[10px] font-bold text-[#166534] uppercase">This Device</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-sm text-gray-500">{device.os} • {formatLastActive(device.lastActive, device.isCurrent)}</Text>
                            <Text className="text-[10px] text-gray-400 mt-0.5">{device.ipAddress}</Text>
                        </View>

                        {!device.isCurrent && (
                            <TouchableOpacity 
                                onPress={() => handleLogoutDevice(device.id, device.deviceName)}
                                className="p-2"
                                disabled={isRevoking || isRevokingOthers}
                            >
                                <MaterialCommunityIcons name="logout-variant" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {(devices?.length ?? 0) > 1 && (
                    <TouchableOpacity 
                        onPress={handleLogoutAllOthers}
                        disabled={isRevoking || isRevokingOthers}
                        className="mt-2 mb-8 flex-row items-center justify-center p-4"
                    >
                        <Text className="text-red-500 font-bold">Log Out All Other Devices</Text>
                    </TouchableOpacity>
                )}
              </>
          )}
      </ScrollView>
    </View>
  );
}

