import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMarts, useProducts, useCategories } from '@/hooks/useMarketplace';
import { useCart } from '@/hooks/useCart';
import { mapProductToDealCard } from '@/utils/productMappers';
import { goToCartTab } from '@/utils/navigation';
import MartImage from '@/components/customer/MartImage';
import { useCustomerLocation } from '@/hooks/useCustomerLocation';

const GROCERY_CHIPS = [
  { id: 'veg', name: 'Vegetables', icon: 'leaf' as const, color: '#ecfccb', textColor: '#3f6212' },
  { id: 'fruit', name: 'Fruits', icon: 'food-apple' as const, color: '#ffedd5', textColor: '#9a3412' },
  { id: 'meat', name: 'Meat', icon: 'food-steak' as const, color: '#fee2e2', textColor: '#991b1b' },
  { id: 'dairy', name: 'Dairy', icon: 'bottle-wine' as const, color: '#eff6ff', textColor: '#1e40af' },
  { id: 'bakery', name: 'Bakery', icon: 'bread-slice' as const, color: '#fef9c3', textColor: '#854d0e' },
];

export default function GroceryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { data: marts = [], isLoading: martsLoading } = useMarts();
  const { data: dealsData, isLoading: dealsLoading } = useProducts({ isDeal: true, limit: 12 });
  const { data: categories = [] } = useCategories();
  const { data: cartData } = useCart();

  const categoryList = Array.isArray(categories) ? categories : [];
  const products = dealsData?.products ?? [];
  const deals = products.map(mapProductToDealCard);
  const cartItems = cartData?.items ?? [];
  const cartCount = cartItems.reduce((n: number, i: { quantity: number }) => n + i.quantity, 0);
  const cartTotal = cartItems.reduce(
    (n: number, i: { product: { price: number }; quantity: number }) =>
      n + i.product.price * i.quantity,
    0
  );

  const groceryMarts = useMemo(() => marts.slice(0, 6), [marts]);
  const { location, isLoading: locationLoading, refresh: refreshLocation } = useCustomerLocation();

  const renderHeader = () => (
    <View className="bg-green-700 pb-6 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
      <StatusBar style="light" />
      <View className="px-5 flex-row items-center justify-between mb-6 mt-2">
        <TouchableOpacity
          className="flex-row items-center flex-1 mr-2"
          onPress={refreshLocation}
          activeOpacity={0.85}
        >
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
            <MaterialCommunityIcons name="map-marker" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">
              Deliver to
            </Text>
            {locationLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text className="text-white font-black text-sm" numberOfLines={1}>
                  {location.line1}
                </Text>
                {location.line2 ? (
                  <Text className="text-white/80 text-[11px]" numberOfLines={1}>
                    {location.line2}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          onPress={() => goToCartTab(navigation)}
        >
          <MaterialCommunityIcons name="shopping-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="px-5">
        <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
          <MaterialCommunityIcons name="magnify" size={22} color="#9CA3AF" />
          <TextInput
            placeholder="Search Groceries & Stores..."
            className="flex-1 ml-3 text-base font-medium text-gray-800"
            placeholderTextColor="#9CA3AF"
            onFocus={() => navigation.navigate('Main', { screen: 'SearchTab' })}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mt-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
            {GROCERY_CHIPS.map((cat) => {
              const match = categoryList.find((c: { name: string }) =>
                c.name.toLowerCase().includes(cat.name.toLowerCase().slice(0, 4))
              );
              return (
                <TouchableOpacity
                  key={cat.id}
                  className="items-center mr-6"
                  onPress={() => {
                    if (match) navigation.navigate('CategoryDetail', { category: match });
                  }}
                >
                  <View
                    className="w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  >
                    <MaterialCommunityIcons name={cat.icon} size={28} color={cat.textColor} />
                  </View>
                  <Text className="text-[11px] font-black text-gray-700 uppercase tracking-tighter">
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="mt-10 px-5">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-2xl font-black text-gray-900 tracking-tighter">Grocery Flash Sale</Text>
              <Text className="text-gray-500 text-xs font-bold">Live deals from your marts</Text>
            </View>
          </View>
          {dealsLoading ? (
            <ActivityIndicator color="#2e7d32" className="py-8" />
          ) : deals.length === 0 ? (
            <Text className="text-gray-400 font-bold">No deals yet — check back soon.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
              {deals.map((deal, idx) => (
                <TouchableOpacity
                  key={deal.id}
                  className="bg-white rounded-[32px] border border-gray-100 p-4 mr-4 w-[200px] shadow-sm"
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { product: products[idx] })
                  }
                >
                  <View className="relative mb-3">
                    <Image source={{ uri: deal.image }} className="w-full h-32 rounded-2xl" />
                    <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-lg">
                      <Text className="text-white text-[9px] font-black">{deal.discount}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-400 text-[9px] font-bold uppercase mb-0.5">{deal.mart}</Text>
                  <Text className="text-gray-900 font-bold text-sm mb-2" numberOfLines={1}>
                    {deal.name}
                  </Text>
                  <Text className="text-green-700 font-black text-base">{deal.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="mt-10 px-5">
          <Text className="text-xl font-black text-gray-900 mb-6 tracking-tighter">Most Trusted Marts</Text>
          {martsLoading ? (
            <ActivityIndicator color="#2e7d32" />
          ) : groceryMarts.length === 0 ? (
            <Text className="text-gray-400 font-bold">No marts available. Start the backend and run seed.</Text>
          ) : (
            groceryMarts.map((mart: { id: string; name: string; image?: string; rating?: number; tags?: string[]; deliveryFee?: string; deliveryTime?: string }) => (
              <TouchableOpacity
                key={mart.id}
                onPress={() => navigation.navigate('StoreDetail', { mart })}
                className="bg-white rounded-3xl mb-6 flex-row items-center border border-gray-100 shadow-sm"
                activeOpacity={0.9}
              >
                <MartImage mart={mart} className="w-24 h-24 rounded-2xl m-2" />
                <View className="flex-1 pr-4 ml-2">
                  <Text className="text-lg font-black text-gray-900" numberOfLines={1}>
                    {mart.name}
                  </Text>
                  <Text className="text-gray-500 text-xs font-medium mb-2">
                    {(mart.tags ?? ['Grocery']).join(', ')}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-[10px] font-bold ml-1">
                      {mart.deliveryTime || '25-35 min'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <View
          className="absolute left-0 right-0 items-center z-50 px-5"
          style={{ bottom: Math.max(insets.bottom, 20) }}
        >
          <TouchableOpacity
            className="bg-green-700 h-[70px] rounded-[30px] flex-row items-center px-6 shadow-2xl border border-white/10"
            style={{ width: '100%', maxWidth: 550 }}
            activeOpacity={0.9}
            onPress={() => goToCartTab(navigation)}
          >
            <View className="bg-white rounded-2xl w-12 h-12 items-center justify-center mr-4">
              <Text className="text-green-700 font-black text-lg">{cartCount}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-black text-lg tracking-tight">View your Cart</Text>
              <Text className="text-green-50/60 text-[10px] font-bold uppercase tracking-widest">
                {cartCount} items
              </Text>
            </View>
            <Text className="text-white font-black text-lg">Rs. {cartTotal}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
