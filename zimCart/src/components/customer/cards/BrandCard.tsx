import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface BrandItem {
  id: string;
  name: string;
  time: string;
  image: string;
}

interface BrandCardProps {
  item: BrandItem;
  onPress?: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="items-center mr-5">
        <View className="w-20 h-20 bg-white rounded-2xl border border-gray-100 shadow-sm items-center justify-center mb-2 overflow-hidden relative">
              <Image source={{ uri: item.image }} className="w-12 h-12" resizeMode="contain" />
        </View>
        <Text className="text-xs font-bold text-gray-900 text-center mb-0.5">{item.name}</Text>
        <Text className="text-[10px] text-gray-400 text-center">{item.time}</Text>
    </TouchableOpacity>
  );
};

export default BrandCard;
