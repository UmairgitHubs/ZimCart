import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/services/customer';

interface PaymentMethod {
  id: string;
  type: 'CARD' | 'PAYPAL' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'CASH';
  last4?: string;
  expiry?: string;
  brand?: string;
  token?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isAddMode, setIsAddMode] = useState(false);
  const [newCardData, setNewCardData] = useState({ brand: '', last4: '', expiry: '' });

  const { data: methods = [], isLoading, error } = useQuery<PaymentMethod[]>({
    queryKey: ['paymentMethods'],
    queryFn: customerApi.getPaymentMethods,
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => customerApi.setDefaultPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to set default method');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerApi.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      Alert.alert('Success', 'Payment method removed.');
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to remove payment method');
    }
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => customerApi.addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
      setIsAddMode(false);
      setNewCardData({ brand: '', last4: '', expiry: '' });
      Alert.alert('Success', 'Payment method added successfully.');
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add payment method');
    }
  });

  const getCardIcon = (type: string, brand?: string) => {
      if (type === 'CASH') return null;
      if (type === 'APPLE_PAY') return null;
      if (type === 'GOOGLE_PAY') return null;
      
      const b = brand?.toLowerCase();
      if (b === 'visa') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png';
      if (b === 'mastercard') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png';
      return null;
  };

  const handleSetDefault = (id: string, isCurrentDefault: boolean) => {
      if (!isCurrentDefault) {
          setDefaultMutation.mutate(id);
      }
  };

  const handleDelete = (id: string) => {
      Alert.alert("Remove Method", "Are you sure you want to remove this payment method?", [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", style: "destructive", onPress: () => deleteMutation.mutate(id) }
      ]);
  };

  const handleAddSubmit = () => {
      if (!newCardData.brand || !newCardData.last4 || !newCardData.expiry) {
          Alert.alert("Validation", "Please fill out all fields realistically.");
          return;
      }
      if (newCardData.last4.length !== 4) {
          Alert.alert("Validation", "Card number requires 4 digits (mocked).");
          return;
      }

      addMutation.mutate({
          type: 'CARD', // We default mock adding cards
          brand: newCardData.brand,
          last4: newCardData.last4,
          expiry: newCardData.expiry,
          isDefault: methods.length === 0,
          token: `tok_mock_${Date.now()}`
      });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100 z-10 flex-row items-center justify-between shadow-sm">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full active:bg-gray-200">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-gray-900 tracking-tighter uppercase">Payment Options</Text>
          <View className="w-10" /> 
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 100), paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
      >
          {isLoading ? (
              <View className="flex-1 items-center justify-center mt-20">
                  <ActivityIndicator size="large" color="#15803d" />
              </View>
          ) : error ? (
              <View className="flex-1 items-center justify-center mt-20">
                  <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
                  <Text className="text-gray-900 font-bold mt-4">Failed to load payment methods.</Text>
              </View>
          ) : methods.length === 0 ? (
              <View className="flex-1 items-center justify-center mt-20 px-4">
                  <MaterialCommunityIcons name="credit-card-off-outline" size={80} color="#D1D5DB" />
                  <Text className="text-gray-900 font-black text-xl mt-6 uppercase tracking-tight">No Payment Methods</Text>
                  <Text className="text-gray-400 font-bold text-center mt-2 text-sm">You haven't added any payment methods yet. Add one to checkout faster.</Text>
              </View>
          ) : (
             <>
                <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4 ml-1">Saved Methods</Text>
                
                {methods.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        className={`bg-white rounded-[24px] p-5 mb-4 border ${item.isDefault ? 'border-green-600 bg-green-50/20' : 'border-gray-100'} shadow-sm relative overflow-hidden`}
                        onPress={() => handleSetDefault(item.id, item.isDefault)}
                        activeOpacity={0.8}
                    >
                        {/* Default Badge */}
                        {item.isDefault && (
                            <View className="absolute top-0 right-0 bg-green-600 px-3 py-1.5 rounded-bl-[16px] z-10">
                                <Text className="text-[9px] font-black text-white uppercase tracking-widest">Active Default</Text>
                            </View>
                        )}

                        <View className="flex-row items-center">
                            
                            {/* Icon / Local Image */}
                            <View className={`w-14 h-10 rounded-[12px] items-center justify-center mr-4 border border-gray-100 ${item.type === 'CASH' ? 'bg-gray-100' : 'bg-white'}`}>
                                {item.type === 'CASH' ? (
                                    <MaterialCommunityIcons name="cash-multiple" size={24} color="#374151" />
                                ) : item.type === 'APPLE_PAY' ? (
                                    <MaterialCommunityIcons name="apple" size={24} color="#000000" />
                                ) : item.type === 'GOOGLE_PAY' ? (
                                    <MaterialCommunityIcons name="google" size={24} color="#EA4335" />
                                ) : (
                                    <Image 
                                        source={{ uri: getCardIcon(item.type, item.brand) || '' }} 
                                        className="w-10 h-6" 
                                        resizeMode="contain" 
                                    />
                                )}
                            </View>

                            <View className="flex-1">
                                <Text className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                    {item.type === 'CASH' ? 'Cash on Delivery' : item.brand || item.type}
                                </Text>
                                {item.type !== 'CASH' && (
                                    <View className="flex-row items-center mt-0.5">
                                        <Text className="text-xs text-gray-500 font-bold tracking-widest">•••• {item.last4}</Text>
                                        {item.expiry && (
                                            <>
                                              <Text className="text-xs text-gray-300 mx-2">•</Text>
                                              <Text className="text-xs text-gray-400 font-bold">Exp {item.expiry}</Text>
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Radio Check */}
                            {setDefaultMutation.isPending && setDefaultMutation.variables === item.id ? (
                                <ActivityIndicator size="small" color="#15803d" />
                            ) : (
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${item.isDefault ? 'border-green-600 bg-green-600' : 'border-gray-200'}`}>
                                    {item.isDefault && <MaterialCommunityIcons name="check" size={14} color="white" />}
                                </View>
                            )}
                        </View>
                        
                        {/* Actions */}
                        <View className="flex-row justify-end mt-4 pt-4 border-t border-gray-50">
                            {deleteMutation.isPending && deleteMutation.variables === item.id ? (
                                <ActivityIndicator size="small" color="#EF4444" />
                            ) : (
                                <TouchableOpacity onPress={() => handleDelete(item.id)} className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-lg">
                                    <MaterialCommunityIcons name="trash-can-outline" size={14} color="#EF4444" />
                                    <Text className="text-red-500 font-black text-[10px] ml-1 uppercase">Remove</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
             </>
          )}

          {/* Add New Card Button */}
          <TouchableOpacity 
            onPress={() => setIsAddMode(true)}
            className="mt-6 border-2 border-dashed border-gray-200 bg-white rounded-[24px] h-16 flex-row items-center justify-center active:bg-gray-50"
          >
              <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#6B7280" />
              <Text className="text-gray-600 font-black uppercase text-sm tracking-tight ml-2">Add New Card</Text>
          </TouchableOpacity>

      </ScrollView>

      {/* Add Card Modal */}
      <Modal visible={isAddMode} animationType="slide" presentationStyle="pageSheet">
          <View className="flex-1 bg-white">
             {/* Modal Header */}
              <View className="px-5 pt-6 pb-4 border-b border-gray-100 flex-row items-center justify-between">
                  <Text className="text-xl font-black text-gray-900 uppercase">New Card</Text>
                  <TouchableOpacity onPress={() => setIsAddMode(false)} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                      <MaterialCommunityIcons name="close" size={20} color="#111827" />
                  </TouchableOpacity>
              </View>

              <View className="p-5">
                  <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">Network</Text>
                  <View className="bg-gray-50 rounded-[16px] p-4 mb-5 border border-gray-100">
                      <TextInput 
                          placeholder="Visa, Mastercard, etc."
                          value={newCardData.brand}
                          onChangeText={(t) => setNewCardData({...newCardData, brand: t})}
                          className="font-bold text-gray-900"
                      />
                  </View>

                  <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">Last 4 Digits</Text>
                  <View className="bg-gray-50 rounded-[16px] p-4 mb-5 border border-gray-100 flex-row items-center">
                      <Text className="text-gray-400 font-black mr-2 tracking-widest">••••</Text>
                      <TextInput 
                          placeholder="4242"
                          keyboardType="number-pad"
                          maxLength={4}
                          value={newCardData.last4}
                          onChangeText={(t) => setNewCardData({...newCardData, last4: t})}
                          className="font-bold text-gray-900 flex-1"
                      />
                  </View>

                  <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">Expiry Date</Text>
                  <View className="bg-gray-50 rounded-[16px] p-4 mb-8 border border-gray-100">
                      <TextInput 
                          placeholder="MM/YY"
                          maxLength={5}
                          value={newCardData.expiry}
                          onChangeText={(t) => setNewCardData({...newCardData, expiry: t})}
                          className="font-bold text-gray-900"
                      />
                  </View>

                  <TouchableOpacity 
                    onPress={handleAddSubmit}
                    disabled={addMutation.isPending}
                    className="h-14 bg-green-700 rounded-[24px] items-center justify-center shadow-lg shadow-green-900/30 flex-row"
                  >
                      {addMutation.isPending ? (
                          <ActivityIndicator color="white" />
                      ) : (
                          <>
                             <MaterialCommunityIcons name="shield-check" size={18} color="white" style={{ marginRight: 6 }} />
                             <Text className="text-white font-black uppercase tracking-tight">Save Securely</Text>
                          </>
                      )}
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

    </View>
  );
}
