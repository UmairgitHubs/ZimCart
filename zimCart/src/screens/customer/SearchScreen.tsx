import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Mock Search Results/Categories
const TRENDING = ["Milk", "Eggs", "Bread", "iPhone 15", "Lipstick"];
const RECENT_SEARCHES = ["Grocery near me", "Fresh fruits"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      {/* Search Header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
            <MaterialCommunityIcons name="magnify" size={24} color="#666" />
            <TextInput 
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Search ZimCart..."
                autoFocus
                value={query}
                onChangeText={setQuery}
            />
            {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                    <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
        </View>
      </View>

      <ScrollView className="flex-1" keyboardDismissMode="on-drag">
        {/* Recent Searches */}
        <View className="mt-4 px-5">
            <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-bold text-gray-900">Recent Searches</Text>
                <TouchableOpacity><Text className="text-xs text-primary font-bold">Clear</Text></TouchableOpacity>
            </View>
            {RECENT_SEARCHES.map((item, index) => (
                <TouchableOpacity key={index} className="flex-row items-center py-3 border-b border-gray-50">
                    <MaterialCommunityIcons name="history" size={20} color="#666" />
                    <Text className="ml-3 text-gray-700 text-base">{item}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* Trending */}
        <View className="mt-6 px-5">
             <Text className="text-sm font-bold text-gray-900 mb-3">Trending Now</Text>
             <View className="flex-row flex-wrap gap-2">
                {TRENDING.map((tag, index) => (
                    <TouchableOpacity key={index} className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <Text className="text-gray-600 font-medium">{tag}</Text>
                    </TouchableOpacity>
                ))}
             </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
