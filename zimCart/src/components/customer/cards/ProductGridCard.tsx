import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProductItem {
  id: string;
  name: string;
  weight: string;
  price: string;
  oldPrice?: string;
  image: string;
}

interface ProductGridCardProps {
  item: ProductItem;
  onPress?: () => void;
  onAdd?: () => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({ item, onPress, onAdd }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="w-[48%] bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden"
    >
        {/* Image Container */}
        <View className="h-32 bg-gray-50 flex-center items-center justify-center p-2 relative">
            <Image source={{ uri: item.image }} className="w-24 h-24" resizeMode="contain" />
            {/* Optional Discount Badge could go here */}
        </View>

        {/* Content */}
        <View className="p-3">
            <Text className="text-gray-900 font-bold text-sm mb-1 h-9 leading-4" numberOfLines={2}>
                {item.name}
            </Text>
            <Text className="text-gray-500 text-xs mb-3 font-medium">
                {item.weight}
            </Text>

            <View className="flex-row items-center justify-between">
                <View>
                     <Text className="text-gray-900 font-bold text-sm">{item.price}</Text>
                     {item.oldPrice ? (
                         <Text className="text-gray-400 text-[10px] line-through">{item.oldPrice}</Text>
                     ) : null}
                </View>
                
                {/* Add Button */}
                <TouchableOpacity 
                    onPress={onAdd}
                    className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5"
                >
                    <Text className="text-primary font-bold text-xs uppercase">Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default ProductGridCard;
