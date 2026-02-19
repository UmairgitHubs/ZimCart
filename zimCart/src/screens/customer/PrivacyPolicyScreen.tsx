import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Terms & Policies</Text>
          <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-gray-400 text-xs font-bold uppercase mb-4">Last Updated: February 2026</Text>
          
          {/* Terms of Service Section */}
          <Text className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</Text>
          <Text className="text-gray-600 leading-6 mb-6">
              Welcome to ZimCart! By accessing or using our mobile application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-2">1. Use of Service</Text>
          <Text className="text-gray-600 leading-6 mb-6">
              You must be at least 13 years old to use this application. You are responsible for maintaining the confidentiality of your account and password.
          </Text>

          <View className="h-px bg-gray-100 my-6" />

          {/* Privacy Policy Section */}
          <Text className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</Text>
          
          <Text className="text-gray-600 leading-6 mb-6">
              At ZimCart, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our mobile application.
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-2">1. Collection of Data</Text>
          <Text className="text-gray-600 leading-6 mb-6">
              We collect information that you voluntarily provide to us when you register on the Application, express an interest in obtaining information about us or our products and services.
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-2">2. Use of Your Information</Text>
          <Text className="text-gray-600 leading-6 mb-6">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we use information collected via the Application to:
              {'\n'}• Create and manage your account.
              {'\n'}• Process your orders and payments.
              {'\n'}• Email you regarding your account or order.
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-2">3. Disclosure of Data</Text>
          <Text className="text-gray-600 leading-6 mb-6">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows: 
              {'\n'}• By Law or to Protect Rights.
              {'\n'}• Third-Party Service Providers.
          </Text>

          <Text className="text-lg font-bold text-gray-900 mb-2">4. Contact Us</Text>
          <Text className="text-gray-600 leading-6 mb-10">
              If you have questions or comments about this Privacy Policy, please contact us at privacy@zimcart.com.
          </Text>
      </ScrollView>
    </View>
  );
}
