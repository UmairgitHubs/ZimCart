import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { parseApiError } from '@/utils/errorUtils';

export default function Verify2FAScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { mfaToken, email } = route.params as { mfaToken: string, email: string };
  const { verify2FA, resend2FA, isVerifying2FA, isResending2FA } = useAuth();

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
      Alert.alert("Error", "Please enter the 6-digit code");
      return;
    }

    try {
      await verify2FA({ mfaToken, code: fullCode });
      // On success, useAuth handles dispatching credentials. 
      // Login screen likely handles navigation based on auth state, 
      // but here we can just reset to Main.
      navigation.reset({
          index: 0,
          routes: [{ name: 'Main' as never }],
      });
    } catch (error) {
      Alert.alert("Verification Failed", parseApiError(error));
    }
  };

  const handleResend = async () => {
    try {
      await resend2FA(mfaToken);
      setTimer(60);
      Alert.alert("Success", "A new code has been sent to your email.");
    } catch (error) {
      Alert.alert("Error", parseApiError(error));
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View style={{ paddingTop: insets.top }} className="px-4 pb-4 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-gray-50 rounded-full">
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
                    <MaterialCommunityIcons name="shield-check" size={40} color="#2e7d32" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</Text>
                <Text className="text-center text-gray-500 leading-5">
                    Enter the 6-digit code we sent to{"\n"}
                    <Text className="text-gray-900 font-bold">{email}</Text>
                </Text>
            </View>

            <View className="flex-row justify-between mb-10">
                {code.map((digit, index) => (
                    <View key={index} className="w-[14%] aspect-square bg-gray-50 border border-gray-200 rounded-xl items-center justify-center">
                        <TextInput
                            ref={ref => { inputRefs.current[index] = ref; }}
                            value={digit}
                            onChangeText={text => handleInputChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            className="text-2xl font-bold text-gray-900 text-center w-full"
                            style={{ padding: 0 }}
                            autoFocus={index === 0}
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity 
                onPress={handleVerify}
                disabled={isVerifying2FA}
                className={`bg-primary py-4 rounded-xl shadow-lg shadow-green-500/30 flex-row justify-center items-center mb-6 ${isVerifying2FA ? 'opacity-70' : ''}`}
            >
                {isVerifying2FA && <ActivityIndicator size="small" color="white" className="mr-2" />}
                <Text className="text-white font-bold text-center text-lg">Verify & Continue</Text>
            </TouchableOpacity>

            <View className="items-center">
                <Text className="text-gray-500 mb-2">Didn't receive the code?</Text>
                {timer > 0 ? (
                    <Text className="text-gray-400 font-medium">Resend in {timer}s</Text>
                ) : (
                    <TouchableOpacity onPress={handleResend} disabled={isResending2FA}>
                        {isResending2FA ? (
                            <ActivityIndicator size="small" color="#2e7d32" />
                        ) : (
                            <Text className="text-primary font-bold">Resend New Code</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
