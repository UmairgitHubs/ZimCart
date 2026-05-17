import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { goToCartTab } from '@/utils/navigation';
import { useProducts } from '@/hooks/useMarketplace';
import { mapProductToDealCard } from '@/utils/productMappers';

export default function NewInScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const CATEGORIES = [
        { id: '1', name: 'All', icon: 'creation' as any },
        { id: '2', name: 'Organic', icon: 'leaf' },
        { id: '3', name: 'Bakery', icon: 'bread-slice' },
        { id: '4', name: 'Dairy', icon: 'cow' },
    ];

    const { data: freshData, isLoading } = useProducts({ limit: 20 });
    const products = freshData?.products ?? [];
    const arrivals = products.map(mapProductToDealCard);

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            
            {/* Header */}
            <View className="bg-green-700 pb-10 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
                <View className="px-5 flex-row items-center justify-between mt-2">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Fresh In</Text>
                        <Text className="text-white font-black text-xl tracking-tighter">New Arrivals</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name="magnify" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Hero Banner */}
                <View className="px-4 mt-6">
                    <View className="bg-green-50 rounded-[40px] p-8 relative overflow-hidden">
                        <View className="z-10">
                            <Text className="text-green-900 font-black text-3xl leading-9">Fresh In{"\n"}The Grid</Text>
                            <Text className="text-green-700 font-bold mt-2 text-sm">Discover the latest additions to ZimCart</Text>
                            <TouchableOpacity className="bg-green-700 self-start px-6 py-3 rounded-full mt-4">
                                <Text className="text-white font-bold text-xs uppercase">Explore All</Text>
                            </TouchableOpacity>
                        </View>
                        <MaterialCommunityIcons 
                            name={"creation" as any} 
                            size={120} 
                            color="#2e7d32" 
                            className="absolute -right-8 -bottom-8 opacity-10" 
                        />
                    </View>
                </View>

                {/* Filter Tabs */}
                <View className="mt-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity 
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.name)}
                                className={`flex-row items-center mr-3 px-6 py-3 rounded-full border ${selectedCategory === cat.name ? 'bg-gray-900 border-gray-900 shadow-lg shadow-gray-300' : 'bg-white border-gray-200'}`}
                            >
                                <MaterialCommunityIcons 
                                    name={cat.icon as any} 
                                    size={16} 
                                    color={selectedCategory === cat.name ? 'white' : '#4B5563'} 
                                />
                                <Text className={`ml-2 font-bold text-sm ${selectedCategory === cat.name ? 'text-white' : 'text-gray-600'}`}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Product List */}
                <View className="px-4 mt-8">
                    {isLoading && <ActivityIndicator color="#2e7d32" className="py-8" />}
                    {!isLoading && arrivals.length === 0 && (
                        <Text className="text-gray-400 font-bold py-6">No new products yet</Text>
                    )}
                    {arrivals.map((item, index) => (
                        <TouchableOpacity 
                            key={item.id}
                            onPress={() => navigation.navigate('ProductDetail', { product: products[index] })}
                            className="bg-white rounded-[32px] mb-6 shadow-sm border border-gray-100 overflow-hidden"
                            activeOpacity={0.9}
                        >
                            <View className="relative">
                                <Image source={{ uri: item.image }} className="w-full h-56" resizeMode="cover" />
                                <View className="absolute top-4 left-4 bg-green-700 px-3 py-1.5 rounded-full flex-row items-center">
                                    <MaterialCommunityIcons name="star" size={12} color="white" />
                                    <Text className="text-white text-[10px] font-black ml-1 uppercase">New Arrival</Text>
                                </View>
                                <TouchableOpacity className="absolute top-4 right-4 bg-white/80 p-2 rounded-full backdrop-blur-md">
                                    <MaterialCommunityIcons name="heart-outline" size={20} color="#e11d48" />
                                </TouchableOpacity>
                            </View>
                            
                            <View className="p-5">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.store}</Text>
                                        <Text className="text-xl font-black text-gray-900 leading-6" numberOfLines={2}>{item.name}</Text>
                                    </View>
                                    <Text className="text-green-700 font-black text-xl">{item.price}</Text>
                                </View>
                                
                                <View className="flex-row items-center mt-2 mb-4">
                                    <View className="bg-gray-100 px-2 py-1 rounded-md flex-row items-center mr-2">
                                        <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
                                        <Text className="text-gray-500 text-[10px] font-bold ml-1">Just Added</Text>
                                    </View>
                                    <View className="bg-green-50 px-2 py-1 rounded-md flex-row items-center">
                                        <MaterialCommunityIcons name="truck-delivery-outline" size={12} color="#2e7d32" />
                                        <Text className="text-green-700 text-[10px] font-bold ml-1">Express Delivery</Text>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => goToCartTab(navigation)}
                                    className="bg-gray-900 rounded-2xl py-4 items-center flex-row justify-center"
                                >
                                    <MaterialCommunityIcons name="cart-plus" size={18} color="white" />
                                    <Text className="text-white font-bold ml-2">Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
