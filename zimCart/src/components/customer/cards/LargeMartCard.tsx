import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MartImage from '@/components/customer/MartImage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LargeMartCardProps {
  item: any; // Using explicit any for flexibility with the new mock data structure
  onPress?: () => void;
}

const LargeMartCard: React.FC<LargeMartCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white mb-6 rounded-none" // Full width feel or slight margin handled by parent
      activeOpacity={0.9}
    >
        {/* Large Image Header */}
        <View className="h-48 relative rounded-2xl overflow-hidden mb-3 bg-gray-100">
            <MartImage uri={item.image} mart={item} className="w-full h-full" />
            
            {/* Ad Badge */}
            {item.isAd && (
                <View className="absolute bottom-2 right-2 bg-white/90 px-1.5 py-0.5 rounded shadow-sm z-10">
                    <Text className="text-[10px] font-bold text-gray-900">Ad</Text>
                </View>
            )}

            {/* Top Favourite Icon (Optional, typical in Mart apps) */}
            <TouchableOpacity className="absolute top-3 right-3 bg-white/20 p-1.5 rounded-full backdrop-blur-md">
                <MaterialCommunityIcons name="heart-outline" size={20} color="white" />
            </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View className="px-1">
            {/* Title & Rating */}
            <View className="flex-row justify-between items-start mb-1">
                <Text className="text-lg font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
                    {item.name}
                </Text>
                <View className="flex-row items-center">
                    <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                    <Text className="text-sm font-bold text-gray-900 ml-1">{item.rating}</Text>
                    <Text className="text-xs text-gray-500 ml-0.5">{item.ratingCount}</Text>
                </View>
            </View>

            {/* Subtitle / Meta */}
            <View className="flex-row items-center mb-2">
                <Text className="text-gray-600 text-sm font-medium">{item.time || item.deliveryTime || '25-35 min'}</Text>
                <Text className="text-gray-400 mx-1">•</Text>
                <Text className="text-gray-600 text-sm font-medium">$$</Text>
                <Text className="text-gray-400 mx-1">•</Text>
                <Text className="text-gray-600 text-sm font-medium" numberOfLines={1}>
                    {(item.tags ?? []).join(', ') || 'General'}
                </Text>
            </View>

            {/* Delivery Info */}
            <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="moped" size={16} color="#6B7280" />
                 {item.deliveryStrike ? (
                     <View className="flex-row items-center ml-1">
                         <Text className="text-xs text-gray-400 line-through mr-1">{item.deliveryStrike}</Text>
                         <Text className="text-xs font-bold text-primary">{item.delivery}</Text>
                     </View>
                 ) : (
                    <Text className="text-xs font-bold text-gray-600 ml-1">{item.delivery || item.deliveryFee || 'Rs. 99'}</Text>
                 )}
            </View>

            {/* Promos */}
            {item.promos && item.promos.length > 0 && (
                <View className="flex-row flex-wrap">
                    {item.promos.map((promo: string, index: number) => (
                        <View key={index} className="bg-pink-100 rounded-md px-2 py-1 mr-2 mb-1 flex-row items-center">
                            <MaterialCommunityIcons name="ticket-percent-outline" size={14} color="#db2777" />
                            <Text className="text-[10px] font-bold text-pink-700 ml-1">
                                {promo}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    </TouchableOpacity>
  );
};

export default LargeMartCard;
