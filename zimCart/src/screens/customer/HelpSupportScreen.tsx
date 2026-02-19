import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FAQ_ITEMS = [
  { 
    id: '1', 
    question: 'How do I track my order?', 
    answer: 'You can track your order by going to the "Orders" tab in the bottom navigation bar. Tap on any active order to see its real-time status.' 
  },
  { 
    id: '2', 
    question: 'What is your refund policy?', 
    answer: 'We offer a full refund if the items are damaged or incorrect. Please report the issue within 24 hours of delivery through the "Report Issue" button on the order details page.' 
  },
  { 
    id: '3', 
    question: 'How can I change my delivery address?', 
    answer: 'You can manage your addresses in Profile > Saved Addresses. You can add, edit, or delete addresses there. During checkout, you can also select or add a new address.' 
  },
  { 
    id: '4', 
    question: 'Do you offer contactless delivery?', 
    answer: 'Yes! You can select "Leave at door" in the delivery instructions during checkout for a contactless experience.' 
  },
];

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = (type: 'chat' | 'email' | 'call') => {
      if (type === 'call') {
          Linking.openURL('tel:+1234567890');
      } else if (type === 'email') {
          Linking.openURL('mailto:support@zimcart.com');
      } else {
          navigation.navigate('ChatSupport' as never);
      }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Help & Support</Text>
          <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          
          {/* Quick Actions */}
          <View className="bg-white p-6 mb-4">
              <Text className="text-center text-gray-900 font-bold text-lg mb-2">How can we help you?</Text>
              <Text className="text-center text-gray-500 text-sm mb-6">Our team is available 24/7 to assist you.</Text>
              
              <View className="flex-row justify-between space-x-3">
                  <TouchableOpacity 
                    onPress={() => handleContactSupport('chat')}
                    className="flex-1 bg-green-50 p-4 rounded-2xl items-center border border-green-100 active:bg-green-100"
                  >
                      <View className="w-10 h-10 bg-white rounded-full items-center justify-center mb-2 shadow-sm">
                          <MaterialCommunityIcons name="chat-processing-outline" size={20} color="#2e7d32" />
                      </View>
                      <Text className="font-bold text-green-800 text-sm">Live Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => handleContactSupport('email')}
                    className="flex-1 bg-blue-50 p-4 rounded-2xl items-center border border-blue-100 active:bg-blue-100"
                  >
                      <View className="w-10 h-10 bg-white rounded-full items-center justify-center mb-2 shadow-sm">
                          <MaterialCommunityIcons name="email-outline" size={20} color="#3B82F6" />
                      </View>
                      <Text className="font-bold text-blue-800 text-sm">Email Us</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => handleContactSupport('call')}
                    className="flex-1 bg-orange-50 p-4 rounded-2xl items-center border border-orange-100 active:bg-orange-100"
                  >
                      <View className="w-10 h-10 bg-white rounded-full items-center justify-center mb-2 shadow-sm">
                          <MaterialCommunityIcons name="phone-outline" size={20} color="#F97316" />
                      </View>
                      <Text className="font-bold text-orange-800 text-sm">Call Us</Text>
                  </TouchableOpacity>
              </View>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-6">
              <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center shadow-sm">
                  <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
                  <TextInput 
                      placeholder="Search for topics or questions..."
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 ml-3 text-gray-900 font-medium"
                  />
              </View>
          </View>

          {/* FAQs */}
          <View className="px-4 pb-10">
              <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Frequently Asked Questions</Text>
              
              {FAQ_ITEMS.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    onPress={() => toggleExpand(item.id)}
                    className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
                    activeOpacity={0.9}
                  >
                      <View className="flex-row justify-between items-center">
                          <Text className="flex-1 text-base font-bold text-gray-800 mr-4">{item.question}</Text>
                          <MaterialCommunityIcons 
                              name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                              size={20} 
                              color="#9CA3AF" 
                          />
                      </View>
                      {expandedId === item.id && (
                          <View className="mt-3 pt-3 border-t border-gray-50">
                              <Text className="text-gray-600 leading-5 text-sm">{item.answer}</Text>
                          </View>
                      )}
                  </TouchableOpacity>
              ))}

              <TouchableOpacity className="flex-row items-center justify-center mt-4">
                  <Text className="text-primary font-bold">View All FAQs</Text>
                  <MaterialCommunityIcons name="arrow-right" size={16} color="#2e7d32" className="ml-1" />
              </TouchableOpacity>
          </View>

      </ScrollView>
    </View>
  );
}
