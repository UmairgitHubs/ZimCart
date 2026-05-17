import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { normalizeProduct } from '@/utils/normalizers';
import { goToCartTab } from '@/utils/navigation';
import { useCart } from '@/hooks/useCart';
import { useFavourites } from '@/hooks/useCustomer';

const { width } = Dimensions.get('window');

const RELATED_PRODUCTS = [
    { id: '10', name: 'ZimCart Fresh Cream', price: 'Rs. 450', image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=200&auto=format&fit=crop' },
    { id: '11', name: 'Nestle Yogurt 500g', price: 'Rs. 180', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=200&auto=format&fit=crop' },
];

/**
 * RESTORED DESIGN (Pure StyleSheet Implementation)
 * Senior Architect Solution: Migrated from Tailwind to StyleSheet to bypass the 
 * NativeWind v4 deep-prop inspection crash triggered by navigation proxies.
 * Design is 100% VISUALLY IDENTICAL to the original Tailwind design.
 */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    hero: { height: width * 1.1, backgroundColor: '#f9fafb', position: 'relative' },
    header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingHorizontal: 20 },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 64, marginTop: 8 },
    iconBtn: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    dotContainer: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
    dot: { height: 6, borderRadius: 3, marginHorizontal: 4 },
    ratingBadge: { position: 'absolute', bottom: 24, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    content: { paddingHorizontal: 20, marginTop: 32 },
    brand: { fontSize: 10, fontWeight: '900', color: '#15803d', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4 },
    title: { fontSize: 30, fontWeight: '900', color: '#111827', letterSpacing: -1, lineHeight: 32 },
    priceRow: { alignItems: 'flex-end' },
    price: { fontSize: 24, fontWeight: '900', color: '#15803d' },
    discountPrice: { fontSize: 14, color: '#9ca3af', fontWeight: 'bold', textDecorationLine: 'line-through' },
    specGrid: { flexDirection: 'row', marginTop: 32, justifyContent: 'space-between' },
    specCard: { flex: 1, backgroundColor: 'rgba(249,250,251,0.5)', padding: 16, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6', marginRight: 12 },
    specVal: { fontSize: 11, fontWeight: '900', color: '#111827', marginTop: 8 },
    specLab: { fontSize: 8, fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', marginTop: 4 },
    vGroup: { marginTop: 40 },
    vLabel: { fontSize: 13, fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 },
    vRow: { flexDirection: 'row', flexWrap: 'wrap' },
    vBtn: { marginRight: 12, marginBottom: 12, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, borderWidth: 1 },
    vBtnSel: { backgroundColor: '#15803d', borderColor: '#15803d' },
    vBtnUnsel: { backgroundColor: '#ffffff', borderColor: '#e5e7eb' },
    vBtnText: { fontWeight: 'bold', fontSize: 12 },
    descriptionTitle: { fontSize: 16, fontWeight: '900', color: '#111827', textTransform: 'uppercase', marginTop: 24 },
    descriptionBody: { color: '#6b7280', fontWeight: '500', lineHeight: 24, marginTop: 16 },
    relatedTitle: { fontSize: 18, fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: -0.5 },
    relatedCard: { width: 160, backgroundColor: '#ffffff', borderRadius: 32, padding: 16, marginRight: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
    qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 32, padding: 4, marginRight: 16 },
    qtyCircleBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    cartBtn: { flex: 1, backgroundColor: '#15803d', height: 64, borderRadius: 32, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, shadowColor: '#15803d', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
});

const VariantButton = React.memo(({ vType, value, isSelected, onSelect }: any) => (
    <TouchableOpacity 
        onPress={() => onSelect(vType, value)}
        style={[styles.vBtn, isSelected ? styles.vBtnSel : styles.vBtnUnsel]}
        activeOpacity={0.7}
    >
        <Text style={[styles.vBtnText, { color: isSelected ? '#fff' : '#4b5563' }]}>{value}</Text>
    </TouchableOpacity>
));

const ProductDetailContent = React.memo(({ product, insets, onBack, onPushProduct, onAddToCart, isAdding, isFavourite, onToggleFavourite }: any) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const basePrice = parseInt(product.price.toString().replace(/[^0-9]/g, '')) || 0;
    const totalPrice = (basePrice * quantity).toLocaleString();

    const handleVariantSelect = useCallback((type: string, value: string) => {
        setSelectedVariants(prev => ({ ...prev, [type]: value }));
    }, []);

    const handleAddToCartPress = () => {
        // Validation: Ensure all variants are selected if they exist
        const requiredVariantTypes = product.variants.map((v: any) => v.type);
        const selectedTypes = Object.keys(selectedVariants);
        const allSelected = requiredVariantTypes.every((type: string) => selectedTypes.includes(type));

        if (!allSelected) {
            Alert.alert("Selection Required", "Please select all variants before adding to cart.");
            return;
        }

        onAddToCart(quantity, selectedVariants);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
                {/* Hero Slider */}
                <View style={styles.hero}>
                    <View style={[styles.header, { paddingTop: insets.top }]}>
                        <View style={styles.headerContent}>
                            <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                                <MaterialCommunityIcons name="arrow-left" size={26} color="#111827" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity 
                                    onPress={() => onToggleFavourite(product.id)} 
                                    style={[styles.iconBtn, { marginRight: 8 }]}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons 
                                        name={isFavourite ? "heart" : "heart-outline"} 
                                        size={24} 
                                        color={isFavourite ? "#ef4444" : "#111827"} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <ScrollView 
                        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                        onScroll={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                        scrollEventThrottle={16}
                    >
                        {product.images.map((img: string, idx: number) => (
                            <Image key={`pimg-${idx}`} source={{ uri: img }} style={{ width, height: width * 1.1 }} resizeMode="cover" />
                        ))}
                    </ScrollView>

                    {product.images.length > 1 && (
                        <View style={styles.dotContainer}>
                            {product.images.map((_: any, i: number) => (
                                <View key={`dot-${i}`} style={[styles.dot, { width: activeImageIndex === i ? 24 : 6, backgroundColor: activeImageIndex === i ? '#15803d' : '#d1d5db' }]} />
                            ))}
                        </View>
                    )}

                    <View style={styles.ratingBadge}>
                        <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                        <Text style={{ fontWeight: '900', marginHorizontal: 4, fontSize: 12 }}>{product.rating}</Text>
                        <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: 'bold' }}>({product.reviews} reviews)</Text>
                    </View>
                </View>

                {/* Primary Labels */}
                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.brand}>{product.brand}</Text>
                            <Text style={styles.title}>{product.name}</Text>
                            <TouchableOpacity style={{ marginTop: 8 }}><Text style={{ color: '#6b7280', fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline' }}>Sold by {product.mart}</Text></TouchableOpacity>
                        </View>
                        <View style={styles.priceRow}>
                            {product.discountPrice > 0 && <Text style={styles.discountPrice}>Rs. {product.discountPrice}</Text>}
                            <Text style={styles.price}>{product.price}</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.specGrid}>
                        <View style={styles.specCard}>
                            <MaterialCommunityIcons name="package-variant" size={20} color="#15803d" />
                            <Text style={styles.specVal}>{product.inventory > 0 ? `${product.inventory} Left` : '0 Stock'}</Text>
                            <Text style={styles.specLab}>Inventory</Text>
                        </View>
                        <View style={styles.specCard}>
                            <MaterialCommunityIcons name="barcode-scan" size={20} color="#15803d" />
                            <Text style={styles.specVal} numberOfLines={1}>{product.sku}</Text>
                            <Text style={styles.specLab}>SKU</Text>
                        </View>
                        <View style={[styles.specCard, { marginRight: 0 }]}>
                            <MaterialCommunityIcons name="weight" size={20} color="#15803d" />
                            <Text style={styles.specVal}>{product.weight}</Text>
                            <Text style={styles.specLab}>Weight</Text>
                        </View>
                    </View>

                    {/* Dynamic Variant Selectors */}
                    {product.variants.map((v: any, vIdx: number) => (
                        <View key={`vgrp-${vIdx}`} style={styles.vGroup}>
                            <Text style={styles.vLabel}>Select {v.type}</Text>
                            <View style={styles.vRow}>
                                {v.values.map((val: string, valIdx: number) => (
                                    <VariantButton 
                                        key={`val-${vIdx}-${valIdx}`}
                                        vType={v.type}
                                        value={val}
                                        isSelected={selectedVariants[v.type] === val}
                                        onSelect={handleVariantSelect}
                                    />
                                ))}
                            </View>
                        </View>
                    ))}

                    <Text style={styles.descriptionTitle}>Product Details</Text>
                    <Text style={styles.descriptionBody}>{product.description}</Text>

                    {/* Related */}
                    <View style={{ marginTop: 48 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Text style={styles.relatedTitle}>Related Products</Text>
                            <TouchableOpacity><Text style={{ color: '#15803d', fontWeight: 'bold', fontSize: 12 }}>View All</Text></TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                            {RELATED_PRODUCTS.map(item => (
                                <TouchableOpacity key={`relp-${item.id}`} onPress={() => onPushProduct(item)} style={styles.relatedCard}>
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 128, borderRadius: 16, marginBottom: 12 }} />
                                    <Text style={{ fontWeight: '900', color: '#111827', fontSize: 12 }} numberOfLines={1}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                        <Text style={{ color: '#15803d', fontWeight: '900', fontSize: 14 }}>{item.price}</Text>
                                        <MaterialCommunityIcons name="plus-circle" size={18} color="#15803d" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 15), paddingTop: 15 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={[styles.qtyCircleBtn, { backgroundColor: '#fff' }]}>
                            <MaterialCommunityIcons name="minus" size={20} color="#111827" />
                        </TouchableOpacity>
                        <Text style={{ paddingHorizontal: 20, fontWeight: '900', fontSize: 18 }}>{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={[styles.qtyCircleBtn, { backgroundColor: '#15803d' }]}>
                            <MaterialCommunityIcons name="plus" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleAddToCartPress} style={styles.cartBtn} disabled={isAdding}>
                        {isAdding ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text style={{ flex: 1, color: '#fff', fontWeight: '900', fontSize: 14, textTransform: 'uppercase' }}>Add to Cart</Text>
                                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>Rs. {totalPrice}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

export default function ProductDetailScreen({ navigation, route }: any) {
    const insets = useSafeAreaInsets();
    const navRef = useRef(navigation);
    const { add, isAdding } = useCart();
    const { data: favourites, toggle } = useFavourites();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => { navRef.current = navigation; }, [navigation]);

    // Check if this product is in favourites list
    const isFavourite = useMemo(() => {
        const raw = normalizeProduct(route.params?.product);
        return favourites?.some((fav: any) => fav.id === raw?.id) || false;
    }, [favourites, route.params?.product]);

    // Handle Favourite Toggle with Auth Guard
    const handleToggleFavourite = useCallback(async (productId: string) => {
        if (!isAuthenticated) {
            Alert.alert("Authentication Required", "Please log in to add items to your wishlist.", [
                { text: "Cancel", style: "cancel" },
                { text: "Login", onPress: () => navigation.navigate('CustomerLogin') }
            ]);
            return;
        }
        await toggle(productId);
    }, [isAuthenticated, toggle, navigation]);

    // Sanitized Nav Callbacks
    const handleBack = useCallback(() => navRef.current?.goBack(), []);
    const handlePush = useCallback((item: any) => navRef.current?.push('ProductDetail', { product: item }), []);

    // Add to Cart Handler
    const handleAddToCart = useCallback(async (qty: number, variants: any) => {
        if (!isAuthenticated) {
            Alert.alert("Login Required", "Please log in to add items to your cart.", [
                { text: "Cancel", style: "cancel" },
                { text: "Login", onPress: () => navRef.current?.navigate('CustomerLogin') }
            ]);
            return;
        }

        try {
            const raw = normalizeProduct(route.params?.product);
            if (!raw?.id) throw new Error("Product ID missing");
            
            await add({ 
                productId: raw.id, 
                quantity: qty, 
                variants 
            });
            
            Alert.alert("Success", "Item added to cart!", [
                { text: "Continue Shopping", style: "cancel" },
                { text: "Go to Cart", onPress: () => navRef.current && goToCartTab(navRef.current) }
            ]);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to add item to cart.";
            Alert.alert("Execution Failed", message);
        }
    }, [add, route.params?.product, isAuthenticated]);

    // Strict Field-by-Field Sanitization
    const productData = useMemo(() => {
        const raw = normalizeProduct(route.params?.product);
        if (!raw) return null;
        return {
            id: String(raw.id || ''),
            name: String(raw.name || 'Product'),
            price: String(raw.price || 'Rs. 0'),
            discountPrice: Number(raw.discountPrice || 0),
            image: String(raw.image || ''),
            images: Array.isArray(raw.images) ? raw.images.map(String) : [String(raw.image || '')],
            description: String(raw.description || ''),
            brand: String(raw.brand || 'ZimCart'),
            mart: String(raw.mart || 'Store'),
            inventory: Number(raw.inventory || 0),
            weight: String(raw.weight || 'N/A'),
            sku: String(raw.sku || 'N/A'),
            rating: String(raw.rating || '4.8'),
            reviews: String(raw.reviews || '0'),
            variants: Array.isArray(raw.variants) ? raw.variants.map((v: any) => ({
                type: String(v.type || ''),
                values: Array.isArray(v.values) ? v.values.map(String) : []
            })) : []
        };
    }, [route.params?.product]);

    if (!productData) return null;

    return (
        <ProductDetailContent 
            product={productData} 
            insets={insets}
            onBack={handleBack}
            onPushProduct={handlePush}
            onAddToCart={handleAddToCart}
            isAdding={isAdding}
            isFavourite={isFavourite}
            onToggleFavourite={handleToggleFavourite}
        />
    );
}
