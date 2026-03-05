import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FLASH_COLLECTION = [
    {
        id: 'f1',
        name: 'Classic Trench Coat',
        price: 'Rs. 12,500',
        oldPrice: 'Rs. 25,000',
        mart: 'Aura Boutique',
        rating: 4.8,
        reviews: '124',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'f2',
        name: 'Leather Ankle Boots',
        price: 'Rs. 8,400',
        oldPrice: 'Rs. 16,800',
        mart: 'Shoe Haven',
        rating: 4.7,
        reviews: '89',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop'
    }
];

export default function FashionWeekScreen() {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [isVipApplied, setIsVipApplied] = useState(false);

    const renderHeader = () => (
        <View className="bg-green-700 pb-12 rounded-b-[50px] shadow-2xl overflow-hidden" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            
            {/* Background Decorative Elements */}
            <View className="absolute top-0 right-0 left-0 bottom-0 opacity-10">
                <MaterialCommunityIcons name="hanger" size={300} color="white" style={{ position: 'absolute', right: -50, top: -50 }} />
                <MaterialCommunityIcons name={"content-cut" as any} size={200} color="white" style={{ position: 'absolute', left: -30, bottom: -20 }} />
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
                    <Text className="text-white/70 text-[10px] font-black uppercase tracking-[4px]">Runway Event</Text>
                    <Text className="text-white font-black text-2xl tracking-tighter">Fashion Week</Text>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center shadow-lg"
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Offers')}
                >
                    <MaterialCommunityIcons name="star-face" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="px-8 items-center z-10">
                <View className="bg-white/20 px-6 py-2 rounded-full border border-white/30 backdrop-blur-md">
                    <Text className="text-white font-black text-xs uppercase tracking-widest text-center">Exclusive 50% Discounts on Designers</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
                {/* Visual Highlights Grid */}
                <View className="px-5 -mt-2 z-20">
                    <View className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 flex-row justify-between border border-gray-50">
                        <TouchableOpacity 
                            className="items-center flex-1"
                            onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Fashion' } })}
                        >
                            <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="crown-outline" size={24} color="#7e22ce" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Premium</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Brands</Text>
                        </TouchableOpacity>
                        <View className="w-[1px] h-12 bg-gray-100 self-center" />
                        <TouchableOpacity 
                            className="items-center flex-1"
                            onPress={() => navigation.navigate('Offers')}
                        >
                            <View className="w-12 h-12 bg-pink-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="#db2777" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Flash</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Drops</Text>
                        </TouchableOpacity>
                        <View className="w-[1px] h-12 bg-gray-100 self-center" />
                        <TouchableOpacity 
                            className="items-center flex-1"
                            onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'FashionWeek' } })}
                        >
                            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="package-variant-closed" size={24} color="#2563eb" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Curated</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Lookbooks</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Designer Spotlight Hero */}
                <View className="mt-10 px-5">
                    <Text className="text-2xl font-black text-gray-900 mb-6 tracking-tighter">Designer Spotlight</Text>
                    <TouchableOpacity 
                        className="bg-black rounded-[48px] overflow-hidden shadow-2xl shadow-black/40"
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Versace Collection' } })}
                    >
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop' }} 
                            className="w-full h-[450px] opacity-80" 
                        />
                        <View className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <View className="bg-green-600 self-start px-4 py-1.5 rounded-full mb-3">
                                <Text className="text-white text-[10px] font-black uppercase tracking-widest">Brand of the Month</Text>
                            </View>
                            <Text className="text-white font-black text-4xl leading-10">Versace{"\n"}Spring '24</Text>
                            <Text className="text-gray-300 font-medium mt-3 text-sm leading-5">Discover the intersection of heritage and modern street couture.</Text>
                            <View className="bg-white self-start px-8 py-4 rounded-3xl mt-6">
                                <Text className="text-black font-black text-xs uppercase tracking-widest">Explore Collection</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Style Pulse - Secondary Discovery */}
                <View className="mt-12 px-5">
                    <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Style Pulse</Text>
                    <View className="flex-row justify-between">
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Minimalism' } })}
                            className="bg-gray-100 rounded-[32px] p-6 justify-between overflow-hidden"
                            style={{ width: (width - 52) / 2, height: 220 }}
                        >
                            <View className="z-10">
                                <Text className="text-gray-900 font-black text-lg">Minimalist{"\n"}Luxury</Text>
                                <Text className="text-gray-500 text-[10px] font-bold mt-2">12 Items</Text>
                            </View>
                            <MaterialCommunityIcons name="flare" size={100} color="white" style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.2 }} />
                            <View className="bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm">
                                <MaterialCommunityIcons name="arrow-right" size={20} color="black" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate('CategoryDetail', { category: { name: 'Streetwear' } })}
                            className="bg-green-700 rounded-[32px] p-6 justify-between overflow-hidden"
                            style={{ width: (width - 52) / 2, height: 220 }}
                        >
                            <View className="z-10">
                                <Text className="text-white font-black text-lg">Street{"\n"}Archives</Text>
                                <Text className="text-green-100 text-[10px] font-bold mt-2">24 Items</Text>
                            </View>
                            <MaterialCommunityIcons name="tag-outline" size={100} color="white" style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.1 }} />
                            <View className="bg-white w-10 h-10 rounded-full items-center justify-center shadow-sm">
                                <MaterialCommunityIcons name="arrow-right" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Boutique Flash Sales */}
                <View className="mt-12 px-5">
                    <View className="flex-row justify-between items-end mb-6">
                        <View>
                            <Text className="text-xl font-black text-gray-900 tracking-tighter">Boutique Flash Sale</Text>
                            <Text className="text-gray-400 text-xs font-bold">Ending soon - up to 50% off</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Offers')}>
                            <Text className="text-green-700 font-bold text-xs uppercase">View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between flex-wrap">
                        {FLASH_COLLECTION.map(item => (
                            <TouchableOpacity 
                                key={item.id}
                                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                                className="bg-white rounded-[32px] p-4 border border-gray-100 mb-4 shadow-sm"
                                style={{ width: (width - 52) / 2 }}
                            >
                                <View className="relative">
                                    <Image source={{ uri: item.image }} className="w-full h-40 rounded-2xl mb-3" />
                                    <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-lg">
                                        <Text className="text-white text-[8px] font-black uppercase">Flash</Text>
                                    </View>
                                </View>
                                <Text className="text-gray-900 font-black text-sm" numberOfLines={1}>{item.name}</Text>
                                <View className="flex-row items-center justify-between mt-2">
                                    <View>
                                        <Text className="text-green-700 font-black text-base">{item.price}</Text>
                                        <Text className="text-gray-300 text-[10px] line-through">{item.oldPrice}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                                        className="bg-gray-900 w-9 h-9 rounded-xl items-center justify-center shadow-md"
                                    >
                                        <MaterialCommunityIcons name="cart-plus" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* VIP Access Invite */}
                <View className="px-5 mt-6 mb-10">
                    <TouchableOpacity 
                        onPress={() => setIsVipApplied(!isVipApplied)}
                        className={`${isVipApplied ? 'bg-pink-700 shadow-2xl' : 'bg-pink-600'} rounded-[40px] p-10 flex-row items-center overflow-hidden transition-all duration-300`}
                    >
                        <View className="flex-1 z-10">
                            <Text className="text-white font-black text-3xl leading-8">VIP Runway{"\n"}Access</Text>
                            <Text className="text-pink-100 font-bold mt-2 text-sm leading-5">
                                {isVipApplied ? 'Your application is under review. You will be notified shortly.' : 'Join the circle for invite-only drops and early previews.'}
                            </Text>
                            {!isVipApplied && (
                                <View className="bg-white self-start px-8 py-3 rounded-full mt-6 shadow-lg shadow-pink-900/30">
                                    <Text className="text-pink-600 font-black text-[10px] uppercase tracking-widest">Apply Now</Text>
                                </View>
                            )}
                        </View>
                        <MaterialCommunityIcons 
                            name={isVipApplied ? "check-decagram" : "creation" as any} 
                            size={160} 
                            color="white" 
                            style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.1 }}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
