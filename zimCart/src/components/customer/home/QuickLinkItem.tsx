import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickLinkItemData {
  id: number;
  name: string;
  icon: string;
  color: string;
  iconColor: string;
}

interface QuickLinkItemProps {
  item: QuickLinkItemData;
  onPress?: () => void;
}

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center w-[22%]">
        <View 
            className="w-12 h-12 rounded-[18px] items-center justify-center mb-1.5 shadow-sm"
            style={{ backgroundColor: 'white' }} 
        >
            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.iconColor} />
        </View>
        <Text className="text-xs font-bold text-gray-700 text-center">{item.name}</Text>
    </TouchableOpacity>
  );
};

export default QuickLinkItem;
