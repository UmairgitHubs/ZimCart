import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Hi Alex! Welcome to ZimCart Support. How can I help you today?', sender: 'agent', timestamp: '10:00 AM' },
];

export default function ChatSupportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate Agent Reply
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for reaching out! Let me check that for you right away.",
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1500);
  };

  useEffect(() => {
    // Scroll to bottom on new message
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <View 
            className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                isUser 
                ? 'bg-primary self-end rounded-tr-none' 
                : 'bg-gray-100 self-start rounded-tl-none'
            }`}
          >
              <Text className={`${isUser ? 'text-white' : 'text-gray-800'} text-base`}>
                  {item.text}
              </Text>
              <Text className={`text-[10px] mt-1 text-right ${isUser ? 'text-green-200' : 'text-gray-400'}`}>
                  {item.timestamp}
              </Text>
          </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white px-4 pb-3 border-b border-gray-100 flex-row items-center justify-between shadow-sm z-10">
          <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full mr-3">
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
              </TouchableOpacity>
              <View className="relative">
                 <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center border border-white shadow-sm">
                     <MaterialCommunityIcons name="headset" size={20} color="#2e7d32" />
                 </View>
                 <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </View>
              <View className="ml-3">
                  <Text className="text-lg font-bold text-gray-900">Support Agent</Text>
                  <Text className="text-xs text-green-600 font-bold">Online</Text>
              </View>
          </View>
          <TouchableOpacity className="p-2">
              <MaterialCommunityIcons name="dots-vertical" size={24} color="#1F2937" />
          </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
          />

          {/* Input Area */}
          <View className="px-4 py-3 bg-white border-t border-gray-100 flex-row items-center pb-8">
              <TouchableOpacity className="p-2 mr-2 bg-gray-50 rounded-full active:bg-gray-100">
                  <MaterialCommunityIcons name="plus" size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <View className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 flex-row items-center">
                  <TextInput 
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="Type a message..."
                      className="flex-1 text-gray-900 text-base max-h-24"
                      multiline
                  />
              </View>

              <TouchableOpacity 
                onPress={sendMessage}
                disabled={!inputText.trim()}
                className={`p-3 ml-3 rounded-full ${inputText.trim() ? 'bg-primary shadow-lg shadow-green-200' : 'bg-gray-100'}`}
              >
                  <MaterialCommunityIcons 
                    name="send" 
                    size={20} 
                    color={inputText.trim() ? "white" : "#9CA3AF"} 
                    style={{ marginLeft: 2 }}
                  />
              </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>

    </View>
  );
}
