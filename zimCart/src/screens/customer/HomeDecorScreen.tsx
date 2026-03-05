import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { STORES } from '@/data/mock/home';

const { width } = Dimensions.get('window');

const HOME_CATEGORIES = [
    { id: '1', name: 'Furniture', icon: 'sofa', color: '#fef3c7', textColor: '#92400e' },
    { id: '2', name: 'Kitchen', icon: 'silverware-fork-knife', color: '#ecfccb', textColor: '#3f6212' },
    { id: '3', name: 'Decor', icon: 'lamps-outline', color: '#f5f3ff', textColor: '#5b21b6' },
    { id: '4', name: 'Bedding', icon: 'bed-outline', color: '#e0f2fe', textColor: '#075985' },
    { id: '5', name: 'Garden', icon: 'flower-outline', color: '#f0fdf4', textColor: '#166534' },
];

const TOP_HOME_DEALS = [
    { 
        id: '1', 
        name: 'Velvet Sofa Set', 
        mart: 'Home Comfort', 
        price: 'Rs. 45,000', 
        oldPrice: 'Rs. 55,000', 
        discount: 'RS. 10k OFF', 
        category: 'Furniture',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '2', 
        name: 'Modern Table Lamp', 
        mart: 'Lux Decor', 
        price: 'Rs. 3,200', 
        oldPrice: 'Rs. 4,500', 
        discount: '-30%', 
        category: 'Decor',
        image: 'https://images.unsplash.com/photo-1507473884658-c70b6557453e?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '3', 
        name: 'Cotton Bed Sheet', 
        mart: 'Bed & Bath', 
        price: 'Rs. 2,400', 
        oldPrice: 'Rs. 3,000', 
        discount: 'BEST BUY', 
        category: 'Bedding',
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&auto=format&fit=crop' 
    },
];

export default function HomeDecorScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Intelligent filtering engine for Home & Decor Vertical
    const filteredDeals = useMemo(() => {
        return TOP_HOME_DEALS.filter(deal => {
            const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || deal.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const homeMarts = useMemo(() => {
        const baseMarts = STORES.filter(mart => 
            mart.tags.some(tag => ['Home', 'Furniture', 'Kitchen', 'Electronics', 'Appliances'].includes(tag))
        );
        if (!searchQuery) return baseMarts;
        return baseMarts.filter(mart => 
            mart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mart.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

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
                    <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Upgrade Your</Text>
                    <Text className="text-white font-black text-xl tracking-tighter">Home & Decor</Text>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                >
                    <MaterialCommunityIcons name="shopping-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="px-5">
                <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Search Furniture, Decor, Kitchenware..."
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
                        {HOME_CATEGORIES.map(cat => (
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
                                <Text className={`text-[10px] font-black uppercase tracking-tighter ${selectedCategory === cat.name ? 'text-green-700' : 'text-gray-700'}`}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Top Deals Slider */}
                <View className="mt-6 px-5">
                    <View className="flex-row justify-between items-end mb-4">
                        <View>
                            <Text className="text-2xl font-black text-gray-900 tracking-tighter">Home Makeover</Text>
                            <Text className="text-gray-500 text-xs font-bold">Best deals for your living space</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Home' } })}>
                            <Text className="text-green-700 font-bold text-xs">View All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {filteredDeals.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                            {filteredDeals.map(item => (
                                <TouchableOpacity 
                                    key={item.id}
                                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                                    className="bg-white rounded-[32px] border border-gray-100 p-4 mr-4 w-[240px] shadow-sm"
                                >
                                    <View className="relative mb-3">
                                        <Image source={{ uri: item.image }} className="w-full h-40 rounded-2xl" />
                                        <View className="absolute top-2 left-2 bg-orange-500 px-3 py-1 rounded-lg">
                                            <Text className="text-white text-[9px] font-black uppercase tracking-widest">{item.discount}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase mb-0.5">{item.mart}</Text>
                                    <Text className="text-gray-900 font-black text-sm mb-2" numberOfLines={1}>{item.name}</Text>
                                    <View className="flex-row items-center justify-between mt-1">
                                        <View>
                                            <Text className="text-green-700 font-black text-base">{item.price}</Text>
                                            <Text className="text-gray-400 text-[10px] line-through">{item.oldPrice}</Text>
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                                            className="bg-gray-900 w-10 h-10 items-center justify-center rounded-xl"
                                        >
                                            <MaterialCommunityIcons name="cart-plus" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="items-center py-10 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 mx-1">
                             <MaterialCommunityIcons name="sofa-outline" size={32} color="#D1D5DB" />
                             <Text className="text-gray-400 font-bold mt-2">No deals found in this category</Text>
                        </View>
                    )}
                </View>

                {/* Interior Promo Banner */}
                <View className="px-5 mt-10">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Tech')}
                        className="bg-teal-700 rounded-[32px] p-8 flex-row items-center overflow-hidden"
                    >
                        <View className="flex-1 z-10">
                            <Text className="text-white font-black text-3xl leading-8">Smart Home{"\n"}Living</Text>
                            <Text className="text-teal-100 font-bold mt-2 text-sm">Automate your lifestyle with modern solutions</Text>
                            <View className="bg-white self-start px-4 py-2 rounded-full mt-4">
                                <Text className="text-teal-700 font-black text-[10px] uppercase">Shop Smart</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons 
                            name="home-lightning-bolt-outline" 
                            size={140} 
                            color="white" 
                            className="absolute -right-8 -bottom-10 opacity-10" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Popular Home Stores */}
                <View className="mt-10 px-5">
                    <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Premium Home Marts</Text>
                    {homeMarts.length > 0 ? homeMarts.map(mart => (
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
                                        <MaterialCommunityIcons name="truck-delivery-outline" size={12} color="#2e7d32" />
                                        <Text className="text-green-700 text-[10px] font-black ml-1 uppercase">Same Day Delivery</Text>
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
                            <Text className="text-gray-400 font-bold mt-2">No marts found for "{searchQuery}"</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
