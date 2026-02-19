import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2; // Two columns with padding

interface FavouriteItemType {
    id: string;
    title: string;
    price: string;
    image: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    discount?: string;
    category: string;
}

// MOCK_FAVOURITES removed. Using useFavourites hook.
import { useFavourites } from '@/hooks/useCustomer';
import { FavouriteItem, Product } from '@/types/product';
import { Alert } from 'react-native';

const ProductCard = ({ item, onToggle }: { item: Product, onToggle: (id: string) => void }) => {
    return (
        <Pressable 
            className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border border-gray-100 active:opacity-95"
            style={{ width: PRODUCT_WIDTH }}
        >
            <View className="h-40 bg-gray-50 relative">
                <Image 
                    source={{ uri: item.image }} 
                    className={`w-full h-full ${item.stock === 0 ? 'opacity-50' : ''}`}
                    resizeMode="cover"
                />
                
                {/* Heart Icon (Remove) */}
                <Pressable onPress={() => onToggle(item.id)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full backdrop-blur-md">
                    <MaterialCommunityIcons name="heart" size={16} color="#EF4444" />
                </Pressable>

                {/* Discount Badge */}
                {item.discountPrice && (
                    <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-md">
                        <Text className="text-[10px] font-bold text-white uppercase">SALE</Text>
                    </View>
                )}

                {/* Out of Stock Overlay */}
                {item.stock === 0 && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                         <Text className="text-white font-bold text-xs uppercase tracking-wider border border-white px-2 py-1">Out of Stock</Text>
                    </View>
                )}
            </View>

            <View className="p-3">
                <Text className="text-xs text-gray-400 font-bold uppercase mb-1">{item.category}</Text>
                <Text className="text-sm font-bold text-gray-900 leading-tight mb-1 h-10" numberOfLines={2}>
                    {item.name}
                </Text>
                
                <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                    <Text className="text-xs font-bold text-gray-700 ml-1">{item.rating}</Text>
                    <Text className="text-[10px] text-gray-400 ml-1">({item.reviews})</Text>
                </View>

                <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-base font-extrabold text-[#2e7d32]">${item.price}</Text>
                    {item.stock > 0 && (
                        <Pressable className="bg-gray-900 p-2 rounded-lg active:bg-gray-800">
                            <MaterialCommunityIcons name="cart-plus" size={16} color="white" />
                        </Pressable>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

export default function FavouritesScreen(props: any) {
    const navigation = props.navigation;
    const insets = useSafeAreaInsets();
    
    // Group items into pairs for the grid logic (since we use map instead of FlatList for stability)
    const { data: favourites, isLoading, toggle } = useFavourites();
    const items = (favourites as Product[]) || [];

    const handleToggle = (id: string) => {
        toggle(id, {
            onSuccess: (data) => {
               // Alert.alert(data.isFavourited ? "Added" : "Removed");
            }
        });
    };

    const pairs = [];
    for (let i = 0; i < items.length; i += 2) {
        pairs.push(items.slice(i, i + 2));
    }

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            
            {/* Header */}
            <View 
                style={{ paddingTop: insets.top }} 
                className="bg-white px-5 pb-4 border-b border-gray-100 mb-2"
            >
                <View className="flex-row items-center justify-between mb-2 mt-2">
                    <Pressable 
                        onPress={() => navigation && navigation.goBack()} 
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={20} color="#1F2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">Favourites</Text>
                    <View className="w-10" />
                </View>
                
                {/* Search Bar Placeholder */}
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-2">
                    <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
                    <Text className="text-gray-400 ml-2 font-medium">Search saved items...</Text>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Grid Layout Manually Implemented */}
                {pairs.map((pair, index) => (
                    <View key={index} className="flex-row justify-between mb-0">
                        {pair.map(item => (
                            <ProductCard key={item.id} item={item} onToggle={handleToggle} />
                        ))}
                        {/* Empty view for odd number of items to maintain alignment */}
                        {pair.length === 1 && <View style={{ width: PRODUCT_WIDTH }} />}
                    </View>
                ))}

                {items.length === 0 && (
                    <View className="items-center justify-center mt-20 px-10">
                        <MaterialCommunityIcons name="heart-outline" size={48} color="#D1D5DB" className="mb-4" />
                        <Text className="text-lg font-bold text-gray-900 mb-2">No favourites yet</Text>
                        <Text className="text-gray-500 text-center">
                            Save items you love to find them easily later.
                        </Text>
                        <Pressable className="mt-6 bg-[#2e7d32] px-6 py-3 rounded-xl shadow-lg shadow-green-200">
                            <Text className="text-white font-bold">Explore Products</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
