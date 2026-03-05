import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DAILY_DEALS, PROMO_CARDS, SHOP_CATEGORIES } from '@/data/mock/home';

export default function OffersScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const renderOfferCard = ({ item }: { item: any }) => (
        <TouchableOpacity 
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            className="bg-white rounded-3xl mb-4 overflow-hidden shadow-sm border border-gray-100"
            style={{ width: '48%' }}
        >
            <View className="relative">
                <Image source={{ uri: item.image }} className="w-full h-40" resizeMode="cover" />
                <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-lg">
                    <Text className="text-white text-[10px] font-black">{item.discount || 'Special'}</Text>
                </View>
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                    <MaterialCommunityIcons name="heart-outline" size={18} color="#e11d48" />
                </TouchableOpacity>
            </View>
            <View className="p-3">
                <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">{item.mart}</Text>
                <Text className="text-gray-900 font-bold text-sm mb-1 line-clamp-1" numberOfLines={1}>{item.name}</Text>
                <View className="flex-row items-center">
                    <Text className="text-green-700 font-black text-base">{item.price}</Text>
                    <Text className="text-gray-400 text-xs line-through ml-2">{item.oldPrice}</Text>
                </View>
                <TouchableOpacity className="bg-green-700 rounded-xl py-2 mt-3 items-center">
                    <Text className="text-white font-bold text-xs">Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            
            {/* Header */}
            <View className="bg-green-700 pb-10 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
                <View className="px-5 flex-row items-center mt-2">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Savings</Text>
                        <Text className="text-white font-black text-2xl tracking-tighter">Best Offers</Text>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Featured Promo Slider */}
                <View className="mt-6 px-4">
                    <Text className="text-lg font-black text-gray-900 mb-4">Featured Campaigns</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
                        {PROMO_CARDS.map(promo => (
                            <TouchableOpacity 
                                key={promo.id}
                                onPress={() => {
                                    if (promo.title.toLowerCase().includes('tech')) navigation.navigate('TechSale');
                                    else if (promo.title.toLowerCase().includes('grocery')) navigation.navigate('GroceryBundle');
                                    else if (promo.title.toLowerCase().includes('fashion')) navigation.navigate('FashionWeek');
                                }}
                                className="mr-4 rounded-[32px] p-6 w-[280px] relative overflow-hidden h-40"
                                style={{ backgroundColor: promo.color }}
                            >
                                <View className="z-10 flex-1 justify-center">
                                    <Text className="text-white font-black text-2xl leading-7">{promo.title}</Text>
                                    <View className="bg-white/20 self-start px-3 py-1 rounded-full mt-2">
                                        <Text className="text-white font-bold text-xs">{promo.subtitle}</Text>
                                    </View>
                                </View>
                                <Image 
                                    source={{ uri: promo.image }} 
                                    className="absolute -right-4 -bottom-4 w-40 h-40 opacity-80"
                                    style={{ transform: [{ rotate: '-15deg' }] }}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
            

                {/* Exclusive Vouchers Link */}
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Vouchers')}
                    className="mx-4 mt-8 bg-blue-50 border border-blue-100 rounded-[24px] p-4 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-blue-600 rounded-2xl items-center justify-center mr-4">
                            <MaterialCommunityIcons name="ticket-percent" size={24} color="white" />
                        </View>
                        <View>
                            <Text className="text-blue-900 font-bold text-base">Got a Promo Code?</Text>
                            <Text className="text-blue-700 text-xs font-medium">Check your available vouchers here</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#2563eb" />
                </TouchableOpacity>

                {/* All Offers Grid */}
                <View className="mt-8 px-4">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-black text-gray-900">All Flash Deals</Text>
                        <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-full">
                            <Text className="text-gray-600 font-bold text-[10px] uppercase">Sort & Filter</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-row flex-wrap justify-between">
                        {DAILY_DEALS.map(deal => (
                            <React.Fragment key={deal.id}>
                                {renderOfferCard({ item: deal })}
                            </React.Fragment>
                        ))}
                        {/* Duplicate for visual density */}
                        {DAILY_DEALS.map(deal => (
                            <React.Fragment key={`dup-${deal.id}`}>
                                {renderOfferCard({ item: deal })}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
