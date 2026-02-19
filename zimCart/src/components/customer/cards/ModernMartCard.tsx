import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Mart } from '@/types/customer';

interface ModernMartCardProps {
  mart: Mart;
  onPress?: () => void;
}

const ModernMartCard: React.FC<ModernMartCardProps> = ({ mart, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mr-5 w-72 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      style={{ elevation: 3 }}
    >
        {/* Image Header */}
        <View className="h-40 relative bg-gray-100">
            <Image source={{ uri: mart.image }} className="w-full h-full object-cover" />
            
            {/* Rating Badge */}
            <View className="absolute top-2 right-2 bg-white/95 px-2 py-1 rounded-full flex-row items-center shadow-sm">
                  <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                  <Text className="text-xs font-bold ml-1">{mart.rating}</Text>
            </View>
            
            {/* Delivery Time Badge */}
            <View className="absolute bottom-2 left-2 bg-white/95 px-2 py-1 rounded-lg shadow-sm">
                  <Text className="text-[10px] font-bold text-gray-900">{mart.deliveryTime}</Text>
            </View>
        </View>
        
        {/* Content Body */}
        <View className="p-3">
            <Text className="text-lg font-bold text-gray-900 mb-0.5" numberOfLines={1}>{mart.name}</Text>
            <Text className="text-xs text-gray-500 font-medium mb-3" numberOfLines={1}>{mart.tags?.join(' • ') || 'Store'}</Text>
            
            <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
                <View className="flex-row items-center">
                    <MaterialCommunityIcons name="moped" size={16} color="#2e7d32" />
                    <Text className="text-xs font-bold text-primary ml-1">{mart.deliveryFee}</Text>
                </View>
                <View className="bg-gray-50 px-2 py-1 rounded-md">
                    <Text className="text-[10px] font-bold text-gray-600">Min {mart.minOrder}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default ModernMartCard;
