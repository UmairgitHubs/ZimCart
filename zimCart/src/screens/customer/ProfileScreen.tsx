import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@/hooks/useCustomer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/auth.slice';
import { StackNavigationProp } from '@react-navigation/stack';

const PROFILE_MENU = [
  { id: 'edit-profile', icon: "account-cog-outline", label: "Edit Profile", color: "#3B82F6", bg: "#EFF6FF" },
  { id: 'orders', icon: "package-variant-closed", label: "My Orders", color: "#F97316", bg: "#FFF7ED" },
  { id: 'saved-address', icon: "map-marker-radius-outline", label: "Saved Addresses", color: "#F59E0B", bg: "#FEF3C7" },
  { id: 'payment-methods', icon: "credit-card-settings-outline", label: "Payment Methods", color: "#10B981", bg: "#D1FAE5" },
  { id: 'notifications', icon: "bell-ring-outline", label: "Notifications", color: "#8B5CF6", bg: "#EDE9FE" },
  { id: 'privacy-security', icon: "shield-lock-outline", label: "Privacy & Security", color: "#EC4899", bg: "#FCE7F3" },
  { id: 'help-support', icon: "headset", label: "Help & Support", color: "#6366F1", bg: "#E0E7FF" },
];

const GUEST_MENU = [
  { id: 'help-support', icon: "headset", label: "Help Center", color: "#1F2937", bg: "#F3F4F6" },
  { id: 'terms', icon: "file-document-outline", label: "Terms & Policies", color: "#1F2937", bg: "#F3F4F6" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  // Only fetch profile if authenticated
  const { data: user } = useProfile();
  
  const handleLogout = () => {
    dispatch(logout());
    // Optionally clear query cache or navigate
  };

  const handleLoginNavigation = () => {
    navigation.navigate('CustomerLogin');
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        {/* Header */}
        <View style={{ paddingTop: insets.top }} className="pb-4 bg-white px-5 border-b border-gray-100 flex-row justify-between items-center">
             <Text className="text-2xl font-bold text-gray-900">Account</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Promo Banner */}
            <View className="px-5 mt-6 mb-8">
                <Text className="text-2xl font-extrabold text-gray-900 leading-8 mb-4">
                    Here's 50% off & free delivery on your first order!
                </Text>
                <TouchableOpacity 
                    onPress={handleLoginNavigation}
                    className="bg-green-600 rounded-xl py-4 items-center shadow-lg shadow-green-200 active:bg-green-700"
                >
                    <Text className="text-white font-bold text-lg">Sign up or Log in</Text>
                </TouchableOpacity>
            </View>

            {/* Perks Section (Removed) */}

            {/* General Section */}
            <View className="px-5">
                <Text className="text-lg font-bold text-gray-900 mb-2">General</Text>
                {GUEST_MENU.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        className="flex-row items-center justify-between py-4 border-b border-gray-50"
                        onPress={() => {
                            if (item.id === 'help-support') navigation.navigate('HelpSupport');

                            if (item.id === 'terms') navigation.navigate('PrivacyPolicy');
                        }}
                    >
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full items-center justify-center bg-gray-50 mr-3">
                                <MaterialCommunityIcons name={item.icon as any} size={18} color="#4B5563" />
                            </View>
                            <Text className="text-base font-medium text-gray-700">{item.label}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
                    </TouchableOpacity>
                ))}
            </View>

            <View className="mt-10 items-center">
                <Text className="text-xs text-gray-400">Version 2.0.4</Text>
            </View>
        </ScrollView>
      </View>
    );
  }

  // LOGGED IN VIEW
  const stats = [
      { label: "Orders", value: user?._count?.orders?.toString() || "0", id: "orders" },
      { label: "Vouchers", value: user?._count?.vouchers?.toString() || "0", id: "vouchers" },
      { label: "Favourites", value: user?._count?.favourites?.toString() || "0", id: "favourites" },
  ];
  const isPremium = user?.isPremium || false;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Immersive Header */}
      <View style={{ paddingTop: insets.top }} className="pb-6 bg-white border-b border-gray-100 z-10">
           <View className="px-5 flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-bold text-gray-900">Profile</Text>
           </View>

          {/* Profile Card */}
          <View className="px-5 flex-row items-center">
              <View className="relative">
                  <Image 
                    source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop' }} 
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                  />
                  <View className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-[3px] border-white" />
              </View>
              <View className="ml-5 flex-1">
                  <View className="flex-row items-center mb-1">
                      <Text className="text-xl font-bold text-gray-900 mr-2">{user?.name || 'Loading...'}</Text>
                      {isPremium && <MaterialCommunityIcons name="check-decagram" size={20} color="#3B82F6" />}
                  </View>
                  <Text className="text-gray-500 font-medium text-sm mb-2">{user?.email || 'user@zimcart.com'}</Text>
              </View>
          </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
          {/* Stats Row */}
          <View className="flex-row px-5 mt-6 mb-8 justify-between">
              {stats.map((stat, index) => (
                  <Pressable 
                      key={index} 
                      onPress={() => {
                          if (stat.id === 'orders') navigation.navigate('Orders');
                          if (stat.id === 'vouchers') navigation.navigate('Vouchers');
                          if (stat.id === 'favourites') navigation.navigate('Favourites');
                      }}
                      className="items-center bg-gray-50 flex-1 mx-1 py-4 rounded-xl active:bg-gray-100"
                  >
                      <Text className="text-xl font-bold text-gray-900">{stat.value}</Text>
                      <Text className="text-xs text-gray-400 font-medium uppercase mt-1">{stat.label}</Text>
                  </Pressable>
              ))}
          </View>

          {/* Menu Options */}
          <View className="px-5">
              <Text className="text-gray-900 font-bold text-lg mb-4">Account Settings</Text>
              
              <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                  {PROFILE_MENU.map((item, index) => (
                      <TouchableOpacity 
                        key={index} 
                        className="flex-row items-center p-4 active:bg-gray-50 bg-white"
                        activeOpacity={0.6}
                        onPress={() => {
                             if (item.id === 'edit-profile') navigation.navigate('EditProfile');
                             else if (item.id === 'orders') navigation.navigate('Orders');
                             else if (item.id === 'notifications') navigation.navigate('Notifications');
                             // Map other routes
                        }}
                      >
                          <View 
                            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                            style={{ backgroundColor: item.bg }}
                          >
                             <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                          </View>
                          
                          <View className="flex-1 flex-row items-center justify-between border-b border-gray-50 pb-1">
                               <Text className="text-base font-bold text-gray-800">{item.label}</Text>
                               <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
                          </View>
                      </TouchableOpacity>
                  ))}
              </View>

              {/* Logout Button */}
              <TouchableOpacity 
                onPress={handleLogout}
                className="flex-row items-center justify-center mb-8 py-4 bg-red-50 rounded-2xl border border-red-100"
              >
                  <Text className="text-red-500 font-bold text-sm mr-2">Sign Out</Text>
                  <MaterialCommunityIcons name="logout" size={16} color="#EF4444" />
              </TouchableOpacity>

              <Text className="text-center text-xs text-gray-400 mb-10">App Version 2.0.4 • Made with ❤️</Text>

          </View>
      </ScrollView>
    </View>
  );
}
