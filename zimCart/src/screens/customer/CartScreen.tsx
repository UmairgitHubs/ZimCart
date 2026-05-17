    import React, { useState, useMemo } from 'react';
    import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import { MaterialCommunityIcons } from '@expo/vector-icons';
    import { StatusBar } from 'expo-status-bar';
    import { useNavigation } from '@react-navigation/native';
    import { goToMainTab } from '@/utils/navigation';
    import { useQueryClient } from '@tanstack/react-query';
    import { useSelector } from 'react-redux';
    import { useCart } from '@/hooks/useCart';
    import { useAddresses, useOrderPreview } from '@/hooks/useCustomer';
    import { customerApi } from '@/services/customer';
    import { parseApiError } from '@/utils/errorUtils';
    import { RootState } from '@/store';

    const { width } = Dimensions.get('window');

    const PAYMENT_METHODS = [
        { id: 'wallet', label: 'Zimli Wallet', icon: 'wallet-outline', color: '#15803d', balance: 'Rs. 2,450' },
        { id: 'card', label: 'Credit Card', icon: 'credit-card-outline', color: '#1d4ed8', sub: 'Visa ••• 4242' },
        { id: 'cod', label: 'Cash on Delivery', icon: 'cash-multiple', color: '#374151', sub: 'Pay at doorstep' },
    ];


    export default function CartScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: cartData, update, remove, clear, isLoading: isCartLoading } = useCart();
    const { data: addresses } = useAddresses();
    
    const [instructions, setInstructions] = useState('');
    const [step, setStep] = useState<'cart' | 'payment'>('cart');
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Discount Engine State
    const [promoCode, setPromoCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
    const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);

    const cartItems = useMemo(() => cartData?.items || [], [cartData]);

    const checkoutStoreId = cartItems[0]?.product?.storeId as string | undefined;
    const hasMixedStores = useMemo(() => {
        if (cartItems.length <= 1) return false;
        const ids = new Set(cartItems.map((i: { product: { storeId: string } }) => i.product.storeId));
        return ids.size > 1;
    }, [cartItems]);

    const previewItems = useMemo(
        () =>
            cartItems.map((item: { productId: string; quantity: number }) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        [cartItems]
    );

    const storeInfo = cartItems[0]?.product?.store;
    const localDeliveryFee =
        cartItems.length === 0 ? 0 : Number(storeInfo?.deliveryFee ?? 0);

    const { data: preview, isFetching: isPreviewLoading, refetch: refetchPreview } = useOrderPreview({
        storeId: checkoutStoreId,
        items: previewItems,
        deliveryFee: localDeliveryFee,
        voucherCode: appliedVoucher?.code ? String(appliedVoucher.code).trim() : undefined,
        enabled: !hasMixedStores && !!checkoutStoreId && cartItems.length > 0,
    });

    const updateQty = async (itemId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            Alert.alert("Remove Item", "Do you want to remove this item from your basket?", [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => remove(itemId) }
            ]);
        } else {
            await update({ id: itemId, quantity: newQty });
        }
    };

    const subtotal =
        preview?.subtotal ??
        cartItems.reduce((acc: number, curr: { product: { price: number }; quantity: number }) => acc + curr.product.price * curr.quantity, 0);
    const deliveryFee = preview?.deliveryFee ?? (cartItems.length === 0 ? 0 : localDeliveryFee);
    const platformFee = preview?.platformFee ?? (subtotal === 0 ? 0 : 20);
    const discountAmount = preview?.discount ?? 0;
    const total = preview?.total ?? Math.max(0, subtotal + deliveryFee + platformFee - discountAmount);

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setIsCheckingVoucher(true);
        try {
            const voucher = await customerApi.validateVoucher(promoCode);
            if (subtotal < (voucher.minSpend || 0)) {
                Alert.alert("Requirement Not Met", `This code requires a minimum spend of Rs. ${voucher.minSpend}`);
            } else {
                setAppliedVoucher(voucher);
                await refetchPreview();
                Alert.alert("Voucher Applied!", `You've saved Rs. ${voucher.discountType === 'FIXED' ? voucher.value : voucher.value + '%'}`);
            }
        } catch (error: any) {
            Alert.alert("Invalid Code", "This promo code is either expired or incorrect.");
            setAppliedVoucher(null);
        } finally {
            setIsCheckingVoucher(false);
        }
    };


    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;
        if (hasMixedStores) {
            Alert.alert(
                'Multiple stores',
                'Your basket has items from more than one mart. Remove extras or clear the cart before checkout.'
            );
            return;
        }
        if (!checkoutStoreId) return;

        setIsProcessing(true);
        try {
            const latest = await customerApi.previewOrder({
                storeId: checkoutStoreId,
                items: previewItems,
                deliveryFee: localDeliveryFee,
                voucherCode: appliedVoucher?.code ? String(appliedVoucher.code).trim() : undefined,
            });

            const orderData = {
                storeId: checkoutStoreId,
                items: previewItems,
                subtotal: latest.subtotal,
                deliveryFee: latest.deliveryFee,
                platformFee: latest.platformFee,
                discount: latest.discount,
                ...(appliedVoucher?.code
                    ? { voucherCode: String(appliedVoucher.code).trim() }
                    : {}),
                total: latest.total,
                address: (() => {
                    const savedTarget = addresses?.find((a: any) => a.isDefault) || addresses?.[0];
                    if (savedTarget) {
                        return JSON.stringify({
                            address: savedTarget.address,
                            detail: savedTarget.detail,
                            instructions: instructions || savedTarget.instructions
                        });
                    }
                    return "No Address Selected";
                })(),
                paymentMethod: selectedPayment === 'wallet' ? 'Zimli Wallet' : selectedPayment === 'card' ? 'Credit Card' : 'Cash on Delivery'
            };

            await customerApi.placeOrder(orderData);
            await clear(); // Clear persistent cart on backend
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            setAppliedVoucher(null);
            setPromoCode('');
            
            setIsProcessing(false);
            setIsSuccess(true);
        } catch (error: unknown) {
            setIsProcessing(false);
            Alert.alert("Order failed", parseApiError(error));
        }
    };

    if (!isAuthenticated) {
        return (
            <View className="flex-1 bg-white items-center justify-center px-8">
                <StatusBar style="dark" />
                <MaterialCommunityIcons name="basket-outline" size={72} color="#D1D5DB" />
                <Text className="text-2xl font-black text-gray-900 mt-6 mb-2">Sign in to shop</Text>
                <Text className="text-gray-500 text-center mb-8">
                    Log in to add items, view your basket, and place orders.
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CustomerLogin')}
                    className="bg-green-700 w-full py-4 rounded-2xl items-center mb-3"
                >
                    <Text className="text-white font-black text-lg">Log in</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerRegister')}>
                    <Text className="text-green-700 font-bold">Create account</Text>
                </TouchableOpacity>
                <Text className="text-gray-400 text-xs mt-8 text-center">
                    Demo: customer@demo.zimcart.com / Demo1234!
                </Text>
            </View>
        );
    }

    if (isCartLoading && !cartData) {
        return (
            <View key="loading-screen" className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#15803d" />
            </View>
        );
    }

    if (isSuccess) {
        return (
            <View key="success-screen" className="flex-1 bg-white items-center justify-center p-8">
                <StatusBar style="dark" />
                <View className="w-40 h-40 bg-green-50 rounded-full items-center justify-center mb-8">
                    <View className="bg-green-600 w-24 h-24 rounded-full items-center justify-center shadow-xl shadow-green-900/40">
                        <MaterialCommunityIcons name="check" size={60} color="white" />
                    </View>
                </View>
                <Text className="text-3xl font-black text-gray-900 mb-2">Order Success!</Text>
                <Text className="text-gray-400 text-center mb-12 text-base font-medium px-4">
                    Your order has been placed. Sit back and relax!
                </Text>
                <TouchableOpacity 
                onPress={() => {
                    setIsSuccess(false);
                    setStep('cart');
                    queryClient.invalidateQueries({ queryKey: ['cart'] });
                    goToMainTab(navigation, 'HomeTab');
                }}
                className="bg-green-700 w-full h-[60px] rounded-[30px] items-center justify-center shadow-2xl shadow-green-900/40"
                >
                    <Text className="text-white font-black text-lg">Back to Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View key="main-screen" className="flex-1 bg-[#F9FAFB]">
        <StatusBar style="dark" />
        
        {/* Editorial Header */}
        <View style={{ paddingTop: insets.top }} className="bg-white px-5 pb-6 rounded-b-[40px] shadow-sm z-10">
            <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity 
                    onPress={() => step === 'payment' ? setStep('cart') : navigation.goBack()}
                    className="w-11 h-11 bg-gray-50 rounded-full items-center justify-center"
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        {step === 'cart' ? 'My Basket' : 'Payment'}
                    </Text>
                    <Text className="text-gray-900 font-black text-xl">Checkout</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => clear()} 
                    className="w-11 h-11 bg-gray-50 rounded-full items-center justify-center"
                    disabled={cartItems.length === 0}
                >
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color={cartItems.length > 0 ? "#EF4444" : "#D1D5DB"} />
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
            {hasMixedStores && cartItems.length > 0 && (
                <View className="mx-5 mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex-row items-start">
                    <MaterialCommunityIcons name="alert-circle" size={22} color="#b91c1c" style={{ marginTop: 2 }} />
                    <View className="flex-1 ml-3">
                        <Text className="text-red-800 font-black text-sm">One mart per order</Text>
                        <Text className="text-red-700 text-xs mt-1 leading-4">
                            Remove items from other stores or empty your basket to continue checkout.
                        </Text>
                        <TouchableOpacity onPress={() => clear()} className="mt-2">
                            <Text className="text-red-800 font-bold text-xs uppercase">Clear cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {step === 'cart' ? (
                <View key="cart-step" className="px-5 mt-6">

                    {/* Cart Items */}
                    <Text className="text-lg font-black text-gray-900 mb-4 tracking-tighter uppercase">Your Items ({cartItems.length})</Text>
                    {cartItems.length === 0 ? (
                        <View className="bg-white p-12 rounded-[32px] items-center justify-center border border-dashed border-gray-200">
                            <MaterialCommunityIcons name="basket-outline" size={64} color="#D1D5DB" />
                            <Text className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Your basket is empty</Text>
                        </View>
                    ) : cartItems.map((item: any) => (
                        <View key={item.id} className="bg-white p-4 rounded-[32px] mb-4 flex-row items-center shadow-sm border border-gray-50">
                            <Image source={{ uri: item.product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200' }} className="w-20 h-20 rounded-2xl" />
                            <View className="flex-1 ml-4">
                                <Text className="text-sm font-black text-gray-900 mb-0.5" numberOfLines={1}>{item.product.name}</Text>
                                <Text className="text-[10px] text-gray-400 font-bold uppercase">
                                    {item.variants ? Object.values(item.variants).join(' • ') : 'Standard'}
                                </Text>
                                <Text className="text-green-700 font-black text-base mt-1">Rs. {item.product.price}</Text>
                            </View>
                            <View className="items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                <TouchableOpacity onPress={() => updateQty(item.id, item.quantity, 1)} className="w-7 h-7 bg-white rounded-xl items-center justify-center shadow-sm">
                                    <MaterialCommunityIcons name="plus" size={14} color="#15803d" />
                                </TouchableOpacity>
                                <Text className="text-gray-900 font-black text-xs my-1.5">{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQty(item.id, item.quantity, -1)} className="w-7 h-7 bg-white rounded-xl items-center justify-center shadow-sm">
                                    <MaterialCommunityIcons name="minus" size={14} color="#374151" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Delivery Notes */}
                    <View className="mt-4">
                        <Text className="text-lg font-black text-gray-900 mb-4 tracking-tighter uppercase">Delivery Notes</Text>
                        <View className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex-row items-center">
                            <MaterialCommunityIcons name="notebook-outline" size={24} color="#9CA3AF" />
                            <TextInput 
                                placeholder="Allergic to peanuts? Leave at door?"
                                className="flex-1 ml-4 font-bold text-gray-700 text-sm"
                                placeholderTextColor="#9CA3AF"
                                value={instructions}
                                onChangeText={setInstructions}
                            />
                        </View>
                    </View>
                </View>
            ) : (
                <View key="payment-step" className="px-5 mt-6">
                    <Text className="text-lg font-black text-gray-900 mb-6 tracking-tighter uppercase">Payment Method</Text>
                    {PAYMENT_METHODS.map(method => (
                        <TouchableOpacity 
                            key={`${method.id}-${selectedPayment === method.id}`}
                            onPress={() => setSelectedPayment(method.id)}
                            className={`bg-white p-5 rounded-[32px] mb-4 flex-row items-center border-2 ${selectedPayment === method.id ? 'border-green-600' : 'border-transparent shadow-sm'}`}
                        >
                            <View style={{ backgroundColor: method.color + '20' }} className="w-12 h-12 rounded-2xl items-center justify-center shadow-sm">
                                <MaterialCommunityIcons name={method.icon as any} size={24} color={method.color} />
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-sm font-black text-gray-900">{method.label}</Text>
                                <Text className="text-[10px] text-gray-400 font-bold uppercase">{method.balance || method.sub}</Text>
                            </View>
                            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedPayment === method.id ? 'border-green-600 bg-green-600' : 'border-gray-200'}`}>
                                {selectedPayment === method.id && <MaterialCommunityIcons name="check" size={14} color="white" />}
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View className="mt-8 p-6 bg-green-600 rounded-[32px] shadow-xl shadow-green-900/40 relative overflow-hidden">
                        <MaterialCommunityIcons name="shield-check" size={100} color="white" style={{ position: 'absolute', right: -24, top: -24, opacity: 0.1 }} />
                        <Text className="text-white font-black text-base mb-2">Payment note</Text>
                        <Text className="text-green-50/80 text-[10px] font-bold uppercase tracking-widest leading-4">
                          {selectedPayment === 'cod'
                            ? 'Pay the rider or store on delivery. Your order is recorded as payment pending until confirmed.'
                            : 'Card and wallet payments stay pending until our team confirms receipt.'}
                        </Text>
                    </View>
                </View>
            )}

            {/* Promo Code Engine */}
            <View className="px-5 mt-8">
                <Text className="text-lg font-black text-gray-900 mb-4 tracking-tighter uppercase">Promo Codes</Text>
                <View className="bg-white p-2 rounded-[32px] border border-gray-50 shadow-sm flex-row items-center">
                    <View className="bg-gray-50 w-12 h-12 rounded-[24px] items-center justify-center ml-1">
                        <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="#9CA3AF" />
                    </View>
                    <TextInput 
                        placeholder="Enter Promo Code"
                        className="flex-1 ml-4 font-black text-gray-800 text-sm"
                        placeholderTextColor="#9CA3AF"
                        value={promoCode}
                        onChangeText={setPromoCode}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity 
                        onPress={handleApplyPromo}
                        disabled={isCheckingVoucher || !promoCode}
                        className={`px-6 h-12 rounded-[24px] items-center justify-center ${promoCode ? 'bg-green-700' : 'bg-gray-100'}`}
                    >
                        {isCheckingVoucher ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className={`font-black text-xs uppercase ${promoCode ? 'text-white' : 'text-gray-400'}`}>Apply</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {appliedVoucher && (
                    <View className="mt-3 flex-row items-center px-4">
                        <MaterialCommunityIcons name="check-circle" size={16} color="#15803d" />
                        <Text className="ml-2 text-green-700 font-extrabold text-xs">Code {appliedVoucher.code} Applied!</Text>
                        <TouchableOpacity onPress={() => { setAppliedVoucher(null); setPromoCode(''); }} className="ml-auto">
                            <Text className="text-red-500 font-bold text-xs">Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Bill Detail */}
            <View className="px-5 mt-10">
                <Text className="text-lg font-black text-gray-900 mb-4 tracking-tighter uppercase">Bill Summary</Text>
                <View className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50">
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-400 font-bold text-xs uppercase">Item Total</Text>
                        <Text className="text-gray-900 font-black text-sm">Rs. {subtotal}</Text>
                    </View>
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-400 font-bold text-xs uppercase">Delivery Fee</Text>
                        <Text className={`font-black text-sm ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-3 text-red-500">
                        <Text className="text-gray-400 font-bold text-xs uppercase">Platform Fee</Text>
                        <Text className="text-gray-900 font-black text-sm">Rs. {platformFee}</Text>
                    </View>
                    {discountAmount > 0 && (
                        <View className="flex-row justify-between mb-5 bg-green-50 p-3 rounded-2xl border border-green-100">
                            <Text className="text-green-700 font-bold text-[10px] uppercase tracking-widest">Voucher Discount</Text>
                            <Text className="text-green-700 font-black text-sm">- Rs. {discountAmount}</Text>
                        </View>
                    )}
                    <View className="h-[1.5px] bg-gray-50 mb-5 rounded-full" />
                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-900 font-black text-lg uppercase tracking-tighter">Grand Total</Text>
                        <Text className="text-2xl font-black text-green-700">Rs. {total}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>

        {/* Flagship Sticky Action Suite */}
        <View 
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 items-center justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            style={{ paddingBottom: Math.max(insets.bottom, 20), paddingTop: 16 }}
        >
            <View className="flex-row items-center justify-between px-5" style={{ width: '100%', maxWidth: 650 }}>
                <View className="flex-1 pr-4">
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Payable</Text>
                    <Text className="text-gray-900 font-black text-2xl">Rs. {total}</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => cartItems.length > 0 && !hasMixedStores && (step === 'cart' ? setStep('payment') : handlePlaceOrder())}
                    className={`h-[64px] rounded-[32px] flex-row items-center px-8 shadow-2xl ${cartItems.length > 0 && !hasMixedStores ? 'bg-green-700 shadow-green-900/60' : 'bg-gray-300 shadow-none'}`}
                    activeOpacity={0.9}
                    disabled={cartItems.length === 0 || hasMixedStores || (step === 'payment' && isPreviewLoading)}
                >
                    {isProcessing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-black text-base uppercase tracking-tight mr-2">
                                {step === 'cart' ? 'Payment' : 'Place Order'}
                            </Text>
                            <MaterialCommunityIcons name={step === 'cart' ? "arrow-right" : "check-all"} size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>

        <Modal transparent visible={isProcessing}>
            <View className="flex-1 bg-black/60 items-center justify-center p-10">
                <View className="bg-white p-10 rounded-[40px] items-center w-full shadow-2xl">
                    <ActivityIndicator size="large" color="#15803d" />
                    <Text className="mt-6 font-black text-gray-900 text-lg uppercase tracking-tighter">Verifying Order</Text>
                    <Text className="mt-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Securing your payment...</Text>
                </View>
            </View>
        </Modal>
        </View>
    );
    }
