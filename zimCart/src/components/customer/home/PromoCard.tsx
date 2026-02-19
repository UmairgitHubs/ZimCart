import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface PromoCardItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  image: string;
  brandLogo: string;
}

interface PromoCardProps {
  item: PromoCardItem;
  onPress?: () => void;
}

const PromoCard: React.FC<PromoCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mr-3 w-36 h-48 rounded-2xl p-4 relative overflow-hidden" 
      style={{ backgroundColor: item.color }}
    >
        <View className="bg-white/90 p-1 rounded-md self-start mb-2">
            <Image source={{ uri: item.brandLogo }} className="w-6 h-4" resizeMode="contain" />
        </View>
        
        <Text className="text-white font-black text-xl leading-5 mb-1">{item.title}</Text>
        <Text className="text-white/90 text-[10px] font-bold bg-black/20 self-start px-2 py-0.5 rounded-full">{item.subtitle}</Text>
        
        <Image 
            source={{ uri: item.image }} 
            className="absolute -bottom-2 -right-2 w-24 h-24" 
            resizeMode="contain" 
        />
        <Text className="absolute bottom-2 left-4 text-[8px] text-white/60">T&Cs apply</Text>
    </TouchableOpacity>
  );
};

export default PromoCard;
