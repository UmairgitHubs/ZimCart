import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface ShopCategoryItem {
  id: string;
  name: string;
  items: string;
  image: string;
}

interface ShopCategoryCardProps {
  item: ShopCategoryItem;
  onPress?: () => void;
}

const ShopCategoryCard: React.FC<ShopCategoryCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mr-4 w-32 h-40 rounded-2xl overflow-hidden relative"
    >
        <Image 
            source={{ uri: item.image }} 
            className="w-full h-full object-cover" 
        />
        <View className="absolute inset-0 bg-black/40" />
        
        <View className="absolute bottom-3 left-3 right-3">
             <Text className="text-white font-bold text-sm mb-0.5" numberOfLines={2}>
                 {item.name}
             </Text>
             <Text className="text-white/80 text-[10px] font-medium">
                 {item.items}
             </Text>
        </View>
    </TouchableOpacity>
  );
};

export default ShopCategoryCard;
