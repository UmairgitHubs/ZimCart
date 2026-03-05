import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EXPLORE_MARTS } from '@/data/mock/home';

const { width } = Dimensions.get('window');

export default function PickupScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [selectedTab, setSelectedTab] = useState<'Map' | 'List'>('List');

    // Filter marts that are likely to have pickup (using mock data)
    const pickupMarts = EXPLORE_MARTS.map(mart => ({
        ...mart,
        distance: (Math.random() * 5).toFixed(1) + ' km',
        prepTime: '15-20 min',
    }));

    const renderPickupCard = (item: any) => (
        <TouchableOpacity 
            key={item.id}
            onPress={() => navigation.navigate('StoreDetail', { store: item })}
            className="bg-white rounded-[28px] mb-4 shadow-sm border border-gray-100 overflow-hidden"
            activeOpacity={0.9}
        >
            <View className="flex-row p-4">
                <Image source={{ uri: item.image }} className="w-24 h-24 rounded-2xl" resizeMode="cover" />
                <View className="flex-1 ml-4 justify-between">
                    <View>
                        <View className="flex-row justify-between items-start">
                            <Text className="text-lg font-black text-gray-900 flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                            <View className="bg-green-100 px-2 py-0.5 rounded-md">
                                <Text className="text-[10px] font-bold text-green-700">OPEN</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center mt-1">
                            <MaterialCommunityIcons name="map-marker" size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs font-medium ml-1">{item.distance} away</Text>
                            <Text className="text-gray-300 mx-2">|</Text>
                            <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
                            <Text className="text-gray-500 text-xs font-medium ml-1">{item.prepTime}</Text>
                        </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row">
                            {item.tags.slice(0, 2).map((tag: string, i: number) => (
                                <View key={i} className="bg-gray-50 px-2 py-1 rounded-lg mr-2">
                                    <Text className="text-gray-400 text-[10px] font-bold uppercase">{tag}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity className="bg-green-700 w-8 h-8 rounded-full items-center justify-center">
                            <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            
            {/* Header */}
            <View className="bg-green-700 pb-8 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
                <View className="px-5 flex-row items-center justify-between mt-2 mb-6">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Nearby</Text>
                        <Text className="text-white font-black text-xl tracking-tighter">Pickup Stores</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name="magnify" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Switcher Tab */}
                <View className="px-5">
                    <View className="bg-white/10 p-1 rounded-2xl flex-row">
                        <TouchableOpacity 
                            onPress={() => setSelectedTab('List')}
                            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${selectedTab === 'List' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <MaterialCommunityIcons name="format-list-bulleted" size={18} color={selectedTab === 'List' ? '#2e7d32' : 'white'} />
                            <Text className={`ml-2 font-bold text-sm ${selectedTab === 'List' ? 'text-gray-900' : 'text-white'}`}>List View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setSelectedTab('Map')}
                            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${selectedTab === 'Map' ? 'bg-white shadow-sm' : ''}`}
                        >
                            <MaterialCommunityIcons name="map-outline" size={18} color={selectedTab === 'Map' ? '#2e7d32' : 'white'} />
                            <Text className={`ml-2 font-bold text-sm ${selectedTab === 'Map' ? 'text-gray-900' : 'text-white'}`}>Map View</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {selectedTab === 'List' ? (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-4">
                    {/* Location Promo */}
                    <View className="bg-green-700 rounded-[32px] p-6 mb-8 mt-2 flex-row items-center overflow-hidden">
                        <View className="flex-1 z-10">
                            <Text className="text-white font-black text-2xl leading-7">Skip the wait.</Text>
                            <Text className="text-green-50/80 font-bold mt-1">Order ahead and pickup from stores near you.</Text>
                            <TouchableOpacity className="bg-white self-start px-5 py-2 rounded-full mt-4">
                                <Text className="text-green-700 font-black text-[10px] uppercase">How it works</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="opacity-20 absolute -right-4">
                            <MaterialCommunityIcons name="shopping" size={120} color="white" />
                        </View>
                    </View>

                    <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Stores with Pickup</Text>
                    
                    {pickupMarts.map(item => renderPickupCard(item))}
                    {pickupMarts.map(item => renderPickupCard({...item, id: `${item.id}-dup`}))}
                </ScrollView>
            ) : (
                <View className="flex-1 items-center justify-center bg-gray-50">
                    <View className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 items-center max-w-[85%]">
                        <View className="w-20 h-20 bg-green-50 rounded-3xl items-center justify-center mb-6">
                            <MaterialCommunityIcons name="map-marker-radius" size={40} color="#2e7d32" />
                        </View>
                        <Text className="text-2xl font-black text-gray-900 text-center">Map Discovery</Text>
                        <Text className="text-gray-500 text-center font-medium mt-2 leading-5">
                            Interactive maps are being synchronized with your local Marts. 
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setSelectedTab('List')}
                            className="bg-green-700 px-8 py-4 rounded-2xl mt-8 w-full items-center"
                        >
                            <Text className="text-white font-black uppercase text-xs tracking-widest">Back to List</Text>
                        </TouchableOpacity>
                    </View>
                    <Text className="absolute bottom-10 text-gray-400 font-bold text-[10px] uppercase">ZimCart Geolocation Engine v2.0</Text>
                </View>
            )}
        </View>
    );
}
