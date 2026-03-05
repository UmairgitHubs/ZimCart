import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FLASH_DEALS = [
    { 
        id: '1', 
        name: 'MacBook Air M2', 
        price: 'Rs. 185,000', 
        oldPrice: 'Rs. 220,000', 
        sold: 65, 
        rating: 4.9,
        reviews: '240',
        mart: 'Tech Hub',
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '2', 
        name: 'Sony WH-1000XM5', 
        price: 'Rs. 64,000', 
        oldPrice: 'Rs. 75,000', 
        sold: 88, 
        rating: 4.8,
        reviews: '156',
        mart: 'Audio World',
        image: 'https://images.unsplash.com/photo-1628202926206-c63a34a1618f?q=80&w=400&auto=format&fit=crop' 
    },
    { 
        id: '3', 
        name: 'iPhone 15 Pro', 
        price: 'Rs. 320,000', 
        oldPrice: 'Rs. 350,000', 
        sold: 42, 
        rating: 4.9,
        reviews: '412',
        mart: 'Apple Store',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop' 
    },
];

const BUNDLE_DEALS = [
    {
        id: 'b1',
        name: 'Ultimate Gaming Set',
        items: ['Mechanical KB', 'Gaming Mouse', 'RGB Pad'],
        price: 'Rs. 12,500',
        rating: 4.7,
        reviews: '89',
        mart: 'Gaming Zone',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'b2',
        name: 'Home Office Kit',
        items: ['HD Webcam', 'BT Headset', 'Laptop Stand'],
        price: 'Rs. 8,900',
        rating: 4.6,
        reviews: '67',
        mart: 'Home Office Pro',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop'
    }
];

const CATEGORIES = [
    { name: 'Laptops', icon: 'laptop' },
    { name: 'Mobiles', icon: 'cellphone' },
    { name: 'Audio', icon: 'headphones' },
    { name: 'Gaming', icon: 'controller-classic' },
    { name: 'Cameras', icon: 'camera' },
    { name: 'Tablets', icon: 'tablet-android' },
];

