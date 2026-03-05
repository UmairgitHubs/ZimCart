import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { STORES } from '@/data/mock/home';

const { width } = Dimensions.get('window');

const TECH_CATEGORIES = [
    { id: '1', name: 'Mobiles', icon: 'cellphone', color: '#f0f9ff', textColor: '#0369a1' },
    { id: '2', name: 'Laptops', icon: 'laptop', color: '#fef2f2', textColor: '#991b1b' },
    { id: '3', name: 'Audio', icon: 'headphones', color: '#f5f3ff', textColor: '#5b21b6' },
    { id: '4', name: 'Gaming', icon: 'controller-classic', color: '#f0fdf4', textColor: '#166534' },
    { id: '5', name: 'Watches', icon: 'watch-variant', color: '#fff7ed', textColor: '#9a3412' },
];

const TECH_DEALS = [
    { 
        id: '1', 
        name: 'iPhone 15 Pro', 
        mart: 'TechWorld Express', 
        price: 'Rs. 340,000', 
        oldPrice: 'Rs. 360,000', 
        discount: 'Flat Rs. 20,000', 
        category: 'Mobiles',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '2', 
        name: 'MacBook Air M2', 
        mart: 'Apple Store', 
        price: 'Rs. 285,000', 
        oldPrice: 'Rs. 310,000', 
        discount: 'Save Rs. 25,000', 
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '3', 
        name: 'Sony WH-1000XM5', 
        mart: 'Gadget Core', 
        price: 'Rs. 85,000', 
        oldPrice: 'Rs. 95,000', 
        discount: '10% OFF', 
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1618366712214-8c07623155c2?q=80&w=400&auto=format&fit=crop' 
    },
];

