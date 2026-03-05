import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const FILTERS = ['All', 'Popular', 'Low Price', 'High Price', 'New'];

const CATEGORY_PRODUCTS = [
    { id: '1', name: 'ZimCart Fresh Milk 1L', price: 'Rs. 250', oldPrice: 'Rs. 280', image: 'https://images.unsplash.com/photo-1550583726-226ff22580fc?q=80&w=200&auto=format&fit=crop', mart: 'ZimCart Fresh', discount: '10%' },
    { id: '2', name: 'Nestle Yogurt 500g', price: 'Rs. 180', oldPrice: 'Rs. 200', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=200&auto=format&fit=crop', mart: 'Mart 24', discount: '5%' },
    { id: '3', name: 'Fresh Paneer 200g', price: 'Rs. 450', oldPrice: 'Rs. 500', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200&auto=format&fit=crop', mart: 'ZimCart Fresh', discount: '15%' },
    { id: '4', name: 'Cheddar Cheese Slice', price: 'Rs. 580', oldPrice: 'Rs. 650', image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=200&auto=format&fit=crop', mart: 'Local Supermarket', discount: '20%' },
    { id: '5', name: 'Butter 200g', price: 'Rs. 320', oldPrice: 'Rs. 350', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=200&auto=format&fit=crop', mart: 'ZimCart Fresh', discount: '8%' },
    { id: '6', name: 'Whipped Cream', price: 'Rs. 420', oldPrice: 'Rs. 480', image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=200&auto=format&fit=crop', mart: 'ZimCart Fresh', discount: '12%' },
];

export default function CategoryDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const category = route.params?.category || { name: 'Aisle', color: '#f3f4f6' };
    
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
                <View className="flex-row flex-wrap justify-between">
                    {CATEGORY_PRODUCTS.map(product => (
                        <TouchableOpacity 
                            key={product.id}
                            className="bg-white rounded-[32px] mb-6 border border-gray-50 shadow-sm"
                            style={{ width: (width - 50) / 2 }}
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('ProductDetail', { product })}
                        >
                            <View className="relative">
                                <Image source={{ uri: product.image }} className="w-full h-40 rounded-t-[32px]" />
                                <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded-lg">
                                    <Text className="text-white text-[9px] font-black">{product.discount} OFF</Text>
                                </View>
                                <TouchableOpacity className="absolute bottom-3 right-3 bg-green-700 w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-green-900/40">
                                    <MaterialCommunityIcons name="plus" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View className="p-4">
                                <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">{product.mart}</Text>
                                <Text className="text-xs font-black text-gray-900" numberOfLines={1}>{product.name}</Text>
                                <View className="flex-row items-center mt-2">
                                    <Text className="text-green-700 font-black text-sm">{product.price}</Text>
                                    <Text className="text-gray-400 text-[10px] line-through ml-2">{product.oldPrice}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
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
