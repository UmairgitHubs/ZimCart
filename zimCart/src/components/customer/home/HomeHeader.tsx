import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';
import { goToMainTab } from '@/utils/navigation';

interface HomeHeaderProps {
  onSearchPress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onSearchPress }) => {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { location, isLoading, refresh } = useCustomerLocation();

  const openSearch = () => {
    if (onSearchPress) {
      onSearchPress();
      return;
    }
    goToMainTab(navigation, 'SearchTab');
  };

  const openNotifications = () => {
    if (!isAuthenticated) {
      navigation.navigate('CustomerLogin');
      return;
    }
    navigation.navigate('Notifications');
  };

  return (
    <View className="bg-[#2e7d32] pt-2 pb-6 px-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={refresh}
          activeOpacity={0.8}
          className="flex-row items-center flex-1 mr-2"
        >
          <View className="p-1.5 rounded-full bg-white/20 mr-2">
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="white" />
          </View>
          <View className="flex-1">
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg leading-5" numberOfLines={1}>
                  {location.line1}
                </Text>
                {location.line2 ? (
                  <Text className="text-white/80 text-xs" numberOfLines={1}>
                    {location.line2}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={openNotifications} className="p-1">
          <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={openSearch}
        activeOpacity={0.9}
        className="bg-white rounded-full flex-row items-center px-4 py-3 mb-6"
      >
        <MaterialCommunityIcons name="magnify" size={22} color="#4B5563" />
        <Text className="flex-1 ml-2 text-base font-medium text-gray-500">
          Search for electronics, clothes...
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center justify-between pl-1">
        <View className="flex-1 pr-4">
          <Text className="text-white font-black text-2xl leading-7 mb-2">
            Here's 50% off & free delivery!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Marts')}
            className="flex-row items-center bg-transparent"
          >
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
