import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GROCERY_BUNDLES = [
    {
        id: 'gb1',
        name: 'Family Breakfast Box',
        items: ['2 Dozen Eggs', '2L Milk', 'White Bread', 'Butter', 'Jam'],
        price: 'Rs. 1,450',
        oldPrice: 'Rs. 1,800',
        savings: 'Save Rs. 350',
        rating: 4.8,
        reviews: '1.2k',
        mart: 'Fresh Mart',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'gb2',
        name: 'Fresh Greens Pack',
        items: ['Spinach', 'Coriander', 'Mint', 'Green Chilies', 'Cucumber'],
        price: 'Rs. 450',
        oldPrice: 'Rs. 600',
        savings: 'Save Rs. 150',
        rating: 4.9,
        reviews: '850',
        mart: 'Organic Express',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'gb3',
        name: 'Monthly Pantry Refill',
        items: ['5kg Basmati Rice', '2L Oil', '2kg Sugar', '1kg Daal'],
        price: 'Rs. 3,800',
        oldPrice: 'Rs. 4,500',
        savings: 'Save Rs. 700',
        rating: 4.7,
        reviews: '3.4k',
        mart: 'Bulk Mart',
        image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'gb4',
        name: 'BBQ Meat Platter',
        items: ['1kg Chicken Wings', '500g Beef Seekh', 'Coal Pack'],
        price: 'Rs. 2,900',
        oldPrice: 'Rs. 3,400',
        savings: 'Save Rs. 500',
        rating: 4.8,
        reviews: '520',
        mart: 'Meat Masters',
        image: 'https://images.unsplash.com/photo-1555939594-58d6cb567ad1?q=80&w=400&auto=format&fit=crop'
    }
];

export default function GroceryBundleScreen() {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const renderHeader = () => (
        <View className="bg-green-700 pb-12 rounded-b-[50px] shadow-2xl overflow-hidden" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            
            {/* Background Decorative Elements */}
            <View className="absolute top-0 right-0 left-0 bottom-0 opacity-10">
                <MaterialCommunityIcons name="basket-outline" size={300} color="white" style={{ position: 'absolute', right: -50, top: -50 }} />
                <MaterialCommunityIcons name="leaf" size={200} color="white" style={{ position: 'absolute', left: -30, bottom: -20 }} />
            </View>

            <View className="px-5 flex-row items-center justify-between mb-8 mt-2 z-10">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center shadow-lg"
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-white/70 text-[10px] font-black uppercase tracking-[4px]">Mega Savings</Text>
                    <Text className="text-white font-black text-2xl tracking-tighter">Grocery Bundles</Text>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center shadow-lg"
                    activeOpacity={0.7}
                    onPress={() => {/* Share bundle logic */}}
                >
                    <MaterialCommunityIcons name="share-variant-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="px-8 items-center z-10">
                <View className="bg-white/20 px-6 py-2 rounded-full border border-white/30 backdrop-blur-md">
                    <Text className="text-white font-black text-xs uppercase tracking-widest text-center">Save up to 30% on Curated Boxes</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Benefits Grid */}
                <View className="px-5 -mt-2 z-20">
                    <View className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 flex-row justify-between border border-gray-50">
                        <View className="items-center flex-1">
                            <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#2e7d32" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Free</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Shipping</Text>
                        </View>
                        <View className="w-[1px] h-12 bg-gray-100 self-center" />
                        <View className="items-center flex-1">
                            <View className="w-12 h-12 bg-amber-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="cash-check" size={24} color="#b45309" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Bulk</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Pricing</Text>
                        </View>
                        <View className="w-[1px] h-12 bg-gray-100 self-center" />
                        <View className="items-center flex-1">
                            <View className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="heart-flash" size={24} color="#dc2626" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Expert</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Curated</Text>
                        </View>
                    </View>
                </View>

                {/* Bundle Catalog */}
                <View className="mt-10 px-5">
                    <Text className="text-2xl font-black text-gray-900 mb-6 tracking-tighter px-1">Curated Value Bundles</Text>
                    
                    {GROCERY_BUNDLES.map(bundle => (
                        <TouchableOpacity 
                            key={bundle.id}
                            onPress={() => navigation.navigate('ProductDetail', { product: bundle })}
                            className="bg-white rounded-[40px] mb-8 overflow-hidden border border-gray-100 shadow-sm"
                            activeOpacity={0.9}
                        >
                            <View className="relative">
                                <Image source={{ uri: bundle.image }} className="w-full h-56" />
                                <View className="absolute top-4 right-4 bg-green-600 px-4 py-2 rounded-2xl shadow-lg border border-white/10">
                                    <Text className="text-white font-black text-xs uppercase tracking-tighter">{bundle.savings}</Text>
                                </View>
                            </View>
                            
                            <View className="p-6">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="flex-1">
                                        <Text className="text-xl font-black text-gray-900 leading-6">{bundle.name}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                                            <Text className="text-gray-900 font-bold text-xs ml-1">{bundle.rating}</Text>
                                            <Text className="text-gray-400 text-[10px] ml-1">({bundle.reviews} reviews)</Text>
                                        </View>
                                        <Text className="text-gray-500 text-[11px] font-medium mt-3" numberOfLines={2}>Includes: {bundle.items.join(', ')}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-gray-50">
                                    <View>
                                        <Text className="text-green-700 font-black text-2xl">{bundle.price}</Text>
                                        <Text className="text-gray-400 text-xs font-bold line-through">{bundle.oldPrice}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                                        className="bg-green-700 px-6 py-3 rounded-2xl shadow-lg shadow-green-900/40"
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-white font-black text-sm uppercase tracking-tighter">Add bundle</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Custom Bundle Invite */}
                <View className="px-5 mt-4">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Offers')}
                        className="bg-amber-100 rounded-[40px] p-8 flex-row items-center border border-amber-200"
                        activeOpacity={0.8}
                    >
                        <View className="flex-1">
                            <Text className="text-amber-900 font-black text-2xl leading-7">Build Your Own Box</Text>
                            <Text className="text-amber-800/70 font-bold mt-2 text-sm leading-5">Pick 10 essentials and get flat 15% off your first custom bundle.</Text>
                            <View className="bg-amber-900 self-start px-6 py-2.5 rounded-full mt-5 shadow-lg shadow-amber-900/30">
                                <Text className="text-white font-black text-[10px] uppercase tracking-widest">Start Customizing</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="hammer-wrench" size={60} color="#78350f" style={{ opacity: 0.1, marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
