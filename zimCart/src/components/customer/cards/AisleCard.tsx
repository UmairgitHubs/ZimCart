import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface AisleItem {
  id: string;
  name: string;
  color: string;
  image: string;
}

interface AisleCardProps {
  item: AisleItem;
  onPress?: () => void;
}

const AisleCard: React.FC<AisleCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="w-[48%] mb-3 rounded-2xl p-4 flex-row items-center justify-between shadow-sm"
      style={{ backgroundColor: item.color }}
    >
        <Text className="font-bold text-gray-800 text-sm">{item.name}</Text>
        <Image source={{ uri: item.image }} className="w-8 h-8" resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default AisleCard;
