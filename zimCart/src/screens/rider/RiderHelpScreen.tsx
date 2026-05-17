import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFAQs, useSupportTicket } from '@/hooks/useHelp';
import { parseApiError } from '@/utils/errorUtils';
import api from '@/services/api';

const RIDER_FAQS = [
  {
    id: '1',
    q: 'How do I get delivery jobs?',
    a: 'Stay online on the Deliveries tab. Your fleet manager assigns orders from the admin dashboard.',
  },
  {
    id: '2',
    q: 'When do I get paid?',
    a: 'Earnings reflect delivery fees from completed orders. Check the Earnings tab for today, week, and month totals.',
  },
  {
    id: '3',
    q: 'What if the customer is not available?',
    a: 'Use "Report delivery issue" on the job screen and contact support below.',
  },
];

export default function RiderHelpScreen() {
  const navigation = useNavigation();
  const { data: serverFaqs } = useFAQs();
  const { createTicket, isCreating } = useSupportTicket();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = serverFaqs?.length ? serverFaqs : RIDER_FAQS.map((f) => ({ id: f.id, question: f.q, answer: f.a }));

  const submitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing fields', 'Please enter subject and message.');
      return;
    }
    try {
      await api.post('/help/tickets', { subject, message, category: 'rider' });
      Alert.alert('Sent', 'Support will contact you soon.');
      setModalOpen(false);
      setSubject('');
      setMessage('');
    } catch (e) {
      try {
        await createTicket({ subject, message });
        Alert.alert('Sent', 'Support will contact you soon.');
        setModalOpen(false);
      } catch (e2) {
        Alert.alert('Error', parseApiError(e2));
      }
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white border-b border-slate-100">
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-lg font-black text-slate-900">Help & support</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity
          onPress={() => Linking.openURL('tel:+263771234567')}
          className="bg-teal-600 rounded-2xl p-4 flex-row items-center gap-3 mb-4"
        >
          <MaterialCommunityIcons name="phone" size={28} color="#fff" />
          <View>
            <Text className="text-white font-black">Fleet hotline</Text>
            <Text className="text-white/80 text-sm">Tap to call dispatch</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-xs font-bold text-slate-400 uppercase mb-2">FAQ</Text>
        {faqs.map((faq: { id: string; question?: string; q?: string; answer?: string; a?: string }) => (
          <TouchableOpacity
            key={faq.id}
            onPress={() => setExpanded(expanded === faq.id ? null : faq.id)}
            className="bg-white rounded-2xl p-4 mb-2 border border-slate-100"
          >
            <Text className="font-bold text-slate-800">{faq.question || faq.q}</Text>
            {expanded === faq.id && (
              <Text className="text-slate-600 text-sm mt-2 leading-5">{faq.answer || faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => setModalOpen(true)}
          className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 flex-row items-center gap-3"
        >
          <MaterialCommunityIcons name="email-outline" size={24} color="#0d9488" />
          <Text className="font-bold text-slate-800">Contact support</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-black text-slate-900 mb-4">New support ticket</Text>
            <TextInput
              className="border border-slate-200 rounded-xl px-4 py-3 mb-3"
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              className="border border-slate-200 rounded-xl px-4 py-3 mb-4 h-28"
              placeholder="Describe your issue"
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              onPress={submitTicket}
              disabled={isCreating}
              className="bg-teal-600 rounded-xl py-4 items-center"
            >
              {isCreating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-black">Submit</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalOpen(false)} className="py-3 items-center mt-2">
              <Text className="text-slate-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
