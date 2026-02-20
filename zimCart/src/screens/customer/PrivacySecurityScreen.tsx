import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useProfile, useSecurity } from '@/hooks/useCustomer';
import { parseApiError } from '@/utils/errorUtils';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/auth.slice';

export default function PrivacySecurityScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Data
  const { data: profile } = useProfile();
  const { updateSecurity, deleteAccount, isUpdating, isDeleting } = useSecurity();

  // Local state to reflect immediate change while mutating
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  useEffect(() => {
      if (profile) {
          setTwoFactorEnabled(profile.isTwoFactorEnabled || false);
          setDataSharing(profile.dataSharingConsent !== false); // default true
      }
  }, [profile]);

  const handleToggleSecurity = async (field: 'isTwoFactorEnabled' | 'dataSharingConsent', value: boolean) => {
      if (field === 'isTwoFactorEnabled') setTwoFactorEnabled(value);
      if (field === 'dataSharingConsent') setDataSharing(value);

      try {
          await updateSecurity({ [field]: value });
      } catch (error) {
          // Revert on error
          if (field === 'isTwoFactorEnabled') setTwoFactorEnabled(!value);
          if (field === 'dataSharingConsent') setDataSharing(!value);
          Alert.alert("Error", parseApiError(error));
      }
  };

  const handleDeleteAccount = () => {
    navigation.navigate('ManageData' as never);
  };

  const renderSectionHeader = (title: string) => (
      <Text className="px-5 mt-6 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</Text>
  );

  const renderActionItem = (title: string, icon: string, color: string, onPress?: () => void, subtitle?: string) => (
      <TouchableOpacity 
          onPress={onPress}
          className="flex-row items-center justify-between bg-white px-5 py-4 border-b border-gray-50 active:bg-gray-50"
      >
          <View className="flex-row items-center flex-1 mr-4">
              <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 bg-gray-50`}>
                  <MaterialCommunityIcons name={icon as any} size={20} color={color} />
              </View>
              <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{title}</Text>
                  {subtitle && <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text>}
              </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#D1D5DB" />
      </TouchableOpacity>
  );

  const renderSwitchItem = (title: string, icon: string, color: string, value: boolean, onValueChange: (val: boolean) => void, subtitle?: string) => (
      <View className="flex-row items-center justify-between bg-white px-5 py-4 border-b border-gray-50">
          <View className="flex-row items-center flex-1 mr-4">
               <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 bg-gray-50`}>
                  <MaterialCommunityIcons name={icon as any} size={20} color={color} />
              </View>
              <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">{title}</Text>
                  {subtitle && <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text>}
              </View>
          </View>
          <Switch
              trackColor={{ false: "#E5E7EB", true: "#86efac" }}
              thumbColor={value ? "#2e7d32" : "#f4f3f4"}
              ios_backgroundColor="#E5E7EB"
              onValueChange={onValueChange}
              value={value}
              disabled={isUpdating}
          />
      </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-200 z-10 flex-row items-center justify-between shadow-sm">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Privacy & Security</Text>
          <View className="w-10" /> 
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
          {/* Account Security */}
          {renderSectionHeader('Login & Security')}
          <View className="bg-white border-y border-gray-100">
              {renderActionItem("Change Password", "lock-reset", "#3B82F6", () => navigation.navigate('ChangePassword' as never), "Update your password regularly")}
              {renderSwitchItem("Two-Factor Auth", "shield-check-outline", "#F59E0B", twoFactorEnabled, (val) => handleToggleSecurity('isTwoFactorEnabled', val), "Add an extra layer of security")}
          </View>

          {/* Data Privacy */}
          {renderSectionHeader('Data & Privacy')}
          <View className="bg-white border-y border-gray-100">
               {renderActionItem("Manage Data", "database-cog-outline", "#8B5CF6", () => navigation.navigate('ManageData' as never), "Download or view your data")}
               {renderSwitchItem("Share Analytics", "chart-bar", "#6366F1", dataSharing, (val) => handleToggleSecurity('dataSharingConsent', val), "Help us improve ZimCart")}
               {renderActionItem("Terms & Policies", "file-document-outline", "#6B7280", () => navigation.navigate('PrivacyPolicy' as never))}
          </View>

          {/* Device Management */}
          {renderSectionHeader('Devices')}
          <View className="bg-white border-y border-gray-100">
               {renderActionItem("Manage Devices", "cellphone-link", "#EC4899", () => navigation.navigate('ManageDevices' as never), "2 active sessions")}
          </View>

          {/* Danger Zone */}
          {renderSectionHeader('Danger Zone')}
          <View className="bg-white border-y border-gray-100 mb-10">
                <TouchableOpacity 
                   className="flex-row items-center bg-white px-5 py-4 border-b border-gray-50 active:bg-red-50"
                   onPress={handleDeleteAccount}
                 >
                   <MaterialCommunityIcons name="account-remove-outline" size={24} color="#EF4444" style={{ marginRight: 12 }} />
                   <View className="flex-1">
                       <Text className="text-base font-bold text-red-500">Delete Account</Text>
                       <Text className="text-xs text-red-300 mt-0.5">Permanently remove your account</Text>
                   </View>
                   <MaterialCommunityIcons name="chevron-right" size={20} color="#FECACA" />
               </TouchableOpacity>
          </View>

      </ScrollView>

    </View>
  );
}
