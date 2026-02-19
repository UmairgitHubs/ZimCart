import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface CategoryCircleItem {
  id: string;
  name: string;
  image: string;
}

interface CategoryCircleProps {
  item: CategoryCircleItem;
  onPress?: () => void;
}

const CategoryCircle: React.FC<CategoryCircleProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="items-center mr-5">
        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-2 overflow-hidden border border-gray-100">
             <Image source={{ uri: item.image }} className="w-10 h-10" resizeMode="contain" />
        </View>
        <Text className="text-xs font-bold text-gray-800 text-center">{item.name}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCircle;
