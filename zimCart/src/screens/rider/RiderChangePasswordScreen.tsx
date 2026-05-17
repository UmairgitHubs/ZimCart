import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { parseApiError } from '@/utils/errorUtils';
import { RIDER_GRADIENT } from '@/components/rider/theme';

export default function RiderChangePasswordScreen() {
  const navigation = useNavigation();
  const { changePassword, isChangingPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Fill in all fields');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      Alert.alert('Success', 'Password updated');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', parseApiError(e));
    }
  };

  const Field = ({
    label,
    value,
    onChange,
    secure,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    secure?: boolean;
  }) => (
    <View className="mb-4">
      <Text className="text-xs font-bold text-slate-500 uppercase mb-2">{label}</Text>
      <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3.5">
        <MaterialCommunityIcons name="lock-outline" size={20} color="#64748b" />
        <TextInput
          className="flex-1 ml-3 text-slate-900"
          secureTextEntry={secure}
          value={value}
          onChangeText={onChange}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <LinearGradient colors={[...RIDER_GRADIENT]} className="px-4 pb-6">
        <SafeAreaView edges={['top']}>
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-4">
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-white">Change password</Text>
        </SafeAreaView>
      </LinearGradient>
      <ScrollView className="px-5 pt-6">
        <Field label="Current password" value={currentPassword} onChange={setCurrentPassword} secure />
        <Field label="New password" value={newPassword} onChange={setNewPassword} secure />
        <Field label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} secure />
        <TouchableOpacity onPress={handleSave} disabled={isChangingPassword} className="rounded-2xl overflow-hidden mt-4">
          <LinearGradient colors={['#0f766e', '#14b8a6']} className="py-4 items-center">
            {isChangingPassword ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-black">Update password</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
