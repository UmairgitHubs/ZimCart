import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function CartScreen() {
  // Empty State for now
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center p-5">
      <StatusBar style="dark" />
      <View className="w-40 h-40 bg-gray-50 rounded-full items-center justify-center mb-6">
          <MaterialCommunityIcons name="cart-outline" size={80} color="#ccc" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</Text>
      <Text className="text-gray-500 text-center mb-8 px-8">
        Looks like you haven't added anything to your cart yet. Start exploring!
      </Text>
      <TouchableOpacity className="bg-primary px-8 py-3 rounded-full shadow-lg shadow-green-200">
          <Text className="text-white font-bold text-lg">Start Shopping</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
