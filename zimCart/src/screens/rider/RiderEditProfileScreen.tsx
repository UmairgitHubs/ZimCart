import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRiderProfile, useUpdateRiderProfile } from '@/hooks/useRider';
import { parseApiError } from '@/utils/errorUtils';

export default function RiderEditProfileScreen() {
  const navigation = useNavigation();
  const { data: profile } = useRiderProfile();
  const updateProfile = useUpdateRiderProfile();
  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');

  React.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ name: name.trim(), phone: phone.trim() });
      Alert.alert('Saved', 'Profile updated');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', parseApiError(e));
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white border-b border-slate-100">
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <MaterialCommunityIcons name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-black flex-1 text-center mr-10">Edit profile</Text>
        </View>
      </SafeAreaView>
      <View className="p-5 gap-4">
        <View>
          <Text className="text-xs font-bold text-slate-500 uppercase mb-2">Full name</Text>
          <TextInput className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5" value={name} onChangeText={setName} />
        </View>
        <View>
          <Text className="text-xs font-bold text-slate-500 uppercase mb-2">Phone</Text>
          <TextInput
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={updateProfile.isPending}
          className="bg-teal-600 rounded-2xl py-4 items-center mt-4"
        >
          {updateProfile.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-black">Save changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
