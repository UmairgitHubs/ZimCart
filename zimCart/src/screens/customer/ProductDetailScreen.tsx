import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const RELATED_PRODUCTS = [
    { id: '10', name: 'ZimCart Fresh Cream', price: 'Rs. 450', image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=200&auto=format&fit=crop' },
    { id: '11', name: 'Nestle Yogurt 500g', price: 'Rs. 180', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=200&auto=format&fit=crop' },
];

export default function ProductDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const product = route.params?.product || { 
        name: 'ZimCart Fresh Milk 1L', 
        price: 'Rs. 250', 
        image: 'https://images.unsplash.com/photo-1550583726-226ff22580fc?q=80&w=800&auto=format&fit=crop',
        mart: 'ZimCart Fresh Mart',
        rating: '4.9',
        reviews: '128'
    };
    
    const [quantity, setQuantity] = useState(1);
    const [isFavourite, setIsFavourite] = useState(false);

    const renderHeaderButtons = () => (
        <View className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: insets.top }}>
            <View className="px-5 flex-row items-center justify-between h-16 mt-2">
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Main')}
                    className="w-12 h-12 bg-white/95 rounded-full items-center justify-center shadow-md shadow-black/10"
                >
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#111827" />
                </TouchableOpacity>
                <View className="flex-row">
                    <TouchableOpacity 
                        onPress={() => setIsFavourite(!isFavourite)}
                        className="w-12 h-12 bg-white/95 rounded-full items-center justify-center shadow-md shadow-black/10 mr-2"
                    >
                        <MaterialCommunityIcons name={isFavourite ? "heart" : "heart-outline"} size={24} color={isFavourite ? "#ef4444" : "#111827"} />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-12 h-12 bg-white/95 rounded-full items-center justify-center shadow-md shadow-black/10">
                        <MaterialCommunityIcons name="share-variant" size={22} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Hero Image Section */}
                <View className="relative bg-gray-50" style={{ height: width * 1.1 }}>
                    {renderHeaderButtons()}
                    <Image 
                        source={{ uri: product.image }} 
                        className="w-full h-full" 
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-6 left-5">
                        <View className="bg-white/90 px-3 py-1.5 rounded-2xl flex-row items-center shadow-sm backdrop-blur-md">
                            <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                            <Text className="text-gray-900 font-black ml-1 text-xs">{product.rating}</Text>
                            <Text className="text-gray-400 font-bold text-[10px] ml-1">({product.reviews} reviews)</Text>
                        </View>
                    </View>
                </View>

                {/* Content Section */}
                <View className="px-5 mt-8">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-4">
                            <Text className="text-3xl font-black text-gray-900 tracking-tighter leading-8">{product.name}</Text>
                            <TouchableOpacity className="flex-row items-center mt-2">
                                <Text className="text-green-700 font-bold text-xs">by {product.mart}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={14} color="#2e7d32" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-2xl font-black text-green-700">{product.price}</Text>
                    </View>

                    {/* Meta Highlights */}
                    <View className="flex-row mt-8 justify-between">
                        <View className="bg-gray-50/50 rounded-3xl p-4 items-center flex-1 mr-3 border border-gray-100 shadow-sm shadow-black/5">
                            <MaterialCommunityIcons name="clock-outline" size={22} color="#2e7d32" />
                            <Text className="text-gray-900 font-black text-[11px] mt-2">15-20 Min</Text>
                            <Text className="text-gray-400 text-[8px] font-bold uppercase mt-1 tracking-widest">Delivery</Text>
                        </View>
                        <View className="bg-gray-50/50 rounded-3xl p-4 items-center flex-1 mr-3 border border-gray-100 shadow-sm shadow-black/5">
                            <MaterialCommunityIcons name="label-outline" size={22} color="#2e7d32" />
                            <Text className="text-gray-900 font-black text-[11px] mt-2">Best Price</Text>
                            <Text className="text-gray-400 text-[8px] font-bold uppercase mt-1 tracking-widest">Guaranteed</Text>
                        </View>
                        <View className="bg-gray-50/50 rounded-3xl p-4 items-center flex-1 border border-gray-100 shadow-sm shadow-black/5">
                            <MaterialCommunityIcons name="leaf" size={22} color="#2e7d32" />
                            <Text className="text-gray-900 font-black text-[11px] mt-2">Organic</Text>
                            <Text className="text-gray-400 text-[8px] font-bold uppercase mt-1 tracking-widest">Fresh</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View className="mt-10">
                        <Text className="text-lg font-black text-gray-900 tracking-tighter uppercase">Description</Text>
                        <Text className="text-gray-500 font-medium leading-6 mt-4">
                            Experience the pure taste of nature with our ZimCart Fresh Milk. Sourced directly from local farms every morning to ensure maximum freshness and nutritional value. 
                            {"\n\n"}
                            Rich in calcium and essential vitamins, it's the perfect choice for your family's health. Zero preservatives added.
                        </Text>
                    </View>

                    {/* Nutritional Info / Tags */}
                    <View className="mt-8 flex-row flex-wrap">
                        {['100% Pure', 'Antibiotic Free', 'Non-GMO', 'Grass Fed'].map((tag, idx) => (
                            <View key={idx} className="bg-green-50 px-4 py-2 rounded-full mr-2 mb-2">
                                <Text className="text-green-700 font-bold text-[10px] uppercase tracking-widest">{tag}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="mt-12">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-lg font-black text-gray-900 tracking-tighter uppercase">Related Products</Text>
                            <TouchableOpacity><Text className="text-green-700 font-bold text-xs">View All</Text></TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
                            {RELATED_PRODUCTS.map(item => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    onPress={() => navigation.push('ProductDetail', { product: item })}
                                    className="bg-white rounded-[32px] border border-gray-100 p-4 mr-4 w-[160px] shadow-sm"
                                >
                                    <View className="relative">
                                        <Image source={{ uri: item.image }} className="w-full h-32 rounded-2xl mb-3" />
                                    </View>
                                    <Text className="text-gray-900 font-black text-xs" numberOfLines={1}>{item.name}</Text>
                                    <View className="flex-row items-center justify-between mt-1">
                                        <Text className="text-green-700 font-black text-sm">{item.price}</Text>
                                        <MaterialCommunityIcons name="plus-circle" size={18} color="#2e7d32" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Premium Professional-Grade Action Suite */}
            <View 
                className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 items-center justify-center shadow-2xl"
                style={{ paddingBottom: Math.max(insets.bottom, 12), paddingTop: 12 }}
            >
                <View className="flex-row items-center justify-between px-5" style={{ width: '100%', maxWidth: 650 }}>
                    {/* Tactile Quantity Hub */}
                    <View className="flex-row items-center bg-gray-100/80 rounded-[32px] p-1 border border-gray-200">
                        <TouchableOpacity 
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="minus" size={22} color="#1F2937" />
                        </TouchableOpacity>
                        
                        <View className="px-5 items-center">
                            <Text className="text-gray-900 font-black text-xl">{quantity}</Text>
                            <Text className="text-gray-400 text-[8px] font-black uppercase tracking-widest -mt-1">QTY</Text>
                        </View>

                        <TouchableOpacity 
                            onPress={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 bg-green-700 rounded-full items-center justify-center shadow-lg shadow-green-900/40"
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="plus" size={22} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Elite Action Button with Unified Telemetry */}
                    <TouchableOpacity 
                        className="bg-green-700 flex-1 ml-4 h-[68px] rounded-[34px] items-center px-6 shadow-2xl shadow-green-900/50 flex-row overflow-hidden border border-white/10"
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
                    >
                        <View className="flex-1 pr-2">
                            <Text className="text-white font-black text-sm uppercase leading-tight tracking-tighter" numberOfLines={1}>Add to Cart</Text>
                            <Text className="text-green-100/60 text-[8px] font-black uppercase tracking-widest">Secure Checkout</Text>
                        </View>

                        <View className="h-8 w-[1.5px] bg-white/10 mx-3 rounded-full" />

                        <View className="items-end min-w-[80px]">
                            <Text className="text-white font-black text-base" numberOfLines={1}>
                                Rs. {(parseInt(product.price.replace(/[^0-9]/g, '')) * quantity).toLocaleString()}
                            </Text>
                            <Text className="text-green-100/60 text-[8px] font-black uppercase">Total Price</Text>
                        </View>
                        
                        <MaterialCommunityIcons 
                            name="shopping" 
                            size={70} 
                            color="white" 
                            className="absolute -right-5 -bottom-5 opacity-10" 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
