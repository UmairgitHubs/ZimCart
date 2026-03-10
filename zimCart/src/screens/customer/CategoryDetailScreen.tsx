import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProducts } from '@/hooks/useMarketplace';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

const FILTERS = ['All', 'Popular', 'Low Price', 'High Price', 'New'];

export default function CategoryDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const category = route.params?.category || { name: 'Aisle', color: '#f3f4f6', id: null };
    
    // Modern Technique: React Query for dynamic product fetching
    const { data: productsData, isLoading } = useProducts({ 
        categoryId: category.id 
    });

    const products = productsData?.products || [];
    const [activeFilter, setActiveFilter] = useState('All');

    const renderHeader = () => (
        <View className="bg-white px-5 pb-6 rounded-b-[40px] shadow-sm z-10" style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center justify-between mt-2 mb-6">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Shop by Aisle</Text>
                    <Text className="text-gray-900 font-black text-xl">{category.name}</Text>
                </View>
                <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="cart-outline" size={20} color="#111827" />
                </TouchableOpacity>
            </View>

            <View className="bg-gray-100 rounded-2xl flex-row items-center px-4 py-3 mb-6">
                <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                <TextInput 
                    placeholder={`Search in ${category.name}`}
                    className="flex-1 ml-3 text-base font-medium text-gray-800"
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                {FILTERS.map(filter => (
                    <TouchableOpacity 
                        key={filter}
                        onPress={() => setActiveFilter(filter)}
                        className={`mr-3 px-6 py-2.5 rounded-full border ${activeFilter === filter ? 'bg-green-700 border-green-700' : 'bg-white border-gray-200'}`}
                    >
                        <Text className={`font-bold text-xs uppercase tracking-tighter ${activeFilter === filter ? 'text-white' : 'text-gray-500'}`}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            <StatusBar style="dark" />
            
            {renderHeader()}

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
                className="px-5"
            >
                {/* Popular Brands in this Aisle */}
                <View className="mb-8">
                    <Text className="text-lg font-black text-gray-900 mb-4 tracking-tighter uppercase">Featured Brands</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                        {['Nestle', 'Olpers', 'Adam\'s', 'Nurpur', 'DayFresh'].map((brand, idx) => (
                            <TouchableOpacity key={idx} className="mr-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm items-center justify-center w-28">
                                <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-2">
                                    <MaterialCommunityIcons name="seal-variant" size={24} color="#2e7d32" />
                                </View>
                                <Text className="font-bold text-xs text-gray-700">{brand}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Main Product List */}
                <Text className="text-lg font-black text-gray-900 mb-6 tracking-tighter uppercase">Available Products</Text>
                
                {isLoading ? (
                    <View className="py-20 items-center justify-center">
                        <ActivityIndicator size="large" color="#2e7d32" />
                        <Text className="text-gray-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Fetching Catalog...</Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap justify-between">
                        {products.length > 0 ? products.map((product: any) => (
                            <TouchableOpacity 
                                key={product.id}
                                className="bg-white rounded-[32px] mb-6 border border-gray-50 shadow-sm"
                                style={{ width: (width - 50) / 2 }}
                                activeOpacity={0.9}
                                onPress={() => navigation.navigate('ProductDetail', { product })}
                            >
                                <View className="relative">
                                    <Image 
                                        source={{ uri: product.images?.[0] || 'https://via.placeholder.com/200' }} 
                                        className="w-full h-40 rounded-t-[32px]" 
                                    />
                                    {(product.discountPercentage > 0 || product.discountPrice > 0) && (
                                        <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded-lg">
                                            <Text className="text-white text-[9px] font-black">
                                                {product.discountPercentage ? `${product.discountPercentage}%` : 'DEAL'} OFF
                                            </Text>
                                        </View>
                                    )}
                                    <TouchableOpacity className="absolute bottom-3 right-3 bg-green-700 w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-green-900/40">
                                        <MaterialCommunityIcons name="plus" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <View className="p-4">
                                    <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">{product.store?.name || 'ZimCart Store'}</Text>
                                    <Text className="text-xs font-black text-gray-900" numberOfLines={1}>{product.name}</Text>
                                    <View className="flex-row items-center mt-2">
                                        <Text className="text-green-700 font-black text-sm">Rs. {product.discountPrice || product.price}</Text>
                                        {product.discountPrice > 0 && product.price > product.discountPrice && (
                                            <Text className="text-gray-400 text-[10px] line-through ml-2">Rs. {product.price}</Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )) : (
                            <View className="w-full py-20 items-center justify-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                                <MaterialCommunityIcons name="package-variant" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 font-bold mt-4 uppercase tracking-widest text-[10px]">No products in this aisle yet</Text>
                            </View>
                        )}
                    </View>
                )}
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
                        <Text className="text-green-50/60 text-[10px] font-bold uppercase tracking-widest">2 Items in {category.name}</Text>
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
