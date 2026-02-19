import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const BENEFITS = [
  { id: '1', title: 'Free Delivery', description: 'Zero delivery fees on all orders above $10.', icon: 'truck-fast-outline' },
  { id: '2', title: 'Extra Cashback', description: 'Get flat 5% extra cashback on every order.', icon: 'cash-multiple' },
  { id: '3', title: 'Priority Support', description: 'Dedicated support line with < 1min wait time.', icon: 'headset' },
  { id: '4', title: 'No Surge Pricing', description: 'Pay standard rates even during peak hours.', icon: 'lightning-bolt-outline' },
];

const PLANS = [
  { id: 'monthly', title: 'Monthly', price: '$9.99', period: '/month', save: '' },
  { id: 'yearly', title: 'Yearly', price: '$99.99', period: '/year', save: 'SAVE 20%' },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#2e7d32" />
      
      {/* Background Gradient - Green Theme */}
      <View className="absolute top-0 left-0 right-0 h-[45%] bg-[#2e7d32] rounded-b-[40px] overflow-hidden">
          <LinearGradient
            colors={['#2e7d32', '#1b5e20']}
            className="absolute inset-0"
          />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Header */}
          <View style={{ paddingTop: insets.top }} className="px-4 pb-4 flex-row items-center justify-between">
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                className="p-2 bg-white/20 rounded-full"
              >
                  <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white font-bold text-lg tracking-wider">ZIMCART GOLD</Text>
              <View className="w-10" />
          </View>

          {/* Hero Section */}
          <View className="items-center mt-4 mb-8">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center shadow-lg shadow-green-900/50 mb-4 border-4 border-green-800">
                  <MaterialCommunityIcons name="crown" size={48} color="#F59E0B" />
              </View>
              <Text className="text-3xl font-extrabold text-white text-center mb-2">
                  Upgrade to <Text className="text-yellow-400">Premium</Text>
              </Text>
              <Text className="text-green-50 text-center px-10 text-sm leading-5">
                  Unlock exclusive benefits, free deliveries, and premium support.
              </Text>
          </View>

          {/* Benefits List */}
          <View className="px-5 mt-2">
              {BENEFITS.map((item) => (
                  <View key={item.id} className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
                      <View className="w-12 h-12 rounded-xl bg-green-50 items-center justify-center mr-4">
                          <MaterialCommunityIcons name={item.icon as any} size={24} color="#2e7d32" />
                      </View>
                      <View className="flex-1">
                          <Text className="text-base font-bold text-gray-900">{item.title}</Text>
                          <Text className="text-xs text-gray-500 mt-0.5">{item.description}</Text>
                      </View>
                  </View>
              ))}
          </View>

          {/* Pricing Plans */}
          <Text className="text-center font-bold text-gray-900 text-lg mt-6 mb-4">Choose Your Plan</Text>
          <View className="px-5 flex-row space-x-4">
              {PLANS.map((plan) => (
                  <TouchableOpacity 
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    className={`flex-1 p-4 rounded-2xl border-2 ${
                        selectedPlan === plan.id 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                      {plan.save ? (
                          <View className="absolute -top-3 left-0 right-0 items-center">
                              <View className="bg-yellow-500 px-2 py-0.5 rounded-full">
                                  <Text className="text-[10px] font-bold text-white">{plan.save}</Text>
                              </View>
                          </View>
                      ) : null}
                      
                      <View className="flex-row justify-between items-start mb-2 mt-1">
                          <Text className={`font-bold ${selectedPlan === plan.id ? 'text-gray-900' : 'text-gray-500'}`}>
                              {plan.title}
                          </Text>
                          {selectedPlan === plan.id && (
                              <MaterialCommunityIcons name="check-circle" size={20} color="#2e7d32" />
                          )}
                      </View>
                      <Text className="text-2xl font-bold text-gray-900">{plan.price}</Text>
                      <Text className="text-xs text-gray-500">{plan.period}</Text>
                  </TouchableOpacity>
              ))}
          </View>

          {/* Terms */}
          <Text className="text-center text-xs text-gray-400 mt-6 px-10 leading-4">
              Recurring billing. Cancel anytime. By subscribing, you agree to our Terms & Conditions.
          </Text>

      </ScrollView>

      {/* Floating CTA */}
      <View className="p-5 bg-white border-t border-gray-100 shadow-lg" style={{ paddingBottom: insets.bottom + 20 }}>
          <TouchableOpacity 
            onPress={() => {
                const planDetails = PLANS.find(p => p.id === selectedPlan);
                Alert.alert(
                    "Confirm Subscription",
                    `Are you sure you want to subscribe to the ${planDetails?.title} plan for ${planDetails?.price}?`,
                    [
                        { text: "Cancel", style: "cancel" },
                        { 
                            text: "Subscribe", 
                            onPress: () => {
                                Alert.alert("Success", "Welcome to ZimCart Gold! Your subscription is now active.");
                                navigation.goBack();
                            } 
                        }
                    ]
                );
            }}
            className="bg-[#2e7d32] py-4 rounded-2xl shadow-xl shadow-green-200 items-center flex-row justify-center"
          >
              <Text className="text-white font-bold text-lg mr-2">Upgrade to Premium</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
      </View>
    </View>
  );
}
