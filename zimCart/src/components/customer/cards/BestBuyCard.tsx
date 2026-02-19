import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface BestBuyItem {
  id: string;
  name: string;
  mart: string;
  rating?: number;
  price: string;
  oldPrice: string;
  discount: string;
  image: string;
  time: string;
}

interface BestBuyCardProps {
  item: BestBuyItem;
  onPress?: () => void;
}

const BestBuyCard: React.FC<BestBuyCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mr-4 w-40 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative"
      style={{ elevation: 2 }}
    >
        {/* Image */}
        <View className="h-32 bg-gray-50 relative justify-center items-center">
            <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
            <View className="absolute top-2 left-2 bg-red-500 px-1.5 py-0.5 rounded">
                <Text className="text-[10px] font-bold text-white">{item.discount}</Text>
            </View>
            <View className="absolute bottom-2 right-2 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                  <Text className="text-[9px] font-bold text-gray-900">{item.time}</Text>
            </View>
        </View>
        
        <View className="p-3">
            <Text className="text-sm font-bold text-gray-900 mb-1" numberOfLines={1}>{item.name}</Text>
            <Text className="text-[10px] text-gray-500 mb-2">{item.mart}</Text>
            <View className="flex-row items-baseline">
                <Text className="text-sm font-bold text-primary mr-1">{item.price}</Text>
                <Text className="text-[10px] text-gray-400 line-through">{item.oldPrice}</Text>
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default BestBuyCard;
