import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'cod' | 'wallet';
  label: string; 
  last4?: string;
  expiry?: string;
  isDefault?: boolean;
  balance?: string; 
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'visa', label: 'Visa Classic', last4: '4242', expiry: '12/26', isDefault: true },
  { id: '2', type: 'mastercard', label: 'MasterCard', last4: '8888', expiry: '09/25', isDefault: false },
  { id: '3', type: 'cod', label: 'Cash on Delivery', isDefault: false },
  { id: '4', type: 'wallet', label: 'ZimCart Wallet', balance: '$45.50', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

  const getCardIcon = (type: string) => {
      switch(type) {
          case 'visa': return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png';
          case 'mastercard': return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png';
          case 'cod': return null; 
          case 'wallet': return null;
          default: return null;
      }
  };

  const setDefault = (id: string) => {
      setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-200 z-10 flex-row items-center justify-between shadow-sm">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Payment Methods</Text>
          <View className="w-10" /> 
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
      >
          
          <Text className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-4 ml-1">My Cards & Wallet</Text>

          {methods.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className={`bg-white rounded-2xl p-5 mb-4 border ${item.isDefault ? 'border-primary bg-green-50/10' : 'border-gray-100'} shadow-sm relative overflow-hidden active:scale-[0.99] transition-transform`}
                onPress={() => setDefault(item.id)}
              >
                  {/* Default Badge */}
                  {item.isDefault && (
                      <View className="absolute top-0 right-0 bg-primary px-3 py-1 rounded-bl-xl z-10">
                          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Default</Text>
                      </View>
                  )}

                  <View className="flex-row items-center">
                      
                      {/* Icon / Local Image */}
                      <View className={`w-14 h-10 rounded-lg items-center justify-center mr-4 border border-gray-100 ${item.type === 'cod' ? 'bg-green-100' : item.type === 'wallet' ? 'bg-orange-100' : 'bg-white'}`}>
                          {item.type === 'cod' ? (
                              <MaterialCommunityIcons name="cash-multiple" size={24} color="#2e7d32" />
                          ) : item.type === 'wallet' ? (
                              <MaterialCommunityIcons name="wallet" size={24} color="#F97316" />
                          ) : (
                              <Image 
                                source={{ uri: getCardIcon(item.type) || '' }} 
                                className="w-10 h-6" 
                                resizeMode="contain" 
                              />
                          )}
                      </View>

                      <View className="flex-1">
                          <Text className="text-base font-bold text-gray-900">{item.label}</Text>
                          {item.type === 'wallet' ? (
                              <Text className="text-sm font-bold text-primary mt-0.5">Balance: {item.balance}</Text>
                          ) : item.last4 ? (
                              <Text className="text-sm text-gray-500 font-medium mt-0.5">•••• •••• •••• {item.last4}</Text>
                          ) : (
                              <Text className="text-sm text-gray-500 font-medium mt-0.5">Pay with cash upon delivery</Text>
                          )}
                      </View>

                      {/* Radio Check */}
                      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${item.isDefault ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                          {item.isDefault && <MaterialCommunityIcons name="check" size={14} color="white" />}
                      </View>
                  </View>
                  
                  {/* Card Expiry for Credit Cards */}
                  {(item.type === 'visa' || item.type === 'mastercard') && (
                      <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-50">
                           <Text className="text-xs text-gray-400 font-medium">Expires {item.expiry}</Text>
                           <TouchableOpacity>
                               <Text className="text-xs font-bold text-gray-400">Edit</Text>
                           </TouchableOpacity>
                      </View>
                  )}
              </TouchableOpacity>
          ))}

          {/* Add New Card Button */}
          <TouchableOpacity className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl p-4 flex-row items-center justify-center active:bg-gray-50">
              <MaterialCommunityIcons name="credit-card-plus-outline" size={24} color="#6B7280" />
              <Text className="text-gray-600 font-bold ml-2">Add New Card</Text>
          </TouchableOpacity>

      </ScrollView>

    </View>
  );
}
