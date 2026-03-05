import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EXPLORE_MARTS, STORES } from '@/data/mock/home';
import LargeMartCard from '@/components/customer/cards/LargeMartCard';
import ModernMartCard from '@/components/customer/cards/ModernMartCard';

const CATEGORIES = [
    { id: '1', name: 'All', icon: 'apps' },
    { id: '2', name: 'Grocery', icon: 'cart-outline' },
    { id: '3', name: 'Electronics', icon: 'laptop' },
    { id: '4', name: 'Fashion', icon: 'tshirt-crew-outline' },
    { id: '5', name: 'Pharmacy', icon: 'medical-bag' },
];

export default function MartsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Combine mock data for a richer list
    const allMarts = [...EXPLORE_MARTS, ...STORES.map(s => ({
        ...s,
        ratingCount: '(100+)',
        time: s.deliveryTime,
        delivery: s.deliveryFee,
        promos: ['Special Discount'],
        isAd: false
    }))];

    const filteredMarts = allMarts.filter(mart => {
        const matchesSearch = mart.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || mart.tags?.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())) || mart.name.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            
            {/* Header */}
            <View className="bg-green-700 pb-6 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
                <View className="px-5 flex-row items-center justify-between mb-6 mt-2">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Discover</Text>
                        <Text className="text-white font-black text-lg">Local Marts</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name="filter-variant" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="px-5">
                    <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
                        <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                        <TextInput 
                            placeholder="Search for marts, stores..."
                            className="flex-1 ml-3 text-base font-medium text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <MaterialCommunityIcons name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Categories Slider */}
                <View className="mt-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                        {CATEGORIES.map(category => (
                            <TouchableOpacity 
                                key={category.id}
                                onPress={() => setSelectedCategory(category.name)}
                                className={`flex-row items-center mr-3 px-5 py-2.5 rounded-full border ${selectedCategory === category.name ? 'bg-green-700 border-green-700 shadow-md shadow-green-200' : 'bg-white border-gray-200'}`}
                            >
                                <MaterialCommunityIcons 
                                    name={category.icon as any} 
                                    size={18} 
                                    color={selectedCategory === category.name ? 'white' : '#4B5563'} 
                                />
                                <Text className={`ml-2 font-bold text-sm ${selectedCategory === category.name ? 'text-white' : 'text-gray-600'}`}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Nearby Count */}
                <View className="px-4 mt-8 mb-4">
                    <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {filteredMarts.length} Marts near you
                    </Text>
                </View>

                {/* Featured Marts Slider */}
                {searchQuery === '' && selectedCategory === 'All' && (
                    <View className="mb-8">
                        <Text className="px-4 text-xl font-black text-gray-900 mb-4">Featured Marts</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                            {STORES.map(mart => (
                                <ModernMartCard 
                                    key={mart.id} 
                                    mart={mart} 
                                    onPress={() => navigation.navigate('StoreDetail', { mart })}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Main List */}
                <View className="px-4">
                    {filteredMarts.map(mart => (
                        <LargeMartCard 
                            key={mart.id} 
                            item={mart} 
                            onPress={() => navigation.navigate('StoreDetail', { mart })}
                        />
                    ))}
                    
                    {filteredMarts.length === 0 && (
                        <View className="items-center justify-center py-20">
                            <MaterialCommunityIcons name="store-off-outline" size={64} color="#E5E7EB" />
                            <Text className="text-gray-400 font-bold mt-4">No marts found match your search</Text>
                        </View>
                    )}
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
                        <Text className="text-green-50/60 text-[10px] font-bold uppercase tracking-widest">2 Items from Marts</Text>
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
