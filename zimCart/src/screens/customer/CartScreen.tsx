import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

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
    image: 'https://images.unsplash.com/photo-1550583726-226ff22580fc?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Roma Tomatoes',
    description: '1 kg • Farm Fresh',
    price: 120,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=200&auto=format&fit=crop',
  }
];

const PAYMENT_METHODS = [
    { id: 'wallet', label: 'Zimli Wallet', icon: 'wallet-outline', color: '#15803d', balance: 'Rs. 2,450' },
    { id: 'card', label: 'Credit Card', icon: 'credit-card-outline', color: '#1d4ed8', sub: 'Visa ••• 4242' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'cash-multiple', color: '#374151', sub: 'Pay at doorstep' },
];

const FREE_DELIVERY_THRESHOLD = 1000;

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [instructions, setInstructions] = useState('');
  const [step, setStep] = useState<'cart' | 'payment'>('cart');
  const [selectedPayment, setSelectedPayment] = useState('wallet');
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
  const total = subtotal + deliveryFee + platformFee;

  const progressToFree = Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1);
  const amountNeeded = FREE_DELIVERY_THRESHOLD - subtotal;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
        <View className="flex-1 bg-white items-center justify-center p-8">
            <StatusBar style="dark" />
            <View className="w-40 h-40 bg-green-50 rounded-full items-center justify-center mb-8">
                <View className="bg-green-600 w-24 h-24 rounded-full items-center justify-center shadow-xl shadow-green-900/40">
                    <MaterialCommunityIcons name="check" size={60} color="white" />
                </View>
            </View>
            <Text className="text-3xl font-black text-gray-900 mb-2">Order Success!</Text>
            <Text className="text-gray-400 text-center mb-12 text-base font-medium px-4">
                Your order #ZM-9921 has been placed. Sit back and relax!
            </Text>
            <TouchableOpacity 
               onPress={() => navigation.navigate('Main')}
               className="bg-green-700 w-full h-[60px] rounded-[30px] items-center justify-center shadow-2xl shadow-green-900/40"
            >
                <Text className="text-white font-black text-lg">Back to Shopping</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9FAFB]">
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
              <TouchableOpacity className="w-11 h-11 bg-gray-50 rounded-full items-center justify-center">
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
          </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
          {step === 'cart' ? (
              <View className="px-5 mt-6">
                  {/* Delivery Milestone */}
                  <View className="bg-white p-6 rounded-[32px] mb-6 border border-gray-50 shadow-sm">
                      <View className="flex-row justify-between items-center mb-4">
                          <View>
                              <Text className="text-gray-900 font-black text-base">
                                  {amountNeeded > 0 ? `Rs. ${amountNeeded} to free delivery` : 'Free delivery unlocked!'}
                              </Text>
                              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Fresh Mart Delivery</Text>
                          </View>
                          <MaterialCommunityIcons name="moped" size={28} color={amountNeeded > 0 ? "#E5E7EB" : "#15803d"} />
                      </View>
                      <View className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <View style={{ width: `${progressToFree * 100}%` }} className="h-full bg-green-600 rounded-full" />
                      </View>
                  </View>

                  {/* Cart Items */}
                  <Text className="text-lg font-black text-gray-900 mb-4 tracking-tighter uppercase">Your Items ({cart.length})</Text>
                  {cart.map(item => (
                      <View key={item.id} className="bg-white p-4 rounded-[32px] mb-4 flex-row items-center shadow-sm border border-gray-50">
                          <Image source={{ uri: item.image }} className="w-20 h-20 rounded-2xl" />
                          <View className="flex-1 ml-4">
                              <Text className="text-sm font-black text-gray-900 mb-0.5">{item.name}</Text>
                              <Text className="text-[10px] text-gray-400 font-bold uppercase">{item.description}</Text>
                              <Text className="text-green-700 font-black text-base mt-1">Rs. {item.price}</Text>
                          </View>
                          <View className="items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                              <TouchableOpacity onPress={() => updateQty(item.id, 1)} className="w-7 h-7 bg-white rounded-xl items-center justify-center shadow-sm">
                                  <MaterialCommunityIcons name="plus" size={14} color="#15803d" />
                              </TouchableOpacity>
                              <Text className="text-gray-900 font-black text-xs my-1.5">{item.qty}</Text>
                              <TouchableOpacity onPress={() => updateQty(item.id, -1)} className="w-7 h-7 bg-white rounded-xl items-center justify-center shadow-sm">
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
              <View className="px-5 mt-6">
                   <Text className="text-lg font-black text-gray-900 mb-6 tracking-tighter uppercase">Payment Method</Text>
                   {PAYMENT_METHODS.map(method => (
                       <TouchableOpacity 
                        key={method.id}
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
                       <MaterialCommunityIcons name="shield-check" size={100} color="white" className="absolute -right-6 -top-6 opacity-10" />
                       <Text className="text-white font-black text-base mb-2">Secure Payment</Text>
                       <Text className="text-green-50/80 text-[10px] font-bold uppercase tracking-widest leading-4">Your transaction is encrypted & securely processed by ZimPay gateway.</Text>
                   </View>
              </View>
          )}

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
                  <View className="flex-row justify-between mb-5">
                      <Text className="text-gray-400 font-bold text-xs uppercase">Platform Fee</Text>
                      <Text className="text-gray-900 font-black text-sm">Rs. {platformFee}</Text>
                  </View>
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
                onPress={() => step === 'cart' ? setStep('payment') : handlePlaceOrder()}
                className="bg-green-700 h-[64px] rounded-[32px] flex-row items-center px-8 shadow-2xl shadow-green-900/60"
                activeOpacity={0.9}
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
