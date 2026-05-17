import React from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRiderEarnings } from '@/hooks/useRider';
import { RIDER_GRADIENT } from '@/components/rider/theme';

function MoneyCard({ label, amount }: { label: string; amount: number }) {
  return (
    <View className="flex-1 bg-white/15 rounded-2xl p-4 border border-white/10">
      <Text className="text-white/70 text-[10px] font-bold uppercase">{label}</Text>
      <Text className="text-white text-xl font-black mt-1">Rs {amount.toLocaleString()}</Text>
    </View>
  );
}

export default function RiderEarningsScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading, refetch, isRefetching } = useRiderEarnings();

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-5 pt-2 pb-8 rounded-b-[28px]">
        <SafeAreaView edges={['top']}>
          <Text className="text-white/70 text-xs font-bold uppercase tracking-widest">Earnings</Text>
          <Text className="text-white text-2xl font-black mt-1">Your delivery pay</Text>
          <Text className="text-white/75 text-sm mt-1">Based on completed delivery fees</Text>
          <View className="flex-row gap-3 mt-5">
            <MoneyCard label="Today" amount={data?.today ?? 0} />
            <MoneyCard label="This week" amount={data?.week ?? 0} />
          </View>
          <View className="flex-row gap-3 mt-3">
            <MoneyCard label="This month" amount={data?.month ?? 0} />
            <MoneyCard label="All time" amount={data?.allTime ?? 0} />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('RiderWallet')}
            className="mt-5 flex-row items-center justify-center gap-2 bg-white/20 rounded-2xl py-3.5 border border-white/25"
          >
            <MaterialCommunityIcons name="wallet" size={20} color="#fff" />
            <Text className="text-white font-black">Wallet & cash out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-5 -mt-2"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0d9488" />}
      >
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4">
          Recent payouts
        </Text>
        {isLoading ? (
          <ActivityIndicator color="#0d9488" className="py-12" />
        ) : !data?.recent?.length ? (
          <View className="bg-white rounded-3xl p-8 items-center border border-slate-100">
            <MaterialCommunityIcons name="cash-multiple" size={48} color="#94a3b8" />
            <Text className="text-slate-600 font-bold mt-3">No completed deliveries yet</Text>
          </View>
        ) : (
          data.recent.map((item) => (
            <View
              key={item.orderId}
              className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 flex-row items-center justify-between"
            >
              <View className="flex-1 mr-3">
                <Text className="font-black text-slate-800">{item.orderNumber}</Text>
                <Text className="text-slate-500 text-sm mt-0.5">{item.storeName}</Text>
                <Text className="text-slate-400 text-xs mt-1">
                  {new Date(item.completedAt).toLocaleString()}
                </Text>
              </View>
              <Text className="text-emerald-700 font-black text-lg">+{item.amount.toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
