import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const STORE_CATEGORIES = [
    'All', 'Popular', 'New Essentials', 'Beverages', 'Bakery', 'Frozen', 'Snacks'
];

const STORE_PRODUCTS = [
    { id: '1', name: 'Premium Milk 1L', price: 'Rs. 250', image: 'https://images.unsplash.com/photo-1550583726-226ff22580fc?q=80&w=200&auto=format&fit=crop', category: 'Beverages' },
    { id: '2', name: 'Fresh White Bread', price: 'Rs. 120', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', category: 'Bakery' },
    { id: '3', name: 'Organic Eggs (12)', price: 'Rs. 450', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=200&auto=format&fit=crop', category: 'Popular' },
    { id: '4', name: 'Unsalted Butter 200g', price: 'Rs. 580', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=200&auto=format&fit=crop', category: 'Essentials' },
    { id: '5', name: 'Potato Chips', price: 'Rs. 180', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=200&auto=format&fit=crop', category: 'Snacks' },
    { id: '6', name: 'Orange Juice 1L', price: 'Rs. 320', image: 'https://images.unsplash.com/photo-1621506289937-4c40aa60144c?q=80&w=200&auto=format&fit=crop', category: 'Beverages' },
];

export default function StoreDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const mart = route.params?.mart || { 
        name: 'ZimCart Fresh Mart', 
        rating: '4.8', 
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
        tags: ['Grocery', 'Dairy', 'Fresh']
    };
    
    const [selectedCategory, setSelectedCategory] = useState('All');

    const renderHeader = () => (
        <View className="relative">
            <View className="h-64 w-full">
                <Image source={{ uri: mart.image }} className="w-full h-full object-cover" />
                <View className="absolute inset-0 bg-black/30" />
            </View>
            
            <View className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: insets.top }}>
                <View className="px-5 flex-row items-center justify-between h-12">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-black/20 rounded-full items-center justify-center border border-white/20"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-row">
                        <TouchableOpacity className="w-10 h-10 bg-black/20 rounded-full items-center justify-center border border-white/20 mr-2">
                            <MaterialCommunityIcons name="magnify" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-10 h-10 bg-black/20 rounded-full items-center justify-center border border-white/20">
                            <MaterialCommunityIcons name="share-variant" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="bg-white px-5 pt-6 pb-4 -mt-10 rounded-t-[40px] shadow-2xl">
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <Text className="text-2xl font-black text-gray-900 leading-8">{mart.name}</Text>
                        <Text className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-widest">{mart.tags.join(' • ')}</Text>
                    </View>
                    <View className="bg-green-50 px-3 py-2 rounded-2xl flex-row items-center">
                        <MaterialCommunityIcons name="star" size={16} color="#2e7d32" />
                        <Text className="text-green-800 font-bold ml-1">{mart.rating}</Text>
                        <Text className="text-green-800/60 text-xs ml-0.5">(500+)</Text>
                    </View>
                </View>

                <View className="flex-row items-center mt-4 border-t border-gray-50 pt-4">
                    <View className="flex-row items-center mr-6">
                        <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-2">
                            <MaterialCommunityIcons name="clock-outline" size={18} color="#2563eb" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-gray-400 font-bold uppercase">Delivery</Text>
                            <Text className="text-xs font-black text-gray-900">{mart.deliveryTime}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center mr-2">
                            <MaterialCommunityIcons name="moped" size={18} color="#2e7d32" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-gray-400 font-bold uppercase">Fee</Text>
                            <Text className="text-xs font-black text-gray-900">Rs. 45</Text>
                        </View>
                    </View>
                </View>

                <View className="mt-6 bg-pink-50 p-4 rounded-3xl flex-row items-center border border-pink-100">
                    <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="#db2777" />
                    <View className="ml-3 flex-1">
                        <Text className="text-pink-900 font-black text-sm">Save Rs. 200 on first order</Text>
                        <Text className="text-pink-700/70 text-[10px] font-bold">Use code: ZIMFRESH • Min Rs. 1000</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#db2777" />
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            <ScrollView 
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[2]}
            >
                {renderHeader()}
                
                {/* Search in store */}
                <View className="px-5 mb-4">
                    <View className="bg-gray-100 rounded-2xl flex-row items-center px-4 py-3">
                        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
                        <TextInput 
                            placeholder={`Search in ${mart.name}`}
                            className="flex-1 ml-2 font-bold text-sm text-gray-800"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Categories Tab Bar */}
                <View className="bg-white border-b border-gray-50 pt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-4">
                        {STORE_CATEGORIES.map(cat => (
                            <TouchableOpacity 
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                className={`mr-4 px-6 py-2.5 rounded-2xl ${selectedCategory === cat ? 'bg-green-700' : 'bg-gray-50'}`}
                            >
                                <Text className={`font-black text-xs uppercase tracking-tighter ${selectedCategory === cat ? 'text-white' : 'text-gray-500'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Product Listing */}
                <View className="px-5 pt-6 pb-20">
                    <Text className="text-lg font-black text-gray-900 mb-6 tracking-tighter uppercase">{selectedCategory} Items</Text>
                    
                    <View className="flex-row flex-wrap justify-between">
                        {STORE_PRODUCTS.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map(product => (
                            <TouchableOpacity 
                                key={product.id}
                                className="bg-white rounded-[32px] mb-6 border border-gray-50 shadow-sm"
                                style={{ width: (width - 50) / 2 }}
                                activeOpacity={0.9}
                                onPress={() => navigation.navigate('ProductDetail', { product: { ...product, mart: mart.name } })}
                            >
                                <View className="relative">
                                    <Image source={{ uri: product.image }} className="w-full h-40 rounded-t-[32px]" />
                                    <TouchableOpacity className="absolute bottom-3 right-3 bg-green-700 w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-green-900/40">
                                        <MaterialCommunityIcons name="plus" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <View className="p-4">
                                    <Text className="text-xs font-black text-gray-900" numberOfLines={1}>{product.name}</Text>
                                    <Text className="text-green-700 font-black text-sm mt-1">{product.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Premium Professional-Grade Cart Bar */}
            <View 
                className="absolute left-0 right-0 items-center z-50 px-5" 
                style={{ bottom: Math.max(insets.bottom, 20) }}
            >
                <TouchableOpacity 
                    className="bg-green-700 h-[70px] rounded-[30px] flex-row items-center px-6 shadow-2xl shadow-green-900/60 border border-white/10"
                    style={{ width: '100%', maxWidth: 550 }}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                >
                    <View className="bg-white rounded-2xl w-12 h-12 items-center justify-center mr-4 shadow-sm">
                        <Text className="text-green-700 font-black text-lg">2</Text>
                    </View>
                    
                    <View className="flex-1">
                        <Text className="text-white font-black text-lg tracking-tight">View your Cart</Text>
                        <Text className="text-green-50/60 text-[10px] font-bold uppercase tracking-widest">2 Items • {mart.name}</Text>
                    </View>

                    <View className="h-10 w-[1.5px] bg-white/10 mx-4 rounded-full" />
                    
                    <View className="items-end">
                        <Text className="text-white font-black text-lg">Rs. 450</Text>
                        <Text className="text-green-50/60 text-[8px] font-bold uppercase">Estimated Total</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
