import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking, LayoutAnimation, Platform, UIManager, RefreshControl, ActivityIndicator, Modal, KeyboardAvoidingView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

import { useFAQs, useMyTickets, useSupportTicket } from '@/hooks/useHelp';
import { parseApiError } from '@/utils/errorUtils';
import { customerMessagePreview, hasStaffReply, statusLabel } from '@/utils/supportTicket';
import type { SupportTicket } from '@/services/help';

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Data
  const { data: faqs, isLoading, refetch } = useFAQs();
  const { data: tickets = [], isLoading: ticketsLoading, refetch: refetchTickets } = useMyTickets();
  const { createTicket, isCreating } = useSupportTicket();
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Ticket Modal State
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleTicket = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const statusColor = (status: SupportTicket['status']) => {
    if (status === 'CLOSED') return 'bg-gray-100 text-gray-600';
    if (status === 'IN_PROGRESS') return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const handleContactSupport = (type: 'chat' | 'email' | 'call') => {
      if (type === 'call') {
          Linking.openURL('tel:+1234567890');
      } else if (type === 'email') {
          setSubject('Support Request');
          setTicketModalVisible(true);
      } else {
          navigation.navigate('ChatSupport' as never);
      }
  };

  const handleSubmitTicket = async () => {
      if (!subject.trim() || !message.trim()) {
          Alert.alert("Error", "Please fill in all fields");
          return;
      }

      try {
          await createTicket({ subject, message });
          Alert.alert("Success", "Your support ticket has been submitted. We'll get back to you soon.");
          setTicketModalVisible(false);
          setSubject('');
          setMessage('');
      } catch (error) {
          Alert.alert("Error", parseApiError(error));
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

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
              refreshing={isLoading || ticketsLoading}
              onRefresh={() => {
                refetch();
                refetchTickets();
              }}
            />
        }
      >
          
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
                      <Text className="font-bold text-blue-800 text-sm">Submit Ticket</Text>
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

          {/* My tickets */}
          <View className="px-4 mb-8">
              <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">My support tickets</Text>
              {ticketsLoading ? (
                <ActivityIndicator size="small" color="#2e7d32" />
              ) : tickets.length === 0 ? (
                <View className="bg-white rounded-2xl p-5 border border-gray-100">
                  <Text className="text-gray-500 text-sm text-center">No tickets yet. Submit one if you need help.</Text>
                </View>
              ) : (
                tickets.map((ticket) => (
                  <TouchableOpacity
                    key={ticket.id}
                    onPress={() => toggleTicket(ticket.id)}
                    className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
                    activeOpacity={0.9}
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="flex-1 text-base font-bold text-gray-800 mr-2" numberOfLines={2}>
                        {ticket.subject}
                      </Text>
                      <View className={`px-2 py-1 rounded-lg ${statusColor(ticket.status)}`}>
                        <Text className="text-[10px] font-bold uppercase">{statusLabel(ticket.status)}</Text>
                      </View>
                    </View>
                    <Text className="text-xs text-gray-400 mb-2">Updated {formatDate(ticket.updatedAt)}</Text>
                    {hasStaffReply(ticket.message) && (
                      <View className="flex-row items-center mb-2">
                        <MaterialCommunityIcons name="message-reply-text-outline" size={14} color="#2e7d32" />
                        <Text className="text-xs font-bold text-primary ml-1">Team replied</Text>
                      </View>
                    )}
                    {expandedTicketId === ticket.id && (
                      <View className="mt-2 pt-3 border-t border-gray-50">
                        <Text className="text-gray-600 leading-5 text-sm">
                          {customerMessagePreview(ticket.message)}
                        </Text>
                      </View>
                    )}
                    <Text className="text-xs text-primary font-bold mt-2">
                      {expandedTicketId === ticket.id ? 'Hide details' : 'View details'}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
          </View>

          {/* FAQs */}
          <View className="px-4 pb-10">
              <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Frequently Asked Questions</Text>
              
              {isLoading ? (
                  <ActivityIndicator size="small" color="#2e7d32" />
              ) : (
                  <>
                    {faqs?.map((item: any) => (
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
                    {!faqs?.length && (
                        <Text className="text-gray-500 text-center py-4">No FAQs available.</Text>
                    )}
                  </>
              )}

              <TouchableOpacity className="flex-row items-center justify-center mt-4" onPress={() => refetch()}>
                  <Text className="text-primary font-bold">Refresh FAQs</Text>
                  <MaterialCommunityIcons name="refresh" size={16} color="#2e7d32" className="ml-1" />
              </TouchableOpacity>
          </View>

      </ScrollView>

      {/* Support Ticket Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ticketModalVisible}
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
        >
            <TouchableOpacity 
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} 
                activeOpacity={1} 
                onPress={() => setTicketModalVisible(false)}
            />
            <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-gray-900">Submit Support Ticket</Text>
                    <TouchableOpacity onPress={() => setTicketModalVisible(false)} className="p-1 bg-gray-100 rounded-full">
                        <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Subject</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                        <TextInput
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="What do you need help with?"
                            className="text-gray-900 font-medium text-base"
                        />
                    </View>

                    <Text className="text-xs font-bold text-gray-500 uppercase mb-2">Message</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Describe your issue in detail..."
                            multiline
                            numberOfLines={5}
                            className="text-gray-900 font-medium text-base h-32 align-top"
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleSubmitTicket}
                        disabled={isCreating}
                        className={`bg-primary py-4 rounded-xl shadow-lg shadow-green-500/30 mb-8 flex-row justify-center items-center ${isCreating ? 'opacity-70' : ''}`}
                    >
                        {isCreating && <ActivityIndicator size="small" color="white" className="mr-2" />}
                        <Text className="text-white font-bold text-center text-lg">Submit Ticket</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}
