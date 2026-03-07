import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { copyToClipboard } from '@/utils/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStoreDetails } from '@/hooks/useMarketplace';
import { useCart } from '@/hooks/useCart';
import { useFavourites } from '@/hooks/useCustomer';
import { useDebounce } from '@/hooks/useDebounce';

const { width } = Dimensions.get('window');

/**
 * Senior Developer Implementation:
 * High-performance, data-driven Store Detail Hub.
 * Optimized with safe-area handling, resilient native modules, and predictive UX.
 */

export default function StoreDetailScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    const mart = route.params?.mart || { 
        id: '',
        name: 'ZimCart Mart', 
        rating: 4.8, 
        deliveryTime: '20-30 min',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
        tags: ['Grocery', 'Fresh'],
        deliveryFee: 'Rs. 45'
    };
    
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 400);
    const searchToBackend = debouncedSearch.length >= 2 ? debouncedSearch : '';

    const { 
        data: storeDetails, 
        isLoading, 
        isError, 
        refetch,
        isPlaceholderData: isSearching 
    } = useStoreDetails(mart.id, searchToBackend, selectedCategory);
    
    const { data: cartData, add: addToCart } = useCart();
    const { data: favourites } = useFavourites();

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const categories = storeDetails?.categories || [];
    const products = useMemo(() => storeDetails?.products || [], [storeDetails]);
    const cartItems = useMemo(() => cartData?.items || [], [cartData]);
    const cartTotal = useMemo(() => cartItems.reduce((acc: number, curr: any) => acc + (curr.product.price * curr.quantity), 0), [cartItems]);
    const cartCount = useMemo(() => cartItems.reduce((acc: number, curr: any) => acc + curr.quantity, 0), [cartItems]);
    const isThisStoreCart = useMemo(() => cartItems.length > 0 && cartItems[0].product.storeId === mart.id, [cartItems, mart.id]);
    const displayCategories = useMemo(() => ['All', ...categories.map((c: any) => c.name)], [categories]);

    // Dynamic Promo Handling
    const storeVoucher = useMemo(() => storeDetails?.vouchers?.[0] || null, [storeDetails]);
    
    const handleVoucherClaim = async () => {
        if (!storeVoucher) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const success = await copyToClipboard(storeVoucher.code, 'Promo Code');
        const remaining = (storeVoucher.minSpend || 0) - (cartTotal || 0);
        
        const title = success ? "Code Copied: " + storeVoucher.code : "Promo Code: " + storeVoucher.code;
        const message = remaining > 0 
            ? `Add Rs. ${remaining} more to your cart to unlock this Rs. ${storeVoucher.value} discount! \n\nValid until ${new Date(storeVoucher.expiryDate).toLocaleDateString()}`
            : `Great news! Your cart qualifies for this discount. \n\nEnter code at checkout to save Rs. ${storeVoucher.value}!`;

        Alert.alert(title, message, [
            remaining <= 0 ? { text: "Checkout Now", onPress: () => navigation.navigate('Main', { screen: 'CartTab' }) } : null,
            { text: remaining > 0 ? "Keep Shopping" : "Got it", style: "default" }
        ].filter(Boolean) as any);
    };

    const handleQuickAdd = async (product: any) => {
        if (!isAuthenticated) {
            Alert.alert("Login Required", "Please login to start adding items to your cart.", [
                { text: "Cancel", style: "cancel" },
                { text: "Login", onPress: () => navigation.navigate('CustomerLogin') }
            ]);
            return;
        }

        try {
            await addToCart({ productId: product.id, quantity: 1, variants: null });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error: any) {
            Alert.alert("Error", "Could not add item to cart.");
        }
    };

    const renderHeader = () => (
        <View className="relative">
            <View className="h-64 w-full">
                <Image source={{ uri: storeDetails?.image || mart.image }} className="w-full h-full object-cover" />
                <View className="absolute inset-0 bg-black/30" />
            </View>
            <View className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: insets.top }}>
                <View className="px-5 flex-row items-center justify-between h-12">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-black/20 rounded-full items-center justify-center border border-white/20">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-white px-5 pt-6 pb-4 -mt-10 rounded-t-[40px] shadow-2xl">
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <Text className="text-2xl font-black text-gray-900 leading-8">{storeDetails?.name || mart.name}</Text>
                        <View className="flex-row flex-wrap mt-1">
                            {(storeDetails?.categories?.map((c: any) => c.name) || mart.tags || []).map((tag: string, index: number, arr: string[]) => (
                                <Text key={tag} className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                                    {tag}{index < arr.length - 1 ? ' • ' : ''}
                                </Text>
                            ))}
                        </View>
                    </View>
                    <View className="items-end">
                        <View className="bg-green-50 px-3 py-2 rounded-2xl flex-row items-center mb-2">
                            <MaterialCommunityIcons name="star" size={16} color="#2e7d32" />
                            <Text className="text-green-800 font-bold ml-1">{storeDetails?.rating || mart.rating}</Text>
                        </View>
                        <View className="px-3 py-1.5 rounded-xl border bg-green-100 border-green-200">
                            <Text className="text-[10px] font-black uppercase tracking-tighter text-green-700">
                                {storeDetails?.status || mart.status || 'OPEN'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center mt-4 border-t border-gray-50 pt-4">
                    <View className="flex-row items-center mr-6">
                        <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-2">
                            <MaterialCommunityIcons name="clock-outline" size={18} color="#2563eb" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-gray-400 font-bold uppercase">Delivery</Text>
                            <Text className="text-xs font-black text-gray-900">{storeDetails?.deliveryTime || mart.deliveryTime}</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center mr-2">
                            <MaterialCommunityIcons name="moped" size={18} color="#2e7d32" />
                        </View>
                        <View>
                            <Text className="text-[10px] text-gray-400 font-bold uppercase">Fee</Text>
                            <Text className="text-xs font-black text-gray-900">Rs. {storeDetails?.deliveryFee || mart.deliveryFee || 0}</Text>
                        </View>
                    </View>
                </View>

                {storeVoucher && (
                    <TouchableOpacity onPress={handleVoucherClaim} activeOpacity={0.7} className="mt-6 bg-pink-50 p-4 rounded-3xl flex-row items-center border border-pink-100">
                        <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="#db2777" />
                        <View className="ml-3 flex-1">
                            <Text className="text-pink-900 font-black text-sm">{storeVoucher.description || `Save Rs. ${storeVoucher.value}`}</Text>
                            <Text className="text-pink-700/70 text-[10px] font-bold">Use code: {storeVoucher.code} • Min Rs. {storeVoucher.minSpend}</Text>
                        </View>
                        <MaterialCommunityIcons name="content-copy" size={18} color="#db2777" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const ProductCard = React.memo(({ product, onQuickAdd, isFavourited }: { product: any, onQuickAdd: (p: any) => Promise<void>, isFavourited: boolean }) => {
        const [isAdded, setIsAdded] = useState(false);
        const buttonScale = useSharedValue(1);
        const iconOpacity = useSharedValue(1);
        
        const animatedButtonStyle = useAnimatedStyle(() => ({
            transform: [{ scale: buttonScale.value }],
            backgroundColor: withTiming(isAdded ? '#22c55e' : '#15803d', { duration: 300 })
        }));

        const animatedIconStyle = useAnimatedStyle(() => ({ opacity: iconOpacity.value }));

        const onAdd = async () => {
            if (isAdded) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            buttonScale.value = withSequence(withSpring(1.2), withSpring(1));
            iconOpacity.value = withTiming(0, { duration: 150 }, (fin) => { if (fin) iconOpacity.value = withTiming(1); });
            setIsAdded(true);
            await onQuickAdd(product);
            setTimeout(() => { setIsAdded(false); }, 2000);
        };

        return (
            <TouchableOpacity 
                className="bg-white rounded-[32px] mb-6 border border-gray-50 shadow-sm overflow-hidden"
                style={{ width: (width - 50) / 2 }}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetail', { product: { ...product, mart: mart.name } })}
            >
                <View className="relative">
                    <Image source={{ uri: product.images?.[0] || 'https://via.placeholder.com/200' }} className="w-full h-40" />
                    {isFavourited && (
                        <View className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-full shadow-sm">
                             <MaterialCommunityIcons name="heart" size={14} color="#ef4444" />
                        </View>
                    )}
                    <Animated.View style={[{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, animatedButtonStyle]}>
                        <TouchableOpacity onPress={onAdd} disabled={isAdded} className="w-full h-full items-center justify-center">
                            <Animated.View style={animatedIconStyle}>
                                <MaterialCommunityIcons name={isAdded ? "check" : "plus"} size={24} color="white" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <View className="p-4">
                    <Text className="text-xs font-black text-gray-900" numberOfLines={1}>{product.name}</Text>
                    <Text className="text-green-700 font-black text-sm mt-1">Rs. {product.price}</Text>
                </View>
            </TouchableOpacity>
        );
    });

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />
            <KeyboardAwareScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[2]}
                enableOnAndroid={true}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {renderHeader()}
                <View className="px-5 mb-4">
                    <View className="bg-gray-100 rounded-2xl flex-row items-center px-4 py-3">
                        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
                        <TextInput 
                            placeholder={`Search in ${mart.name}`}
                            className="flex-1 ml-2 font-bold text-sm text-gray-800"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <View className="bg-white border-b border-gray-50 pt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-4">
                        {displayCategories.map(cat => (
                            <TouchableOpacity 
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                className={`mr-4 px-6 py-2.5 rounded-2xl ${selectedCategory === cat ? 'bg-green-700' : 'bg-gray-50'}`}
                            >
                                <Text className={`font-black text-xs uppercase tracking-tighter ${selectedCategory === cat ? 'text-white' : 'text-gray-500'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View className="px-5 pt-6 pb-20">
                    <Text className="text-lg font-black text-gray-900 mb-6 tracking-tighter uppercase">{selectedCategory} Items</Text>
                    
                    {isLoading ? (
                         <View className="py-10 items-center">
                            <ActivityIndicator size="small" color="#15803d" />
                            <Text className="mt-4 text-gray-400 font-bold">Loading...</Text>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between" style={{ opacity: isSearching ? 0.6 : 1 }}>
                            {products.map((product: any) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onQuickAdd={handleQuickAdd}
                                    isFavourited={favourites?.some((f: any) => f.id === product.id) || false}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </KeyboardAwareScrollView>

            {cartCount > 0 && (
                <View className="absolute left-0 right-0 items-center z-50 px-5" style={{ bottom: Math.max(insets.bottom, 20) }}>
                    <TouchableOpacity 
                        className="bg-green-700 h-[70px] rounded-[30px] flex-row items-center px-6 shadow-2xl"
                        style={{ width: '100%' }}
                        onPress={() => navigation.navigate('Main', { screen: 'CartTab' })}
                    >
                        <View className="bg-white rounded-2xl w-10 h-10 items-center justify-center mr-4">
                            <Text className="text-green-700 font-black text-lg">{cartCount}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-black text-lg">View Cart</Text>
                        </View>
                        <Text className="text-white font-black text-lg">Rs. {cartTotal.toLocaleString()}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
