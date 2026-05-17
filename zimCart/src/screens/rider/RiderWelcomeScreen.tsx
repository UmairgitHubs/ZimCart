import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { RIDER_GRADIENT } from '@/components/rider/theme';

const { height } = Dimensions.get('window');

const features = [
  { icon: 'lightning-bolt' as const, title: 'Live dispatch', desc: 'Get assigned orders instantly' },
  { icon: 'map-marker-path' as const, title: 'Smart routes', desc: 'Clear pickup & drop-off details' },
  { icon: 'chart-line' as const, title: 'Track earnings', desc: 'See your delivery performance' },
];

export default function RiderWelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />
      <LinearGradient
        colors={[...RIDER_GRADIENT]}
        className="absolute inset-0"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
      <View className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-cyan-300/20" />

      <SafeAreaView className="flex-1 px-6">
        <Animated.View entering={FadeInDown.duration(600)} className="pt-4">
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center">
              <MaterialCommunityIcons name="bike-fast" size={24} color="#fff" />
            </View>
            <Text className="text-white/90 text-sm font-bold tracking-widest uppercase">ZimCart Fleet</Text>
          </View>
        </Animated.View>

        <View className="flex-1 justify-center" style={{ minHeight: height * 0.45 }}>
          <Animated.View entering={FadeInUp.delay(150).duration(700)}>
            <Text className="text-4xl font-black text-white leading-tight">
              Deliver.{'\n'}Earn.{'\n'}
              <Text className="text-cyan-200">Thrive.</Text>
            </Text>
            <Text className="text-white/80 text-base mt-4 leading-6 max-w-sm">
              Join Zimbabwe&apos;s fastest-growing delivery fleet. Modern tools built for professional riders.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(350).duration(700)} className="mt-10 gap-3">
            {features.map((f, i) => (
              <View
                key={f.title}
                className="flex-row items-center gap-4 bg-white/10 rounded-2xl px-4 py-3.5 border border-white/10"
              >
                <View className="w-10 h-10 rounded-xl bg-white/15 items-center justify-center">
                  <MaterialCommunityIcons name={f.icon} size={22} color="#a5f3fc" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">{f.title}</Text>
                  <Text className="text-white/65 text-xs mt-0.5">{f.desc}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)} className="pb-4 gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('RiderLogin')}
            activeOpacity={0.9}
            className="bg-white rounded-2xl py-4 flex-row items-center justify-center gap-2"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <MaterialCommunityIcons name="login" size={22} color="#0d9488" />
            <Text className="text-teal-800 font-black text-base">Sign in as rider</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.getParent()?.navigate('CustomerApp', { screen: 'Onboarding' })
            }
            className="py-3 items-center"
          >
            <Text className="text-white/80 font-semibold text-sm">
              I&apos;m shopping — <Text className="text-white font-bold underline">Customer app</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
