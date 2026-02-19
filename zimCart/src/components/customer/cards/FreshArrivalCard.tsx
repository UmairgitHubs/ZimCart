import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FreshArrivalItem {
  id: string;
  name: string;
  store: string;
  price: string;
  image: string;
}

interface FreshArrivalCardProps {
  item: FreshArrivalItem;
  onPress?: () => void;
}

const FreshArrivalCard: React.FC<FreshArrivalCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white border border-gray-100 rounded-2xl p-3 mb-3 flex-row items-center shadow-sm"
    >
        <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl bg-gray-100" />
        <View className="flex-1 ml-4 justify-center">
            <Text className="text-sm font-bold text-green-700 mb-1">{item.store}</Text>
            <Text className="text-lg font-black text-gray-900 mb-1">{item.name}</Text>
            <Text className="text-lg font-bold text-primary">{item.price}</Text>
        </View>
        <TouchableOpacity className="bg-gray-900 p-2 rounded-full">
            <MaterialCommunityIcons name="plus" size={20} color="white" />
        </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default FreshArrivalCard;
