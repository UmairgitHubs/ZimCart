import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useDataManagement, useSecurity } from '@/hooks/useCustomer';
import { useAuth } from '@/hooks/useAuth';
import { parseApiError } from '@/utils/errorUtils';

export default function ManageDataScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout, clearAuth } = useAuth();
  const { exportData, clearHistory, isExporting, isClearing } = useDataManagement();
  const { deleteAccount, isDeleting } = useSecurity();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRequestData = async () => {
      try {
          const result = await exportData();
          Alert.alert("Request Sent", result.message);
      } catch (error) {
          Alert.alert("Error", parseApiError(error));
      }
  };

  const handleClearHistory = () => {
      Alert.alert(
          "Clear History",
          "Are you sure you want to clear your search and view history?",
          [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Clear", 
                style: "destructive",
                onPress: async () => {
                    try {
                        const result = await clearHistory('all');
                        Alert.alert("Success", result.message);
                    } catch (error) {
                        Alert.alert("Error", parseApiError(error));
                    }
                }
              }
          ]
      );
  };

  const handleDeleteAccount = async () => {
    if (!password) {
        Alert.alert("Error", "Please enter your password to confirm.");
        return;
    }

    try {
        await deleteAccount(password);
        setIsDeleteModalVisible(false);
        
        // Immediate local cleanup to prevent background queries from failing
        clearAuth();

        Alert.alert(
            "Account Deleted", 
            "Your account has been permanently removed. We're sorry to see you go."
        );
    } catch (error) {
        Alert.alert("Error", parseApiError(error));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Manage Data</Text>
          <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-4">
                   <MaterialCommunityIcons name="cloud-download-outline" size={24} color="#3B82F6" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-1">Download Your Data</Text>
              <Text className="text-gray-500 text-sm leading-5 mb-4">
                  Get a copy of your personal data, including your order history, saved addresses, and preferences.
              </Text>
                <TouchableOpacity 
                onPress={handleRequestData}
                disabled={isExporting}
                className={`bg-blue-50 py-3 rounded-xl border border-blue-100 flex-row justify-center items-center ${isExporting ? 'opacity-70' : ''}`}
              >
                  {isExporting && <ActivityIndicator size="small" color="#3B82F6" className="mr-2" />}
                  <Text className="text-blue-600 font-bold text-center">Request Data Copy</Text>
              </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
              <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-4">
                   <MaterialCommunityIcons name="history" size={24} color="#6B7280" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-1">Clear History</Text>
              <Text className="text-gray-500 text-sm leading-5 mb-4">
                  Remove all your recently viewed items and search history from this device.
              </Text>
              <TouchableOpacity 
                onPress={handleClearHistory}
                disabled={isClearing}
                className={`bg-gray-50 py-3 rounded-xl border border-gray-200 flex-row justify-center items-center ${isClearing ? 'opacity-70' : ''}`}
              >
                  {isClearing && <ActivityIndicator size="small" color="#6B7280" className="mr-2" />}
                  <Text className="text-gray-700 font-bold text-center">Clear Search History</Text>
              </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-red-50">
              <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-4">
                   <MaterialCommunityIcons name="account-remove-outline" size={24} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-gray-900 mb-1">Delete Account</Text>
              <Text className="text-red-500 text-xs font-bold uppercase mb-2">Danger Zone</Text>
              <Text className="text-gray-500 text-sm leading-5 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
              </Text>
              <TouchableOpacity 
                onPress={() => setIsDeleteModalVisible(true)}
                className="bg-red-500 py-3 rounded-xl shadow-sm shadow-red-200"
              >
                  <Text className="text-white font-bold text-center">Delete My Account</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
      >
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black/50 justify-center px-6"
        >
            <View className="bg-white rounded-3xl p-6 shadow-xl">
                <View className="items-center mb-4">
                    <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                         <MaterialCommunityIcons name="alert-outline" size={32} color="#EF4444" />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 text-center">Confirm Deletion</Text>
                    <Text className="text-gray-500 text-center mt-2 text-sm">
                        For your security, please enter your password to permanently delete your account.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Your Password</Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                        <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-3 text-gray-900 font-medium text-base"
                            placeholder="Enter password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
                        />
                         <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-1">
                            <MaterialCommunityIcons 
                                name={isPasswordVisible ? "eye-off" : "eye"} 
                                size={20} 
                                color="#9CA3AF" 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="space-y-3">
                    <TouchableOpacity 
                        onPress={handleDeleteAccount}
                        disabled={isDeleting}
                        className={`bg-red-600 py-4 rounded-2xl items-center flex-row justify-center ${isDeleting ? 'opacity-70' : ''}`}
                    >
                        {isDeleting && <ActivityIndicator color="white" className="mr-2" size="small" />}
                        <Text className="text-white font-bold text-lg">Confirm Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => {
                            setIsDeleteModalVisible(false);
                            setPassword('');
                        }}
                        disabled={isDeleting}
                        className="py-3 items-center"
                    >
                        <Text className="text-gray-500 font-bold">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}
