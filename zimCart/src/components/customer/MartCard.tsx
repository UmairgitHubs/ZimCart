import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mart } from "@/types/customer";

interface MartCardProps {
  mart: Mart;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const isSmallDevice = width < 380;

export default function MartCard({ mart, onPress }: MartCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-[24px] mb-6 overflow-hidden"
      style={{ 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 16, 
        elevation: 6 
      }}
    >
      {/* Cover Image */}
      <View className="relative">
        <Image
          source={{ uri: mart.image }}
          className="w-full h-48 object-cover"
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />
        
        {/* Top Overlay Gradient (Simulated with semi-transparent view if needed, but keeping clean for now) */}
        
        {/* Discount/Promo Badge */}
        <View className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
            <Text className="text-xs font-bold text-white tracking-wide">FREE DELIVERY</Text>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm backdrop-blur-sm">
            <MaterialCommunityIcons name="heart-outline" size={20} color="#333" />
        </TouchableOpacity>

        {/* Delivery Time Badge (Floating) */}
        <View className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full flex-row items-center shadow-lg">
          <MaterialCommunityIcons name="clock-time-four-outline" size={14} color="#333" />
          <Text className="text-xs font-bold text-gray-800 ml-1.5">
            {mart.deliveryTime}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4 pt-3">
        <View className="flex-row justify-between items-start mb-1">
            <Text className="text-xl font-extrabold text-gray-900 flex-1 mr-2 leading-7" numberOfLines={1}>
              {mart.name}
            </Text>
            <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-lg">
                <MaterialCommunityIcons name="star" size={16} color="#FBBF24" />
                <Text className="text-xs font-bold text-gray-800 ml-1">{mart.rating}</Text>
            </View>
        </View>
        
        <Text className="text-sm text-gray-500 font-medium mb-3" numberOfLines={1}>
             {mart.tags.join(" • ")}
        </Text>

        <View className="flex-row items-center pt-3 border-t border-gray-100/50">
            <View className="flex-row items-center mr-5">
                <MaterialCommunityIcons name="moped" size={18} color="#2e7d32" />
                <Text className="text-xs font-semibold text-gray-600 ml-1.5">{mart.deliveryFee}</Text>
            </View>
            <View className="flex-row items-center">
                <MaterialCommunityIcons name="shopping-outline" size={16} color="#666" />
                <Text className="text-xs font-semibold text-gray-600 ml-1.5">Min. {mart.minOrder}</Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
