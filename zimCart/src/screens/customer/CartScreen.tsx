import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, TextInput, Modal, ActivityIndicator, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}

const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    name: 'Fresh Organic Milk',
    description: '1 Liter • Full Cream',
    price: 180,
    qty: 2,
    image: 'https://images.unsplash.com/photo-1563636619-e91000f21fca?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Red Roma Tomatoes',
    description: '1 kg • Farm Fresh',
    price: 120,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Daily Fresh Eggs',
    description: 'Dozen • Grade A',
    price: 360,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1582722891823-202e7e034449?q=80&w=200&auto=format&fit=crop',
  }
];

const PAYMENT_METHODS = [
    { id: 'wallet', label: 'Zimli Wallet', icon: 'wallet-outline', color: '#8B5CF6', balance: 'Rs. 2,450' },
    { id: 'card', label: 'Credit / Debit Card', icon: 'credit-card-outline', color: '#2563EB', sub: 'Visa •••• 4242' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'cash-multiple', color: '#16A34A', sub: 'Pay at your doorstep' },
];

const FREE_DELIVERY_THRESHOLD = 1000;

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [instructions, setInstructions] = useState('');
  
  // Checkout States
  const [step, setStep] = useState<'cart' | 'payment'>('cart');
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      (item.id === id) ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(item => item.qty > 0));
  };

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 99;
  const platformFee = 20;
  const taxes = Math.round(subtotal * 0.05); 
  const total = subtotal + deliveryFee + platformFee + taxes;

  const progressToFree = Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1);
  const amountNeeded = FREE_DELIVERY_THRESHOLD - subtotal;

  const handlePlaceOrder = () => {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
      }, 2500);
  };

  const resetCart = () => {
      setCart([]);
      setIsSuccess(false);
      setStep('cart');
      navigation.navigate('HomeTab');
  }

  if (isSuccess) {
    return (
        <View style={{ paddingTop: insets.top }} className="flex-1 bg-white items-center justify-center p-10">
            <StatusBar style="dark" backgroundColor="white" translucent />
            <View className="w-48 h-48 bg-green-50 rounded-full items-center justify-center mb-8">
                <MaterialCommunityIcons name="check-circle" size={100} color="#16A34A" />
            </View>
            <Text className="text-3xl font-black text-gray-900 mb-3 text-center">Order Placed!</Text>
            <Text className="text-gray-400 text-center mb-12 text-lg leading-6">
                Your order #ZM-9921 has been placed successfully. You will receive an update shortly.
            </Text>
            <TouchableOpacity 
               onPress={resetCart}
               className="bg-primary w-full py-5 rounded-[24px] shadow-2xl shadow-green-200 flex-row items-center justify-center"
            >
                <Text className="text-white font-black text-xl">Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-white items-center justify-center p-10">
        <StatusBar style="dark" backgroundColor="white" translucent />
        <View className="w-56 h-56 bg-gray-50 rounded-full items-center justify-center mb-10 overflow-hidden">
            <View className="bg-white p-8 rounded-full shadow-2xl shadow-gray-200">
                <MaterialCommunityIcons name="cart-variant" size={80} color="#E5E7EB" />
            </View>
        </View>
        <Text className="text-3xl font-black text-gray-900 mb-3">Your cart is empty</Text>
        <Text className="text-gray-400 text-center mb-12 text-lg leading-6 px-6">
            Explore the best stores in your area and fill your cart with goodies.
        </Text>
        <TouchableOpacity 
           onPress={() => navigation.navigate('HomeTab')}
           className="bg-primary w-full py-5 rounded-[24px] shadow-2xl shadow-green-200 flex-row items-center justify-center"
        >
            <Text className="text-white font-black text-xl mr-3">Explore Stores</Text>
            <MaterialCommunityIcons name="shopping-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="white" translucent />
      
      {/* Real-world Header */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 20) }} 
        className="bg-white px-5 pb-4 flex-row items-center border-b border-gray-50"
      >
          <TouchableOpacity 
            onPress={() => step === 'payment' ? setStep('cart') : navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4"
          >
              <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-1">
              <Text className="text-xl font-black text-gray-900 leading-none">
                  {step === 'cart' ? 'Checkout' : 'Payment Method'}
              </Text>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">{cart.length} items • Mega Mart</Text>
          </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-[#F9FAFB]"
        contentContainerStyle={{ paddingBottom: 180 }}
      >
           {step === 'cart' ? (
               <>
                    {/* Free Delivery Milestone Progress */}
                    <View className="bg-white px-5 py-5 mb-3">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-green-50 items-center justify-center mr-3">
                                    <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="#15803d" />
                                </View>
                                <Text className="font-black text-gray-800 text-[15px]">
                                    {amountNeeded > 0 ? `Rs. ${amountNeeded} more for Free Delivery` : 'You unlocked Free Delivery!'}
                                </Text>
                            </View>
                            <Text className="text-[11px] font-black text-green-700 uppercase tracking-tight">Level 1</Text>
                        </View>
                        <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <View 
                                style={{ width: `${progressToFree * 100}%` }}
                                className="h-full bg-green-600 rounded-full"
                            />
                        </View>
                    </View>

                    {/* Delivery Address Section (Realistic) */}
                    <View className="bg-white px-5 py-5 mb-3 flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center mr-4">
                                <MaterialCommunityIcons name="map-marker-radius" size={22} color="#2e7d32" />
                            </View>
                            <View className="flex-1 pr-4">
                                <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Delivering to</Text>
                                <Text className="text-gray-900 font-black text-[14px]" numberOfLines={1}>107 Street 65, Islamabad, PK</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Text className="text-primary font-black text-xs">Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Items List */}
                    <View className="bg-white px-5 py-4 mb-3">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-black text-gray-900">Your Items</Text>
                        </View>
                        
                        {cart.map((item, idx) => (
                            <View key={item.id} className={`flex-row items-center py-4 ${idx !== cart.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <View className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden mr-4 border border-gray-100">
                                    <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[15px] font-bold text-gray-900 mb-0.5" numberOfLines={1}>{item.name}</Text>
                                    <Text className="text-xs text-gray-400 mb-2 font-medium">{item.description}</Text>
                                    <Text className="text-[15px] font-black text-gray-900">Rs. {item.price * item.qty}</Text>
                                </View>
                                <View className="bg-white rounded-2xl flex-row items-center p-1 border border-gray-100 shadow-sm">
                                    <TouchableOpacity onPress={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-xl bg-gray-50 items-center justify-center">
                                        <MaterialCommunityIcons name="minus" size={16} color="#4B5563" />
                                    </TouchableOpacity>
                                    <Text className="px-3 font-black text-gray-900 text-sm">{item.qty}</Text>
                                    <TouchableOpacity onPress={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-xl bg-primary items-center justify-center">
                                        <MaterialCommunityIcons name="plus" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Delivery Instructions */}
                    <View className="bg-white px-5 py-5 mb-3">
                        <Text className="text-lg font-black text-gray-900 mb-4">Packing Instructions</Text>
                        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <TextInput 
                                placeholder="e.g. Leave at the door, call when arrived..."
                                className="text-gray-800 text-sm font-medium"
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={2}
                                value={instructions}
                                onChangeText={setInstructions}
                            />
                        </View>
                    </View>
               </>
           ) : (
               <View className="px-5 mt-6">
                    <Text className="text-xl font-black text-gray-900 mb-6 px-1">Select Payment Method</Text>
                    {PAYMENT_METHODS.map((method) => {
                        const isSelected = selectedPayment === method.id;
                        return (
                            <TouchableOpacity 
                                key={method.id}
                                onPress={() => {
                                    console.log('Selected payment:', method.id);
                                    setSelectedPayment(method.id);
                                }}
                                activeOpacity={0.7}
                                className={`flex-row items-center p-5 rounded-3xl mb-4 border-2 ${isSelected ? 'bg-white border-primary border-2' : 'bg-white border-gray-100'}`}
                                style={{
                                    elevation: isSelected ? 4 : 0,
                                    shadowColor: isSelected ? method.color : 'transparent',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: isSelected ? 0.1 : 0,
                                    shadowRadius: 10,
                                }}
                            >
                                <View 
                                    style={{ backgroundColor: isSelected ? method.color + '15' : '#F9FAFB' }} 
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                     <MaterialCommunityIcons 
                                        name={method.icon as any} 
                                        size={28} 
                                        color={isSelected ? method.color : '#9CA3AF'} 
                                     />
                                </View>
                                <View className="flex-1">
                                     <Text className={`text-base font-black ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{method.label}</Text>
                                     <Text className="text-xs text-gray-400 font-bold mt-0.5">{method.balance || method.sub}</Text>
                                </View>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                                     {isSelected && <MaterialCommunityIcons name="check" size={14} color="white" />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    <View className="mt-6 p-6 bg-green-50 rounded-3xl border border-green-100 flex-row items-center">
                         <View className="w-10 h-10 bg-green-600 rounded-full items-center justify-center mr-4">
                             <MaterialCommunityIcons name="shield-check" size={24} color="white" />
                         </View>
                         <View className="flex-1">
                             <Text className="text-green-800 font-black text-sm">Secure Payment</Text>
                             <Text className="text-green-600 text-xs font-bold leading-none">Encrypted & Trusted by ZimCart</Text>
                         </View>
                    </View>
               </View>
           )}

           {/* Bill Detail */}
           <View className="bg-white px-5 py-6 mb-3">
                <Text className="text-lg font-black text-gray-900 mb-5">Payment Details</Text>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 font-bold text-sm">Item Total</Text>
                    <Text className="text-gray-900 font-bold text-sm">Rs. {subtotal}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 font-bold text-sm">Delivery Fee</Text>
                    <Text className={`font-black text-sm ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 font-bold text-sm">Platform Fee</Text>
                    <Text className="text-gray-900 font-bold text-sm">Rs. {platformFee}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 font-bold text-sm">Govt. Taxes (5%)</Text>
                    <Text className="text-gray-900 font-bold text-sm">Rs. {taxes}</Text>
                </View>
                <View className="h-[1px] bg-gray-50 my-3" />
                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-xl font-black text-gray-900">Grand Total</Text>
                    <Text className="text-2xl font-black text-primary">Rs. {total}</Text>
                </View>
           </View>

           <View className="items-center px-10 py-6">
                <View className="flex-row items-center opacity-40">
                    <MaterialCommunityIcons name="security" size={16} color="#4B5563" />
                    <Text className="text-[10px] text-gray-600 font-black ml-2 uppercase tracking-tighter">100% Secure Transaction</Text>
                </View>
           </View>
      </ScrollView>

      {/* Modern Fixed Bottom Action Bar */}
      <View 
        style={{ 
            paddingBottom: Math.max(insets.bottom, 20),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
            elevation: 10
        }}
        className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4"
      >
           <TouchableOpacity 
              disabled={isProcessing}
              onPress={() => step === 'cart' ? setStep('payment') : handlePlaceOrder()}
              className="bg-primary w-full h-[64px] rounded-[24px] flex-row items-center justify-between px-6"
              activeOpacity={0.9}
           >
                <View>
                    <Text className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Total to pay</Text>
                    <Text className="text-white font-black text-[20px]">Rs. {total}</Text>
                </View>
                <View className="flex-row items-center bg-white/20 py-2.5 px-5 rounded-[16px]">
                    {isProcessing ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-black text-[16px]">
                                {step === 'cart' ? 'Proceed to Pay' : 'Place Order'}
                            </Text>
                            <MaterialCommunityIcons name={step === 'cart' ? 'arrow-right' : 'check-all'} size={20} color="white" className="ml-2" />
                        </>
                    )}
                </View>
           </TouchableOpacity>
      </View>

      {/* Processing Loader Overlay */}
      <Modal transparent visible={isProcessing} animationType="fade">
          <View className="flex-1 bg-black/50 items-center justify-center">
              <View className="bg-white p-10 rounded-[40px] items-center">
                  <ActivityIndicator size="large" color="#2e7d32" />
                  <Text className="mt-6 font-black text-gray-900 text-lg">Processing Order...</Text>
                  <Text className="mt-1 text-gray-400 font-bold text-xs uppercase tracking-widest text-center px-4">Securely connecting to server</Text>
              </View>
          </View>
      </Modal>
    </View>
  );
}
