import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, useWindowDimensions, Platform, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const PET_CATEGORIES = [
    { id: '1', name: 'Dogs', icon: 'dog', color: '#F0FDF4', iconColor: '#15803d' },
    { id: '2', name: 'Cats', icon: 'cat', color: '#F0F9FF', iconColor: '#0284C7' },
    { id: '3', name: 'Birds', icon: 'bird', color: '#FDF2F8', iconColor: '#DB2777' },
    { id: '4', name: 'Fish', icon: 'fish', color: '#ECFDF5', iconColor: '#059669' },
];

const BEST_SELLERS = [
    { id: '1', name: 'Royal Canin Adult', price: 'Rs. 4,500', rating: 4.8, image: 'https://images.unsplash.com/photo-1589924691106-07a2c85b5b0c?q=80&w=300&auto=format&fit=crop', weight: '2kg', category: 'Dogs' },
    { id: '2', name: 'Pedigree Chopped', price: 'Rs. 1,200', rating: 4.5, image: 'https://images.unsplash.com/photo-1585837214468-459f0f90e541?q=80&w=300&auto=format&fit=crop', weight: '1.2kg', category: 'Dogs' },
];

export default function PetCareScreen() {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    
    // Functional States
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return BEST_SELLERS;
        return BEST_SELLERS.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Precise Responsive Calculations
    const heroHeight = Math.min(height * 0.6, width * 1.2);
    const gridPadding = 20;
    const gridGap = 16;
    const cardWidth = (width - (gridPadding * 2) - gridGap) / 2;

    return (
        <View className="flex-1 bg-white">
            <StatusBar style={isSearchVisible ? "dark" : "light"} />
            
            {/* Cinematic Floating Header */}
            <View 
                style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10) }} 
                className={`absolute top-0 left-0 right-0 z-30 transition-colors duration-300 ${isSearchVisible ? 'bg-white shadow-sm' : ''}`}
            >
                {isSearchVisible ? (
                    <View className="px-5 h-14 flex-row items-center">
                        <TouchableOpacity onPress={() => setIsSearchVisible(false)} className="mr-3">
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
                        </TouchableOpacity>
                        <TextInput 
                            autoFocus
                            placeholder="Search pet supplies..."
                            className="flex-1 h-10 font-bold text-gray-900"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <MaterialCommunityIcons name="close-circle" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View className="px-5 h-14 flex-row items-center justify-between">
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-black/30 rounded-full items-center justify-center border border-white/20"
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-row">
                            <TouchableOpacity 
                                onPress={() => setIsSearchVisible(true)}
                                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center border border-white/20 mr-2"
                            >
                                <MaterialCommunityIcons name="magnify" size={22} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setIsFavourite(!isFavourite)}
                                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center border border-white/20"
                            >
                                <MaterialCommunityIcons name={isFavourite ? "heart" : "heart-outline"} size={22} color={isFavourite ? "#EF4444" : "white"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                bounces={false}
            >
                {/* Immersive Hero Section */}
                <View style={{ height: heroHeight }} className="w-full relative">
                    <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1000&auto=format&fit=crop' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/25" />
                    
                    {/* Hero Overlay Content */}
                    <View className="absolute bottom-16 left-6 right-6">
                        <View className="bg-green-700/90 self-start px-3 py-1 rounded-lg mb-4">
                            <Text className="text-white font-black text-[10px] uppercase tracking-widest">Premium Care</Text>
                        </View>
                        <Text className="text-white font-black text-4xl sm:text-5xl leading-[1.1]">Love Your{'\n'}Pets Back</Text>
                        <Text className="text-white/80 font-bold text-lg mt-3 italic">Curated essentials for every furry friend</Text>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Pet Care' } })}
                            className="bg-white self-start px-8 py-4 rounded-full mt-8 shadow-2xl shadow-black/50"
                        >
                            <Text className="text-gray-900 font-black uppercase tracking-widest text-[11px]">Browse Supplies</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Species Hub */}
                <View className="px-5 -mt-10">
                    <View className="bg-white rounded-[40px] p-6 shadow-2xl shadow-black/10 flex-row justify-between border border-gray-50 flex-wrap">
                        {PET_CATEGORIES.map(cat => (
                            <TouchableOpacity 
                                key={cat.id} 
                                className="items-center mb-2"
                                style={{ width: (width - 64) / 4 }}
                                onPress={() => navigation.navigate('CategoryDetail', { category: { name: cat.name, filter: 'Pet Supplies' } })}
                            >
                                <View 
                                    style={{ backgroundColor: cat.color }} 
                                    className="w-14 h-14 rounded-[20px] items-center justify-center shadow-sm border border-black/5"
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.iconColor} />
                                </View>
                                <Text className="text-gray-900 font-black text-[9px] uppercase mt-2 tracking-tighter" numberOfLines={1}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Best Sellers Grid */}
                <View className="mt-14 px-5">
                    <View className="flex-row justify-between items-center mb-8">
                        <View>
                            <Text className="text-gray-900 font-black text-3xl tracking-tight">Best Sellers</Text>
                            <View className="h-1 w-12 bg-green-700 rounded-full mt-2" />
                        </View>
                        <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center border border-green-100">
                            <MaterialCommunityIcons name="fire" size={24} color="#15803d" />
                        </View>
                    </View>
                    
                    <View className="flex-row flex-wrap justify-between">
                        {filteredProducts.length > 0 ? filteredProducts.map(product => (
                            <TouchableOpacity 
                                key={product.id} 
                                style={{ width: cardWidth }}
                                onPress={() => navigation.navigate('ProductDetail', { product: { ...product, mart: 'Pet Mart Central' } })}
                                className="bg-gray-50 rounded-[36px] p-4 mb-4 border border-gray-100 shadow-sm"
                            >
                                <View className="relative">
                                    <View style={{ height: cardWidth * 1.1 }} className="w-full">
                                        <Image source={{ uri: product.image }} className="w-full h-full rounded-[28px]" />
                                    </View>
                                    <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg flex-row items-center border border-gray-100">
                                        <MaterialCommunityIcons name="star" size={12} color="#FBBF24" />
                                        <Text className="text-gray-900 font-black text-[10px] ml-1">{product.rating}</Text>
                                    </View>
                                </View>
                                
                                <View className="mt-4">
                                    <Text className="text-gray-900 font-black text-sm mb-1 leading-4" numberOfLines={2}>{product.name}</Text>
                                    <Text className="text-gray-400 font-bold text-[10px] uppercase mb-4">{product.weight}</Text>
                                    
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-green-700 font-black text-base">{product.price}</Text>
                                        <TouchableOpacity 
                                            onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                                            className="bg-white w-9 h-9 rounded-xl items-center justify-center shadow-md border border-gray-100 active:bg-gray-50"
                                        >
                                            <MaterialCommunityIcons name="plus" size={20} color="#15803d" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )) : (
                            <View className="w-full items-center py-10 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                                <MaterialCommunityIcons name="dog-side" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 font-bold mt-4">No matching supplies found</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
