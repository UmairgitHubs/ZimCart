import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { STORES, DAILY_DEALS, PROMO_CARDS } from '@/data/mock/home';

const { width } = Dimensions.get('window');

const GROCERY_CATEGORIES = [
    { id: '1', name: 'Vegetables', icon: 'leaf', color: '#ecfccb', textColor: '#3f6212' },
    { id: '2', name: 'Fruits', icon: 'food-apple', color: '#ffedd5', textColor: '#9a3412' },
    { id: '3', name: 'Meat', icon: 'food-steak', color: '#fee2e2', textColor: '#991b1b' },
    { id: '4', name: 'Dairy', icon: 'bottle-wine', color: '#eff6ff', textColor: '#1e40af' },
    { id: '5', name: 'Bakery', icon: 'bread-slice', color: '#fef9c3', textColor: '#854d0e' },
];

export default function GroceryScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const renderHeader = () => (
        <View className="bg-green-700 pb-6 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            <View className="px-5 flex-row items-center justify-between mb-6 mt-2">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                        <MaterialCommunityIcons name="map-marker" size={20} color="white" />
                    </View>
                    <View>
                        <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Deliver to</Text>
                        <View className="flex-row items-center">
                            <Text className="text-white font-black text-sm">107 Street 65, Islamabad</Text>
                            <MaterialCommunityIcons name="chevron-down" size={16} color="white" className="ml-1" />
                        </View>
                    </View>
                </View>
                <TouchableOpacity 
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    onPress={() => navigation.navigate('CartTab')}
                >
                    <MaterialCommunityIcons name="shopping-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="px-5">
                <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
                    <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Search Groceries & Stores..."
                        className="flex-1 ml-3 text-base font-medium text-gray-800"
                        placeholderTextColor="#9CA3AF"
                    />
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
                        {GROCERY_CATEGORIES.map(cat => (
                            <TouchableOpacity 
                                key={cat.id} 
                                className="items-center mr-6"
                                onPress={() => navigation.navigate('CategoryDetail', { category: { ...cat, name: cat.name } })}
                            >
                                <View 
                                    className="w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm"
                                    style={{ backgroundColor: cat.color }}
                                >
                                    <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.textColor} />
                                </View>
                                <Text className="text-[11px] font-black text-gray-700 uppercase tracking-tighter">{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Flash Sale Section */}
                <View className="mt-10 px-5">
                    <View className="flex-row justify-between items-end mb-4">
                        <View>
                            <Text className="text-2xl font-black text-gray-900 tracking-tighter">Grocery Flash Sale</Text>
                            <Text className="text-gray-500 text-xs font-bold">Limited time deals on daily essentials</Text>
                        </View>
                        <TouchableOpacity><Text className="text-green-700 font-bold text-xs">View All</Text></TouchableOpacity>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                        {DAILY_DEALS.map(deal => (
                            <TouchableOpacity 
                                key={deal.id}
                                className="bg-white rounded-[32px] border border-gray-100 p-4 mr-4 w-[200px] shadow-sm"
                                activeOpacity={0.9}
                                onPress={() => navigation.navigate('ProductDetail', { product: deal })}
                            >
                                <View className="relative mb-3">
                                    <Image source={{ uri: deal.image }} className="w-full h-32 rounded-2xl" />
                                    <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-lg">
                                        <Text className="text-white text-[9px] font-black">{deal.discount} OFF</Text>
                                    </View>
                                </View>
                                <Text className="text-gray-400 text-[9px] font-bold uppercase mb-0.5">{deal.mart}</Text>
                                <Text className="text-gray-900 font-bold text-sm mb-2" numberOfLines={1}>{deal.name}</Text>
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-green-700 font-black text-base">{deal.price}</Text>
                                        <Text className="text-gray-400 text-[10px] line-through">{deal.oldPrice}</Text>
                                    </View>
                                    <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                                        <MaterialCommunityIcons name="plus" size={20} color="#111827" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Organic Promo Banner */}
                <View className="px-5 mt-10">
                    <TouchableOpacity className="bg-orange-500 rounded-[32px] p-6 flex-row items-center overflow-hidden">
                        <View className="flex-1 z-10">
                            <Text className="text-white font-black text-2xl leading-7">100% Organic{"\n"}Direct from Farm</Text>
                            <Text className="text-orange-100 font-bold mt-2 text-xs">Get fresh produce within 30 mins</Text>
                        </View>
                        <Image 
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2329/2329865.png' }} 
                            className="w-32 h-32 absolute -right-4 -bottom-4 opacity-30" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Popular Grocery Marts */}
                <View className="mt-10 px-5">
                    <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Most Trusted Marts</Text>
                    {STORES.map(mart => (
                        <TouchableOpacity 
                            key={mart.id}
                            onPress={() => navigation.navigate('StoreDetail', { mart })}
                            className="bg-white rounded-3xl mb-6 flex-row items-center border border-gray-100 shadow-sm"
                            activeOpacity={0.9}
                        >
                            <Image source={{ uri: mart.image }} className="w-24 h-24 rounded-2xl m-2" />
                            <View className="flex-1 pr-4 ml-2">
                                <View className="flex-row justify-between items-start">
                                    <Text className="text-lg font-black text-gray-900" numberOfLines={1}>{mart.name}</Text>
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                                        <Text className="text-xs font-bold text-gray-900 ml-1">{mart.rating}</Text>
                                    </View>
                                </View>
                                <Text className="text-gray-500 text-xs font-medium mb-2">{mart.tags.join(', ')}</Text>
                                <View className="flex-row items-center">
                                    <View className="bg-green-50 px-2 py-1 rounded-md flex-row items-center mr-2">
                                        <MaterialCommunityIcons name="moped" size={14} color="#2e7d32" />
                                        <Text className="text-green-700 text-[10px] font-black ml-1">{mart.deliveryFee === 'Free' ? 'FREE' : mart.deliveryFee}</Text>
                                    </View>
                                    <View className="bg-gray-50 px-2 py-1 rounded-md flex-row items-center">
                                        <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
                                        <Text className="text-gray-500 text-[10px] font-bold ml-1">{mart.deliveryTime}</Text>
                                    </View>
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
                    onPress={() => navigation.navigate('CartTab')}
                >
                    {/* Item Count Badge */}
                    <View className="bg-white rounded-2xl w-12 h-12 items-center justify-center mr-4 shadow-sm">
                        <Text className="text-green-700 font-black text-lg">3</Text>
                    </View>
                    
                    {/* Label & Context */}
                    <View className="flex-1">
                        <Text className="text-white font-black text-lg tracking-tight">View your Cart</Text>
                        <Text className="text-green-50/60 text-[10px] font-bold uppercase tracking-widest">3 Items • ZimCart Fresh</Text>
                    </View>

                    {/* Pro Separator */}
                    <View className="h-10 w-[1.5px] bg-white/10 mx-4 rounded-full" />
                    
                    {/* Price Summary */}
                    <View className="items-end">
                        <Text className="text-white font-black text-lg">Rs. 890</Text>
                        <Text className="text-green-50/60 text-[8px] font-bold uppercase">Estimated Total</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
