import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function ManageDataScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleRequestData = () => {
      Alert.alert("Request Sent", "We will email you a copy of your data within 48 hours.");
  };

  const handleClearHistory = () => {
      Alert.alert(
          "Clear History",
          "Are you sure you want to clear your search and view history?",
          [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive" }
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
          <Text className="text-xl font-bold text-gray-900">Manage Data</Text>
          <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-4">
                  <MaterialCommunityIcons name="cloud-download-outline" size={24} color="#3B82F6" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-1">Download Your Data</Text>
              <Text className="text-gray-500 text-sm leading-5 mb-4">
                  Get a copy of your personal data, including your order history, saved addresses, and preferences.
              </Text>
              <TouchableOpacity 
                onPress={handleRequestData}
                className="bg-blue-50 py-3 rounded-xl border border-blue-100"
              >
                  <Text className="text-blue-600 font-bold text-center">Request Data Copy</Text>
              </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-4">
                  <MaterialCommunityIcons name="history" size={24} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-1">Clear History</Text>
              <Text className="text-gray-500 text-sm leading-5 mb-4">
                  Remove all your recently viewed items and search history from this device.
              </Text>
              <TouchableOpacity 
                onPress={handleClearHistory}
                className="bg-red-50 py-3 rounded-xl border border-red-100"
              >
                  <Text className="text-red-600 font-bold text-center">Clear Search History</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>
    </View>
  );
}
