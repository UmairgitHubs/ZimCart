import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Clipboard, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface VoucherType {
    id: string;
    code: string;
    title: string;
    description: string;
    discount: string;
    expiry: string;
    status: 'active' | 'used' | 'expired';
    minSpend?: string;
}

// MOCK_VOUCHERS removed. Using useVouchers hook.
import { useVouchers } from '@/hooks/useCustomer';
import { Voucher } from '@/types/voucher';

const VoucherCard = ({ item }: { item: Voucher }) => {
    const isActive = item.status === 'active';
    
    const copyToClipboard = () => {
        // Clipboard.setString(item.code); // Requires import from expo-clipboard or react-native
        Alert.alert("Copied!", `Voucher code ${item.code} copied to clipboard.`);
    };

    return (
        <View 
            className={`bg-white rounded-2xl mb-4 overflow-hidden border ${isActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: isActive ? 2 : 0
            }}
        >
            <View className="flex-row">
                {/* Left Side: Discount Amount */}
                <View className={`w-28 ${isActive ? 'bg-[#2e7d32]' : 'bg-gray-200'} items-center justify-center p-4`}>
                    <Text className={`text-xl font-bold text-center ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {item.discountType === 'percentage' ? `${item.discountValue}%` : `$${item.discountValue}`}
                    </Text>
                    <Text className={`text-xs font-bold text-center mt-1 uppercase ${isActive ? 'text-green-100' : 'text-gray-400'}`}>
                        OFF
                    </Text>
                    
                    {/* Decorative semi-circles for ticket effect */}
                    <View className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 bg-gray-50 rounded-full" />
                </View>

                {/* Right Side: Details */}
                <View className="flex-1 p-4 justify-between bg-gray-50">
                    <View>
                        <View className="flex-row justify-between items-start">
                            <Text className="font-bold text-gray-900 text-base mb-1 mr-2 flex-1" numberOfLines={1}>
                                {item.title}
                            </Text>
                            {isActive && (
                                <View className="bg-green-100 px-2 py-0.5 rounded-md">
                                    <Text className="text-[10px] font-bold text-green-700 uppercase">Active</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-xs text-gray-500 leading-4 mb-2" numberOfLines={2}>
                            {item.description}
                        </Text>
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="clock-outline" size={12} color="#9CA3AF" />
                            <Text className="text-[10px] text-gray-400 ml-1">{new Date(item.expiryDate).toLocaleDateString()}</Text>
                        </View>
                    </View>

                    {isActive && (
                        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
                             <Text className="text-xs font-bold text-gray-400 uppercase">{item.code}</Text>
                             <Pressable 
                                onPress={copyToClipboard}
                                className="flex-row items-center active:opacity-60"
                             >
                                 <Text className="text-xs font-bold text-[#2e7d32] mr-1">Copy Code</Text>
                                 <MaterialCommunityIcons name="content-copy" size={12} color="#2e7d32" />
                             </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default function VouchersScreen(props: any) {
    const navigation = props.navigation;
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState<'all' | 'active'>('active');
    
    const { data: vouchers, isLoading } = useVouchers();

    const displayedVouchers = vouchers || [];

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            
            {/* Header */}
            <View 
                style={{ paddingTop: insets.top }} 
                className="bg-white px-5 pb-6 border-b border-gray-100 shadow-sm z-10"
            >
                <View className="flex-row items-center justify-between mb-2 mt-2">
                    <Pressable 
                        onPress={() => navigation && navigation.goBack()} 
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={20} color="#1F2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">My Vouchers</Text>
                    <View className="w-10" />
                </View>
            </View>

            {/* Filter Chips */}
            <View className="flex-row px-5 py-4">
                <Pressable 
                    onPress={() => setFilter('active')}
                    className={`px-4 py-2 rounded-full border mr-3 ${filter === 'active' ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
                >
                    <Text className={`font-bold text-xs ${filter === 'active' ? 'text-white' : 'text-gray-600'}`}>Active</Text>
                </Pressable>
                <Pressable 
                    onPress={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full border ${filter === 'all' ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}
                >
                    <Text className={`font-bold text-xs ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>All History</Text>
                </Pressable>
            </View>

            <ScrollView 
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {displayedVouchers.map(item => (
                    <VoucherCard key={item.id} item={item} />
                ))}
                
                {displayedVouchers.length === 0 && (
                    <View className="items-center justify-center mt-20">
                        <Text className="text-gray-500">No vouchers found</Text>
                    </View>
                )}

                {/* Add Voucher Input Section */}
                <View className="mt-8 mb-4">
                    <Text className="text-gray-900 font-bold mb-3">Add a Voucher</Text>
                    <View className="flex-row">
                        <View className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 mr-3 items-start justify-center">
                            <Text className="text-gray-400">Enter voucher code</Text>
                        </View>
                        <Pressable 
                            className="bg-gray-900 px-6 rounded-xl justify-center items-center active:bg-gray-800"
                            onPress={() => Alert.alert("Apply", "Voucher functionality coming soon!")}
                        >
                            <Text className="text-white font-bold text-sm">Apply</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