export default function TechScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Dynamic filtering engine
    const filteredDeals = useMemo(() => {
        return TECH_DEALS.filter(deal => {
            const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || deal.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const techMarts = useMemo(() => {
        const baseMarts = STORES.filter(mart => 
            mart.tags.some(tag => ['Electronics', 'Mobiles', 'Laptops', 'Gadgets', 'Tech'].includes(tag))
        );
        if (!searchQuery) return baseMarts;
        return baseMarts.filter(mart => mart.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    const renderHeader = () => (
        <View className="bg-green-700 pb-6 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            <View className="px-5 flex-row items-center justify-between mb-6 mt-2">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Explore</Text>
                    <Text className="text-white font-black text-lg">Tech & Gadgets</Text>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                >
                    <MaterialCommunityIcons name="cart-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="px-5">
                <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Search Phones, Laptops, Accessories..."
                        className="flex-1 ml-3 text-base font-medium text-gray-800"
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} className="mr-2">
                            <MaterialCommunityIcons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity className="pl-3 border-l border-gray-100">
                        <MaterialCommunityIcons name="tune" size={20} color="#2e7d32" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Horizontal Categories */}
                <View className="mt-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
                        {TECH_CATEGORIES.map(cat => (
                            <TouchableOpacity 
                                key={cat.id} 
                                className="items-center mr-6"
                                onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                            >
                                <View 
                                    className={`w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm ${selectedCategory === cat.name ? 'border-2 border-green-700' : ''}`}
                                    style={{ backgroundColor: cat.color }}
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.textColor} />
                                </View>
                                <Text className={`text-[11px] font-black uppercase tracking-tighter ${selectedCategory === cat.name ? 'text-green-700' : 'text-gray-700'}`}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Tech Deals Section */}
                <View className="mt-10 px-5">
                    <View className="flex-row justify-between items-end mb-4">
                        <View>
                            <Text className="text-2xl font-black text-gray-900 tracking-tighter">Hot Tech Deals</Text>
                            <Text className="text-gray-500 text-xs font-bold">Best prices on top-tier gadgets</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Offers')}><Text className="text-blue-600 font-bold text-xs">View All</Text></TouchableOpacity>
                    </View>
                    
                    {filteredDeals.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                            {filteredDeals.map(deal => (
                                <TouchableOpacity 
                                    key={deal.id}
                                    onPress={() => navigation.navigate('ProductDetail', { product: deal })}
                                    className="bg-white rounded-[32px] border border-gray-100 p-4 mr-4 w-[220px] shadow-sm"
                                >
                                    <View className="relative mb-3">
                                        <Image source={{ uri: deal.image }} className="w-full h-36 rounded-2xl" />
                                        <View className="absolute top-2 left-2 bg-green-700 px-3 py-1 rounded-lg">
                                            <Text className="text-white text-[10px] font-black uppercase">Deal</Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase mb-0.5">{deal.mart}</Text>
                                    <Text className="text-gray-900 font-bold text-sm mb-2" numberOfLines={1}>{deal.name}</Text>
                                    <View className="flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-green-700 font-black text-base">{deal.price}</Text>
                                            <Text className="text-gray-400 text-[10px] line-through">{deal.oldPrice}</Text>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                                            className="bg-gray-900 w-10 h-10 items-center justify-center rounded-2xl"
                                        >
                                            <MaterialCommunityIcons name="plus" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="items-center py-10 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                            <MaterialCommunityIcons name="lightning-bolt-outline" size={32} color="#D1D5DB" />
                            <Text className="text-gray-400 font-bold mt-2">No active deals found</Text>
                        </View>
                    )}
                </View>

                {/* Gaming Promo Banner */}
                <View className="px-5 mt-10">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Gaming' } })}
                        className="bg-gray-900 rounded-[32px] p-6 flex-row items-center overflow-hidden"
                    >
                        <View className="flex-1 z-10">
                            <Text className="text-white font-black text-2xl leading-7">Gaming Hub{"\n"}Level Up Today</Text>
                            <Text className="text-green-400 font-bold mt-2 text-xs">Consoles & Accessories in stock</Text>
                        </View>
                        <MaterialCommunityIcons 
                            name="controller-classic" 
                            size={100} 
                            color="white" 
                            className="absolute -right-4 -bottom-4 opacity-20" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Popular Tech Stores */}
                <View className="mt-10 px-5">
                    <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Trusted Tech Retailers</Text>
                    {techMarts.length > 0 ? techMarts.map(mart => (
                        <TouchableOpacity 
                            key={mart.id}
                            onPress={() => navigation.navigate('StoreDetail', { store: mart })}
                            className="bg-white rounded-3xl mb-6 flex-row items-center border border-gray-100 shadow-sm"
                            activeOpacity={0.9}
                        >
                            <Image source={{ uri: mart.image }} className="w-24 h-24 rounded-2xl m-2" resizeMode="cover" />
                            <View className="flex-1 pr-4 ml-2">
                                <View className="flex-row justify-between items-start">
                                    <Text className="text-lg font-black text-gray-900 flex-1 mr-2" numberOfLines={1}>{mart.name}</Text>
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                                        <Text className="text-xs font-bold text-gray-900 ml-1">{mart.rating}</Text>
                                    </View>
                                </View>
                                <Text className="text-gray-500 text-xs font-medium mb-3" numberOfLines={1}>{mart.tags.join(', ')}</Text>
                                <View className="flex-row items-center">
                                    <View className="bg-green-50 px-2 py-1 rounded-md flex-row items-center mr-2">
                                        <MaterialCommunityIcons name="moped" size={12} color="#2e7d32" />
                                        <Text className="text-green-700 text-[10px] font-black ml-1 uppercase">{mart.deliveryFee === 'Free' ? 'FREE' : mart.deliveryFee}</Text>
                                    </View>
                                    <View className="bg-gray-50 px-2 py-1 rounded-md flex-row items-center">
                                        <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
                                        <Text className="text-gray-500 text-[10px] font-bold ml-1">{mart.deliveryTime}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )) : (
                        <View className="items-center py-10">
                            <MaterialCommunityIcons name="store-search-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 font-bold mt-2">No retailers found for "{searchQuery}"</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
