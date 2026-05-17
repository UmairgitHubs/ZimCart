import React from 'react';
import { View, Text, Switch, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface OnlineToggleProps {
  isOnline: boolean;
  isLoading?: boolean;
  onToggle: (goOnline: boolean) => void;
}

export function OnlineToggle({ isOnline, isLoading, onToggle }: OnlineToggleProps) {
  return (
    <LinearGradient
      colors={isOnline ? ['#0f766e', '#14b8a6'] : ['#334155', '#475569']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="rounded-2xl p-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-11 h-11 rounded-full bg-white/20 items-center justify-center">
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <MaterialCommunityIcons
              name={isOnline ? 'broadcast' : 'power-sleep'}
              size={24}
              color="#fff"
            />
          )}
        </View>
        <View>
          <Text className="text-white font-black text-base">
            {isOnline ? "You're online" : "You're offline"}
          </Text>
          <Text className="text-white/75 text-xs font-medium mt-0.5">
            {isOnline ? 'Ready to receive deliveries' : 'Go online to accept jobs'}
          </Text>
        </View>
      </View>
      <Switch
        value={isOnline}
        onValueChange={onToggle}
        disabled={isLoading}
        trackColor={{ false: '#64748b', true: '#5eead4' }}
        thumbColor="#fff"
      />
    </LinearGradient>
  );
}
