import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '@/hooks/useCustomer';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProfileSchema, EditProfileFormData } from '@/schemas/profile.schema';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data: user, isLoading: isFetching, update } = useProfile();

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: '',
      phone: '',
      avatar: '',
    },
  });

  // Sync state with user data when loaded
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('phone', user.phone || '');
      setValue('avatar', user.avatar || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      await update(
        data,
        {
          onSuccess: () => {
            Alert.alert('Success', 'Profile updated successfully', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          },
          onError: (error: any) => {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to update profile');
          }
        }
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  if (isFetching && !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white border-b border-gray-100 z-10 px-4 pb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
          <TouchableOpacity 
            className="p-2" 
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#2e7d32" />
            ) : (
              <Text className="text-green-700 font-bold text-base">Save</Text>
            )}
          </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
        >
            
            {/* Profile Image Section */}
            <View className="items-center py-8 bg-gray-50 mb-6">
                <View className="relative shadow-lg mb-4">
                  <Controller
                    control={control}
                    name="avatar"
                    render={({ field: { value } }) => (
                      <Image 
                          source={{ uri: value || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop' }} 
                          className="w-32 h-32 rounded-full border-4 border-white"
                      />
                    )}
                  />
                    <TouchableOpacity className="absolute bottom-0 right-1 bg-green-600 p-2.5 rounded-full border-[3px] border-white shadow-md active:opacity-80">
                        <MaterialCommunityIcons name="camera-plus" size={18} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-400 text-xs font-medium uppercase tracking-widest">Change Photo</Text>
            </View>

            {/* Form Fields */}
            <View className="px-6 space-y-6">
                
                {/* Full Name */}
                <View>
                    <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">Full Name</Text>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field: { onChange, value } }) => (
                        <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                            <MaterialCommunityIcons name="account-outline" size={20} color={errors.name ? "#EF4444" : "#9CA3AF"} />
                            <TextInput 
                                value={value}
                                onChangeText={onChange}
                                className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                                placeholder="Enter your name"
                            />
                        </View>
                      )}
                    />
                    {errors.name && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</Text>}
                </View>

                {/* Email Address */}
                <View>
                    <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">Email Address</Text>
                    <View className="flex-row items-center bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3.5 opacity-80">
                        <MaterialCommunityIcons name="email-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                            value={user?.email || ''}
                            className="flex-1 ml-3 text-gray-500 font-semibold text-base"
                            placeholder="Enter your email"
                            editable={false} 
                        />
                        <MaterialCommunityIcons name="lock-outline" size={16} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-400 text-[10px] mt-1 ml-1" numberOfLines={1}>Email cannot be changed</Text>
                </View>

                {/* Phone Number */}
                <View>
                    <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">Phone Number</Text>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field: { onChange, value } }) => (
                        <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                            <MaterialCommunityIcons name="phone-outline" size={20} color={errors.phone ? "#EF4444" : "#9CA3AF"} />
                            <TextInput 
                                value={value || ''}
                                onChangeText={onChange}
                                className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                                placeholder="Enter your phone"
                                keyboardType="phone-pad"
                            />
                        </View>
                      )}
                    />
                     {errors.phone && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</Text>}
                </View>

                {/* Avatar URL (Temporary for now until file upload) */}
                <View>
                    <Text className="text-gray-500 font-bold text-xs uppercase mb-2 ml-1">Avatar URL</Text>
                    <Controller
                      control={control}
                      name="avatar"
                      render={({ field: { onChange, value } }) => (
                        <View className={`flex-row items-center bg-gray-50 border rounded-2xl px-4 py-3.5 ${errors.avatar ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}>
                            <MaterialCommunityIcons name="link-variant" size={20} color={errors.avatar ? "#EF4444" : "#9CA3AF"} />
                            <TextInput 
                                value={value || ''}
                                onChangeText={onChange}
                                className="flex-1 ml-3 text-gray-900 font-semibold text-base"
                                placeholder="https://example.com/avatar.jpg"
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>
                      )}
                    />
                    {errors.avatar && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.avatar.message}</Text>}
                </View>

            </View>

        </ScrollView>
      </KeyboardAvoidingView>

    </View>
  );
}
