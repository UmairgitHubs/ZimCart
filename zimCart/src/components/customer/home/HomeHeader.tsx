import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HomeHeaderProps {
  onSearchPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onSearchPress }) => {
  return (
      <View className="bg-[#2e7d32] pt-2 pb-6 px-4">
           {/* Address Row */}
           <View className="flex-row items-center mb-4">
                 <View className="p-1.5 rounded-full bg-white/20 mr-2">
                    <MaterialCommunityIcons name="map-marker-outline" size={20} color="white" />
                 </View>
                 <View className="flex-1">
                     <Text className="text-white font-bold text-lg leading-5">107 Street 65</Text>
                     <Text className="text-white/80 text-xs">Islamabad</Text>
                 </View>
                  <TouchableOpacity>
                     <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
                 </TouchableOpacity>
           </View>
           
           {/* Search Bar */}
           <View className="bg-white rounded-full flex-row items-center px-4 py-3 mb-6">
                <MaterialCommunityIcons name="magnify" size={22} color="#4B5563" />
                <TextInput 
                    placeholder="Search for electronics, clothes..."
                    className="flex-1 ml-2 text-base font-medium text-gray-800"
                    placeholderTextColor="#9CA3AF"
                    editable={false} // Disable typing, handled by press usually if navigating
                />
           </View>
           
           {/* Banner Content */}
           <View className="flex-row items-center justify-between pl-1">
               <View className="flex-1 pr-4">
                   <Text className="text-white font-black text-2xl leading-7 mb-2">
                       Here's 50% off & free delivery!
                   </Text>
                   <TouchableOpacity className="flex-row items-center bg-transparent">
                       <Text className="text-white font-bold text-sm">Start ordering</Text>
                       <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
                   </TouchableOpacity>
               </View>
               <View className="w-32 h-24 relative">
                   <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6052/6052861.png' }} 
                        className="w-full h-full object-contain"
                        style={{ transform: [{ rotate: '-10deg' }, { scale: 1.1 }] }}
                   />
               </View>
           </View>
      </View>
  );
};

export default HomeHeader;