export default function TechSaleScreen() {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [notified, setNotified] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return { h, m, s };
    };

    const time = formatTime(timeLeft);

    const renderHeader = () => (
        <View className="bg-green-700 pb-12 rounded-b-[50px] shadow-2xl overflow-hidden" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            
            {/* Background Decorative Tech Elements */}
            <View className="absolute top-0 right-0 left-0 bottom-0 opacity-10">
                <MaterialCommunityIcons name="chip" size={300} color="white" style={{ position: 'absolute', right: -50, top: -50 }} />
                <MaterialCommunityIcons name={"developer-board" as any} size={200} color="white" style={{ position: 'absolute', left: -30, bottom: -20 }} />
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
                    <Text className="text-white/70 text-[10px] font-black uppercase tracking-[4px]">Flash Event</Text>
                    <Text className="text-white font-black text-2xl tracking-tighter">Super Tech Sale</Text>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center shadow-lg"
                    activeOpacity={0.7}
                    onPress={() => {/* In-app share logic would go here */}}
                >
                    <MaterialCommunityIcons name="share-variant-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Immersive Countdown */}
            <View className="px-5 items-center z-10">
                <Text className="text-white/80 font-bold mb-4 text-xs uppercase tracking-widest">Offers End In</Text>
                <View className="flex-row items-center justify-center">
                    <View className="items-center mx-1.5" style={{ width: width * 0.16 }}>
                        <View className="bg-white/10 w-full aspect-[4/5] rounded-2xl items-center justify-center border border-white/20 backdrop-blur-md">
                            <Text className="text-white font-black text-2xl" adjustsFontSizeToFit numberOfLines={1}>{time.h.toString().padStart(2, '0')}</Text>
                        </View>
                        <Text className="text-white/60 text-[8px] font-bold mt-2 uppercase tracking-tighter">Hours</Text>
                    </View>
                    <Text className="text-white/40 font-black text-2xl mb-6">:</Text>
                    <View className="items-center mx-1.5" style={{ width: width * 0.16 }}>
                        <View className="bg-white/10 w-full aspect-[4/5] rounded-2xl items-center justify-center border border-white/20 backdrop-blur-md">
                            <Text className="text-white font-black text-2xl" adjustsFontSizeToFit numberOfLines={1}>{time.m.toString().padStart(2, '0')}</Text>
                        </View>
                        <Text className="text-white/60 text-[8px] font-bold mt-2 uppercase tracking-tighter">Mins</Text>
                    </View>
                    <Text className="text-white/40 font-black text-2xl mb-6">:</Text>
                    <View className="items-center mx-1.5" style={{ width: width * 0.16 }}>
                        <View className="bg-white/10 w-full aspect-[4/5] rounded-2xl items-center justify-center border border-white/20 backdrop-blur-md">
                            <Text className="text-white font-black text-2xl" adjustsFontSizeToFit numberOfLines={1}>{time.s.toString().padStart(2, '0')}</Text>
                        </View>
                        <Text className="text-white/60 text-[8px] font-bold mt-2 uppercase tracking-tighter">Secs</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {renderHeader()}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
                {/* Sale Highlights Grid */}
                <View className="px-5 -mt-2 z-20">
                    <View className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 flex-row justify-between">
                        <View className="items-center flex-1">
                            <View className="w-12 h-12 bg-green-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="truck-fast-outline" size={24} color="#2e7d32" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Express</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Delivery</Text>
                        </View>
                        <View className="w-[1px] h-12 bg-gray-100 self-center" />
                        <View className="items-center flex-1">
                            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="shield-check-outline" size={24} color="#2563eb" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">1 Year</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Warranty</Text>
                        </View>
                        <View className="w-[1px] h-12 bg-gray-100 self-center" />
                        <View className="items-center flex-1">
                            <View className="w-12 h-12 bg-orange-50 rounded-2xl items-center justify-center mb-2">
                                <MaterialCommunityIcons name="swap-horizontal" size={24} color="#ea580c" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-900 uppercase">Easy</Text>
                            <Text className="text-[10px] text-gray-400 font-bold">Returns</Text>
                        </View>
                    </View>
                </View>

                {/* Hot Flash Deals Section */}
                <View className="mt-10 px-5">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center">
                            <View className="bg-red-500 w-2 h-8 rounded-full mr-3" />
                            <Text className="text-2xl font-black text-gray-900 tracking-tighter">Hot Flash Deals</Text>
                        </View>
                        <MaterialCommunityIcons name="lightning-bolt" size={24} color="#EF4444" />
                    </View>

                    {FLASH_DEALS.map(deal => (
                        <TouchableOpacity 
                            key={deal.id}
                            onPress={() => navigation.navigate('ProductDetail', { product: deal })}
                            className="bg-white rounded-[40px] mb-6 p-4 border border-gray-100 shadow-sm flex-row"
                            activeOpacity={0.9}
                        >
                            <View className="relative">
                                <Image source={{ uri: deal.image }} className="h-32 rounded-3xl" style={{ width: width * 0.35 }} />
                                <View className="absolute -top-2 -left-2 bg-red-600 w-10 h-10 rounded-full items-center justify-center border-4 border-white">
                                    <View className="bg-red-600 rounded-full items-center justify-center">
                                        <Text className="text-white text-[9px] font-black italic">HOT</Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View className="flex-1 ml-4 justify-between py-1">
                                <View>
                                    <Text className="text-lg font-black text-gray-900 leading-5" numberOfLines={2}>{deal.name}</Text>
                                    <View className="flex-row items-center mt-2">
                                        <Text className="text-green-700 font-black text-xl">{deal.price}</Text>
                                        <Text className="text-gray-400 text-xs line-through ml-2">{deal.oldPrice}</Text>
                                    </View>
                                </View>

                                <View>
                                    <View className="flex-row justify-between items-center mb-1.5">
                                        <Text className="text-[10px] font-bold text-gray-500">{deal.sold}% Claimed</Text>
                                        <Text className="text-[10px] font-black text-red-500">Limited Stock</Text>
                                    </View>
                                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <View className="h-full bg-red-500 rounded-full" style={{ width: `${deal.sold}%` }} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bundle Exclusives Banner */}
                <View className="px-5 mt-8">
                    <View className="bg-gray-900 rounded-[40px] p-8 overflow-hidden relative">
                        {/* Recursive Background Element */}
                        <MaterialCommunityIcons 
                            name="gift-outline" 
                            size={200} 
                            color="white" 
                            style={{ position: 'absolute', right: -60, bottom: -60, opacity: 0.05 }}
                        />
                        
                        <View className="z-10">
                            <View className="bg-green-500 self-start px-3 py-1 rounded-full mb-3 shadow-md shadow-green-500/20">
                                <Text className="text-white text-[10px] font-black uppercase">Bundle & Save</Text>
                            </View>
                            <Text className="text-white font-black text-3xl leading-9">Exclusive{"\n"}Tech Bundles</Text>
                            <Text className="text-gray-400 font-medium mt-2 text-sm">Save up to Rs. 15,000 on curated sets</Text>
                        </View>
                        
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 -mx-4 px-4 z-10" snapToInterval={(width * 0.5) + 16} decelerationRate="fast">
                            {BUNDLE_DEALS.map(bundle => (
                                <TouchableOpacity 
                                    key={bundle.id} 
                                    onPress={() => navigation.navigate('ProductDetail', { product: bundle })}
                                    className="bg-white/10 p-3 rounded-[32px] mr-4 border border-white/10" 
                                    style={{ width: width * 0.5 }}
                                    activeOpacity={0.8}
                                >
                                    <Image source={{ uri: bundle.image }} className="w-full h-24 rounded-2xl mb-3" />
                                    <Text className="text-white font-bold text-sm" numberOfLines={1}>{bundle.name}</Text>
                                    <Text className="text-gray-400 text-[9px] mt-1" numberOfLines={1}>{bundle.items.join(' + ')}</Text>
                                    <View className="flex-row items-center justify-between mt-3">
                                        <Text className="text-green-400 font-black text-base">{bundle.price.split(' ')[1]}</Text>
                                        <View className="bg-white px-3 py-1.5 rounded-full shadow-sm">
                                            <Text className="text-black font-black text-[9px] uppercase">View</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/* Performance Categories */}
                <View className="mt-12 px-5">
                    <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Shop by Category</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {CATEGORIES.map((cat, i) => (
                            <TouchableOpacity 
                                key={cat.name}
                                onPress={() => navigation.navigate('CategoryDetail', { category: cat })}
                                className="bg-white rounded-3xl p-4 mb-4 border border-gray-50 shadow-sm items-center justify-center active:scale-95"
                                style={{ width: '31%' }}
                            >
                                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-2">
                                    <MaterialCommunityIcons 
                                        name={cat.icon as any} 
                                        size={20} 
                                        color="#4B5563" 
                                    />
                                </View>
                                <Text className="text-[10px] font-black text-gray-700 uppercase">{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Premium Notification Trigger */}
          
        </View>
    );
}
