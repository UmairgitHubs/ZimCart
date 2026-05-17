import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRequestPayout, useRiderWallet } from '@/hooks/useRider';
import { parseApiError } from '@/utils/errorUtils';
import { RIDER_GRADIENT } from '@/components/rider/theme';

const METHODS = [
  { id: 'ECOCASH', label: 'EcoCash' },
  { id: 'ONEMONEY', label: 'OneMoney' },
  { id: 'INNBUCKS', label: 'InnBucks' },
  { id: 'BANK', label: 'Bank transfer' },
] as const;

export default function RiderWalletScreen() {
  const navigation = useNavigation();
  const { data: wallet, isLoading, refetch, isRefetching } = useRiderWallet();
  const requestPayout = useRequestPayout();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('ECOCASH');
  const [accountRef, setAccountRef] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const num = parseFloat(amount);
    if (!num || num < 1) {
      setError('Enter a valid amount');
      return;
    }
    if (!accountRef.trim()) {
      setError('Enter your mobile money number or account');
      return;
    }
    setError(null);
    Alert.alert('Request payout', `Withdraw Rs ${num.toLocaleString()} via ${method}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: async () => {
          try {
            await requestPayout.mutateAsync({
              amount: num,
              method,
              accountRef: accountRef.trim(),
              accountName: accountName.trim() || undefined,
            });
            setAmount('');
            Alert.alert('Submitted', 'Your payout request is pending admin approval.');
            refetch();
          } catch (e) {
            setError(parseApiError(e));
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-5 pt-2 pb-8 rounded-b-[28px]">
        <SafeAreaView edges={['top']}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-4"
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white/70 text-xs font-bold uppercase tracking-widest">Wallet</Text>
          <Text className="text-white text-2xl font-black mt-1">Cash out earnings</Text>
          {isLoading ? (
            <ActivityIndicator color="#fff" className="mt-6" />
          ) : (
            <View className="mt-5 bg-white/15 rounded-2xl p-5 border border-white/10">
              <Text className="text-white/70 text-xs font-bold uppercase">Available balance</Text>
              <Text className="text-white text-3xl font-black mt-1">
                Rs {(wallet?.available ?? 0).toLocaleString()}
              </Text>
              <Text className="text-white/60 text-xs mt-2">
                Earned Rs {(wallet?.totalEarned ?? 0).toLocaleString()} · Pending Rs{' '}
                {(wallet?.pending ?? 0).toLocaleString()}
              </Text>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5 -mt-2"
        contentContainerStyle={{ paddingBottom: 48 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0d9488" />}
      >
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 mb-3">
          Request payout
        </Text>
        <View className="bg-white rounded-3xl p-5 border border-slate-100 gap-4">
          <View>
            <Text className="text-xs font-bold text-slate-500 mb-2">Amount (Rs)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-semibold"
            />
          </View>
          <View>
            <Text className="text-xs font-bold text-slate-500 mb-2">Method</Text>
            <View className="flex-row flex-wrap gap-2">
              {METHODS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMethod(m.id)}
                  className={`px-3 py-2 rounded-xl border ${
                    method === m.id ? 'bg-teal-50 border-teal-500' : 'border-slate-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${method === m.id ? 'text-teal-800' : 'text-slate-600'}`}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text className="text-xs font-bold text-slate-500 mb-2">Account / phone number</Text>
            <TextInput
              value={accountRef}
              onChangeText={setAccountRef}
              placeholder="e.g. 0771234567"
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
            />
          </View>
          <View>
            <Text className="text-xs font-bold text-slate-500 mb-2">Account name (optional)</Text>
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Registered name"
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
            />
          </View>
          {error ? <Text className="text-red-600 text-sm">{error}</Text> : null}
          <TouchableOpacity
            onPress={submit}
            disabled={requestPayout.isPending}
            className="bg-teal-600 rounded-2xl py-4 items-center"
          >
            {requestPayout.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-black">Submit request</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 mb-3">
          Payout history
        </Text>
        {!wallet?.payouts?.length ? (
          <Text className="text-slate-500 text-center py-8">No payout requests yet</Text>
        ) : (
          wallet.payouts.map((p) => (
            <View
              key={p.id}
              className="bg-white rounded-2xl p-4 mb-2 border border-slate-100 flex-row justify-between items-center"
            >
              <View>
                <Text className="font-black text-slate-800">Rs {p.amount.toLocaleString()}</Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  {p.method} · {p.accountRef}
                </Text>
                <Text className="text-slate-400 text-[10px] mt-1">
                  {new Date(p.requestedAt).toLocaleDateString()}
                </Text>
              </View>
              <View className="bg-slate-100 px-2 py-1 rounded-lg">
                <Text className="text-[10px] font-bold text-slate-700">{p.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
