import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    Alert.alert("Success", "Password updated successfully");
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Change Password</Text>
          <View className="w-10" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-8">
            <Text className="text-gray-500 mb-6 text-sm">
                Your new password must be different from previous used passwords.
            </Text>

            <View className="space-y-4">
                <View>
                    <Text className="text-gray-700 font-bold mb-2">Current Password</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                        <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            className="flex-1 ml-3 text-gray-900"
                            placeholder="Enter current password"
                            secureTextEntry
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-gray-700 font-bold mb-2">New Password</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                        <MaterialCommunityIcons name="lock-plus-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                            value={newPassword}
                            onChangeText={setNewPassword}
                            className="flex-1 ml-3 text-gray-900"
                            placeholder="Enter new password"
                            secureTextEntry
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-gray-700 font-bold mb-2">Confirm New Password</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                        <MaterialCommunityIcons name="lock-check-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            className="flex-1 ml-3 text-gray-900"
                            placeholder="Re-enter new password"
                            secureTextEntry
                        />
                    </View>
                </View>

                <Text className="text-xs text-gray-400 mt-2">
                    Must be at least 8 characters long.
                </Text>

                <TouchableOpacity 
                    onPress={handleSave}
                    className="bg-primary mt-8 py-4 rounded-xl shadow-lg shadow-green-500/30"
                >
                    <Text className="text-white font-bold text-center text-lg">Update Password</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
