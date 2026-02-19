import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useAddresses } from '@/hooks/useCustomer';
import { parseApiError } from '@/utils/errorUtils';

export default function SavedAddressesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // Data Fetching
  const { data: addresses, isLoading, error, refetch, add, update, remove, isMutating } = useAddresses();
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form State
  const [formType, setFormType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [formAddress, setFormAddress] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  const getIcon = (label: string) => {
      // Logic based on label commonly used
      const type = label || 'Home';
      if (type.includes('Home')) return 'home-outline';
      if (type.includes('Work')) return 'briefcase-outline';
      return 'map-marker-outline';
  };

  const resetForm = () => {
      setFormType('Home');
      setFormAddress('');
      setFormDetails('');
      setFormInstructions('');
      setFormIsDefault(false);
      setEditingId(null);
  };

  const handleAddNew = () => {
      resetForm();
      setModalVisible(true);
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id);
      setFormType(item.label || 'Home');
      setFormAddress(item.address);
      setFormDetails(item.detail || '');
      setFormInstructions(item.instructions || '');
      setFormIsDefault(item.isDefault || false);
      setModalVisible(true);
  };

  const handleDelete = (id: string) => {
      Alert.alert(
          "Delete Address",
          "Are you sure you want to delete this address?",
          [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: async () => {
                  try {
                      await remove(id);
                  } catch (err) {
                      Alert.alert("Error", parseApiError(err));
                  }
              }}
          ]
      );
  };

  const handleSave = async () => {
      if (!formAddress.trim()) {
          Alert.alert("Error", "Please enter an address");
          return;
      }

      try {
          const payload = {
              label: formType,
              address: formAddress,
              detail: formDetails,
              instructions: formInstructions,
              isDefault: formIsDefault
          };

          if (editingId) {
              await update({ id: editingId, data: payload });
          } else {
              await add(payload);
          }
          setModalVisible(false);
      } catch (err) {
          Alert.alert("Error", parseApiError(err));
      }
  };

  const handleUseCurrentLocation = async () => {
      setIsLoadingLocation(true);
      try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              Alert.alert('Permission to access location was denied');
              setIsLoadingLocation(false);
              return;
          }

          let location = await Location.getCurrentPositionAsync({});
          let address = await Location.reverseGeocodeAsync(location.coords);
          
          if (address && address.length > 0) {
              const addr = address[0];
              const formattedAddress = `${addr.street ? addr.street + ', ' : ''}${addr.district || addr.city || ''}, ${addr.region || ''}`;
              setFormAddress(formattedAddress);
              setFormDetails(`${addr.name || ''}`); 
              setModalVisible(true);
          }
      } catch (error) {
          Alert.alert("Error", "Could not fetch location");
          console.log(error);
      } finally {
          setIsLoadingLocation(false);
      }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-200 z-10 flex-row items-center justify-between shadow-sm">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-100 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Delivery Addresses</Text>
          <View className="w-10" /> 
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
          
          {/* Current Location Action */}
          <View className="bg-white p-4 mb-2">
              <TouchableOpacity 
                className="flex-row items-center space-x-3 active:opacity-70"
                onPress={handleUseCurrentLocation}
                disabled={isLoadingLocation}
              >
                  <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
                      {isLoadingLocation ? (
                          <ActivityIndicator size="small" color="#2e7d32" />
                      ) : (
                          <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#2e7d32" />
                      )}
                  </View>
                  <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-base">Use Current Location</Text>
                      <Text className="text-gray-500 text-xs">Enable location services</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
          </View>

          <Text className="px-5 py-4 text-gray-500 font-bold text-xs uppercase tracking-wider">Saved Locations</Text>

          {/* Address List */}
          {isLoading && !addresses ? (
              <ActivityIndicator size="large" color="#2e7d32" className="mt-10" />
          ) : (
            <View className="px-4">
                {addresses?.map((item: any) => (
                    <View 
                        key={item.id} 
                        className={`bg-white rounded-2xl p-4 mb-4 border ${item.isDefault ? 'border-primary bg-green-50/20' : 'border-gray-100'} shadow-sm`}
                    >
                        <View className="flex-row items-start">
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 mt-1 ${item.isDefault ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <MaterialCommunityIcons 
                                    name={getIcon(item.label) as any} 
                                    size={20} 
                                    color={item.isDefault ? '#2e7d32' : '#4B5563'} 
                                />
                            </View>
                            
                            <View className="flex-1">
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="text-base font-bold text-gray-900">{item.label}</Text>
                                    {item.isDefault && (
                                        <View className="bg-green-100 px-2 py-0.5 rounded text-xs">
                                            <Text className="text-[10px] font-bold text-primary uppercase">Default</Text>
                                        </View>
                                    )}
                                </View>
                                
                                <Text className="text-gray-800 font-medium text-sm mb-0.5">{item.detail}</Text>
                                <Text className="text-gray-500 text-sm leading-5 mb-2">{item.address}</Text>
                                
                                {item.instructions && (
                                    <View className="flex-row items-center bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 mt-1 self-start">
                                        <MaterialCommunityIcons name="message-text-outline" size={14} color="#6B7280" />
                                        <Text className="text-gray-600 text-xs ml-1.5 italic">"{item.instructions}"</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-end items-center mt-4 pt-3 border-t border-gray-50 space-x-3">
                            <TouchableOpacity className="p-2" onPress={() => handleEdit(item)}>
                                <MaterialCommunityIcons name="pencil-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            <TouchableOpacity className="p-2" onPress={() => handleDelete(item.id)}>
                                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                
                {addresses?.length === 0 && (
                     <View className="items-center justify-center py-10">
                         <MaterialCommunityIcons name="map-marker-off-outline" size={48} color="#D1D5DB" />
                         <Text className="text-gray-400 mt-2 font-medium">No saved addresses</Text>
                     </View>
                )}
            </View>
          )}

          {/* Add New Button */}
          <TouchableOpacity 
            className="mx-4 mt-2 bg-white border border-dashed border-primary/50 rounded-2xl p-4 flex-row items-center justify-center active:bg-gray-50 mb-10 shadow-sm"
            onPress={handleAddNew}
          >
              {isMutating ? <ActivityIndicator size="small" color="#2e7d32" /> : <MaterialCommunityIcons name="plus" size={24} color="#2e7d32" />}
              <Text className="text-primary font-bold ml-2">Add New Address</Text>
          </TouchableOpacity>

      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
        >
            <TouchableOpacity 
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} 
                activeOpacity={1} 
                onPress={() => setModalVisible(false)}
            />
            <View className="bg-white rounded-t-3xl p-6 min-h-[60%] shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                        <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Type Selector */}
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Label</Text>
                    <View className="flex-row space-x-3 mb-4">
                        {['Home', 'Work', 'Other'].map((type) => (
                            <TouchableOpacity 
                                key={type}
                                onPress={() => setFormType(type as any)}
                                className={`px-4 py-2 rounded-full border ${formType === type ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <Text className={`text-sm font-bold ${formType === type ? 'text-white' : 'text-gray-600'}`}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Address Input */}
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Address</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                        <TextInput
                            value={formAddress}
                            onChangeText={setFormAddress}
                            placeholder="Full Street Address"
                            multiline
                            className="text-gray-900 font-medium text-base h-16 align-top"
                        />
                    </View>

                     {/* Details Input */}
                     <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Details (Optional)</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                        <TextInput
                            value={formDetails}
                            onChangeText={setFormDetails}
                            placeholder="House / Apt / Floor"
                            className="text-gray-900 font-medium text-base"
                        />
                    </View>

                    {/* Instructions Input */}
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Delivery Instructions (Optional)</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                        <TextInput
                            value={formInstructions}
                            onChangeText={setFormInstructions}
                            placeholder="e.g. Call upon arrival"
                            className="text-gray-900 font-medium text-base"
                        />
                    </View>

                     {/* Default Switch */}
                     <View className="flex-row items-center justify-between mb-8">
                         <Text className="text-base font-bold text-gray-900">Set as Default Address</Text>
                         <TouchableOpacity 
                            onPress={() => setFormIsDefault(!formIsDefault)}
                            className={`w-12 h-7 rounded-full px-1 justify-center ${formIsDefault ? 'bg-primary' : 'bg-gray-300'}`}
                         >
                             <View className={`w-5 h-5 rounded-full bg-white shadow-sm transform ${formIsDefault ? 'translate-x-5' : 'translate-x-0'}`} />
                         </TouchableOpacity>
                     </View>

                     {/* Save Button */}
                     <TouchableOpacity 
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl shadow-lg shadow-green-500/30 mb-8"
                     >
                         <Text className="text-white font-bold text-center text-lg">Save Address</Text>
                     </TouchableOpacity>

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}
