import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { parseApiError } from '@/utils/errorUtils';

export default function VerifyResetCodeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const { verifyResetCode, isVerifyResetCodeLoading } = useAuth();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code");
      return;
    }

    try {
      const token = await verifyResetCode({ email, code: fullCode });
      // On success, navigate to the final step
      navigation.navigate('ResetPassword', { token });
    } catch (error) {
      Alert.alert("Verification Failed", parseApiError(error));
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View style={{ paddingTop: insets.top }} className="px-4 pb-4 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full active:bg-gray-100">
              <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-10" showsVerticalScrollIndicator={false}>
            <View className="items-center mb-10">
                <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-6">
                    <MaterialCommunityIcons name="email-check-outline" size={40} color="#166534" />
                </View>
                <Text className="text-3xl font-bold text-gray-900 mb-2">Check Email</Text>
                <Text className="text-center text-gray-500 leading-6 text-lg">
                    We've sent a 6-digit verification code to{"\n"}
                    <Text className="text-gray-900 font-bold">{email}</Text>
                </Text>
            </View>

            <View className="flex-row justify-between mb-10">
                {code.map((digit, index) => (
                    <View key={index} className="w-[14%] aspect-square bg-gray-50 border border-gray-200 rounded-2xl items-center justify-center">
                        <TextInput
                            ref={ref => { inputRefs.current[index] = ref; }}
                            value={digit}
                            onChangeText={text => handleInputChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            className="text-3xl font-bold text-gray-900 text-center w-full"
                            style={{ padding: 0 }}
                            autoFocus={index === 0}
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity 
                onPress={handleVerify}
                disabled={isVerifyResetCodeLoading}
                className={`bg-green-700 py-4 rounded-2xl shadow-lg shadow-green-200 flex-row justify-center items-center mb-6 ${isVerifyResetCodeLoading ? 'opacity-70' : ''}`}
            >
                {isVerifyResetCodeLoading && <ActivityIndicator size="small" color="white" className="mr-2" />}
                <Text className="text-white font-bold text-center text-lg">Verify Code</Text>
            </TouchableOpacity>

            <View className="items-center">
                <Text className="text-gray-500 mb-2">Didn't receive the code?</Text>
                {timer > 0 ? (
                    <Text className="text-gray-400 font-medium">Resend in {timer}s</Text>
                ) : (
                    <TouchableOpacity onPress={() => {/* Implement Resend if needed */}}>
                        <Text className="text-green-700 font-bold">Resend New Code</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
