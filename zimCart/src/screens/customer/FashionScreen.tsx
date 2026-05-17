import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { goToCartTab } from '@/utils/navigation';
import { STORES } from '@/data/mock/home';

const { width } = Dimensions.get('window');

const FASHION_CATEGORIES = [
    { id: '1', name: 'Men', icon: 'human-male', color: '#f0f9ff', textColor: '#0369a1' },
    { id: '2', name: 'Women', icon: 'human-female', color: '#fdf2f8', textColor: '#be185d' },
    { id: '3', name: 'Footwear', icon: 'shoe-sneaker', color: '#fef2f2', textColor: '#991b1b' },
    { id: '4', name: 'Accessories', icon: 'glasses', color: '#f5f3ff', textColor: '#5b21b6' },
    { id: '5', name: 'Kids', icon: 'baby-face-outline', color: '#f0fdf4', textColor: '#166534' },
];

const TRENDING_FASHION = [
    { 
        id: '1', 
        name: 'Classic Leather Jacket', 
        mart: 'Style Avenue', 
        price: 'Rs. 8,500', 
        oldPrice: 'Rs. 12,000', 
        discount: '30% OFF', 
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '2', 
        name: 'Cotton Summer Dress', 
        mart: 'Rose Boutique', 
        price: 'Rs. 3,200', 
        oldPrice: 'Rs. 4,500', 
        discount: 'Flat RS. 1300', 
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '3', 
        name: 'Urban Sneakers v2', 
        mart: 'Foot Locker', 
        price: 'Rs. 5,400', 
        oldPrice: 'Rs. 6,000', 
        discount: '10% OFF', 
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop' 
    },
];

export default function FashionScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filter stores that have "Clothing" or "Fashion" tags
    const fashionMarts = useMemo(() => {
        const baseMarts = STORES.filter(mart => 
            mart.tags.some(tag => ['Clothing', 'Shoes', 'Accessories', 'Fashion', 'Designer'].includes(tag))
        );
        if (!searchQuery) return baseMarts;
        return baseMarts.filter(mart => 
            mart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mart.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    // Trending filtering logic
    const filteredTrending = useMemo(() => {
        return TRENDING_FASHION.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.mart.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const renderHeader = () => (
        <View className="bg-green-700 pb-8 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            <View className="px-5 flex-row items-center justify-between mb-6 mt-2">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Collection</Text>
                    <Text className="text-white font-black text-xl tracking-tighter">Fashion Hub</Text>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    onPress={() => goToCartTab(navigation)}
                >
                    <MaterialCommunityIcons name="shopping-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="px-5">
                <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Search Styles, Brands, Collections..."
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
                    <TouchableOpacity 
                        className="pl-3 border-l border-gray-100"
                        onPress={() => navigation.navigate('Offers')}
                    >
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
                {/* Visual Categories Grid */}
                <View className="mt-8 px-5">
                    <View className="flex-row flex-wrap justify-between">
                        {FASHION_CATEGORIES.map(cat => (
                            <TouchableOpacity 
                                key={cat.id} 
                                className="items-center mb-6"
                                style={{ width: '18%' }}
                                onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                            >
                                <View 
                                    className={`w-full aspect-square rounded-2xl items-center justify-center mb-2 shadow-sm ${selectedCategory === cat.name ? 'border-2 border-green-700' : ''}`}
                                    style={{ backgroundColor: cat.color }}
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={24} color={cat.textColor} />
                                </View>
                                <Text className={`text-[10px] font-black uppercase ${selectedCategory === cat.name ? 'text-green-700' : 'text-gray-700'}`}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Trending Styles Slider */}
                <View className="mt-6 px-5">
                    <View className="flex-row justify-between items-end mb-4">
                        <View>
                            <Text className="text-2xl font-black text-gray-900 tracking-tighter">Trending Styles</Text>
                            <Text className="text-gray-500 text-xs font-bold">The most wanted looks right now</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Fashion' } })}>
                            <Text className="text-green-700 font-bold text-xs">View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {filteredTrending.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                            {filteredTrending.map(item => (
                                <TouchableOpacity 
                                    key={item.id}
                                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                                    className="bg-white rounded-[32px] border border-gray-100 p-4 mr-4 w-[240px] shadow-sm"
                                >
                                    <View className="relative mb-3">
                                        <Image source={{ uri: item.image }} className="w-full h-48 rounded-2xl" />
                                        <View className="absolute top-2 left-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                                            <Text className="text-white text-[9px] font-black uppercase tracking-widest">{item.discount}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between items-start mb-1">
                                        <View className="flex-1 mr-2">
                                            <Text className="text-gray-400 text-[9px] font-bold uppercase mb-0.5">{item.mart}</Text>
                                            <Text className="text-gray-900 font-black text-sm" numberOfLines={1}>{item.name}</Text>
                                        </View>
                                        <Text className="text-green-700 font-black text-sm">{item.price}</Text>
                                    </View>
                                    <View className="flex-row items-center justify-between mt-2">
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons name="star" size={12} color="#FBBF24" />
                                            <Text className="text-[10px] font-bold text-gray-900 ml-1">4.9</Text>
                                        </View>
                                        <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                                            <MaterialCommunityIcons name="heart-outline" size={18} color="#111827" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="items-center py-10 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                             <MaterialCommunityIcons name="hanger" size={32} color="#D1D5DB" />
                             <Text className="text-gray-400 font-bold mt-2">No matching styles found</Text>
                        </View>
                    )}
                </View>

                {/* Seasonal Banner */}
                <View className="px-5 mt-10">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('FashionWeek')}
                        className="bg-rose-500 rounded-[32px] p-8 flex-row items-center overflow-hidden"
                    >
                        <View className="flex-1 z-10">
                            <Text className="text-white font-black text-3xl leading-8">Winter{"\n"}Clearance</Text>
                            <Text className="text-rose-100 font-bold mt-2 text-sm">Up to 70% off on winter essentials</Text>
                            <View className="bg-white self-start px-4 py-2 rounded-full mt-4">
                                <Text className="text-rose-600 font-black text-[10px] uppercase">Shop Sale</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons 
                            name="snowflake" 
                            size={140} 
                            color="white" 
                            className="absolute -right-8 -bottom-10 opacity-10" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Popular Fashion Marts */}
                <View className="mt-10 px-5">
                    <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Featured Fashion Stores</Text>
                    {fashionMarts.length > 0 ? fashionMarts.map(mart => (
                        <TouchableOpacity 
                            key={mart.id}
                            onPress={() => navigation.navigate('StoreDetail', { mart })}
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
                                        <MaterialCommunityIcons name="ticket-percent-outline" size={12} color="#2e7d32" />
                                        <Text className="text-green-700 text-[10px] font-black ml-1 uppercase">Vouchers Available</Text>
                                    </View>
                                    <View className="bg-gray-50 px-2 py-1 rounded-md flex-row items-center">
                                        <MaterialCommunityIcons name="moped" size={12} color="#6B7280" />
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
