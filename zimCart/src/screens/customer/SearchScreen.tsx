import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProducts } from '@/hooks/useMarketplace';
import { useDebounce } from '@/hooks/useDebounce';

const RECENT_STORAGE_KEY = '@zimcart/search_recent';
const MAX_RECENT = 8;

const TRENDING = ['Milk', 'Eggs', 'Bread', 'Rice', 'Chicken', 'Oil', 'Soap', 'Tea'];

type SearchScreenProps = {
  navigation: {
    navigate: (name: string, params?: Record<string, unknown>) => void;
  };
};

async function loadRecent(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

async function persistRecent(items: string[]) {
  await AsyncStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(items));
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const debounced = useDebounce(query.trim(), 350);
  const searchActive = debounced.length >= 2;

  const { data, isLoading, isError, error } = useProducts(
    {
      search: debounced,
      page: 1,
      limit: 30,
    },
    { enabled: searchActive }
  );

  const products = data?.products ?? [];

  useEffect(() => {
    void loadRecent().then(setRecent);
  }, []);

  const pushRecent = useCallback(async (term: string) => {
    const t = term.trim();
    if (t.length < 2) return;
    setRecent((prev) => {
      const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
      void persistRecent(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(async () => {
    setRecent([]);
    await AsyncStorage.removeItem(RECENT_STORAGE_KEY);
  }, []);

  const onSubmitSearch = useCallback(() => {
    Keyboard.dismiss();
    void pushRecent(query.trim());
  }, [query, pushRecent]);

  const openProduct = useCallback(
    (product: any) => {
      const term = searchActive ? debounced : String(product.name || '').trim();
      if (term.length >= 2) void pushRecent(term);
      navigation.navigate('ProductDetail', { product });
    },
    [navigation, pushRecent, debounced, searchActive]
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Search products, brands, SKUs…"
            placeholderTextColor="#9CA3AF"
            autoFocus
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={onSubmitSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: 32 }}>
        {searchActive && (
          <View className="px-4 pt-4">
            {isLoading && (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color="#2e7d32" />
                <Text className="text-gray-400 font-bold mt-3 uppercase text-[10px] tracking-widest">Searching catalog…</Text>
              </View>
            )}

            {!isLoading && isError && (
              <View className="py-8 px-2">
                <Text className="text-red-600 text-sm font-semibold">
                  {(error as Error)?.message || 'Could not load results. Check your connection.'}
                </Text>
              </View>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <View className="py-12 items-center px-4">
                <MaterialCommunityIcons name="package-variant-closed" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 font-bold mt-4 text-center">No products match that search.</Text>
              </View>
            )}

            {!isLoading &&
              !isError &&
              products.map((product: any) => {
                const img = product.images?.[0] || 'https://via.placeholder.com/200';
                const mart = product.store?.name || 'Store';
                const showStrike =
                  product.discountPrice > 0 && product.price > 0 && product.price > product.discountPrice;
                return (
                  <TouchableOpacity
                    key={product.id}
                    activeOpacity={0.85}
                    onPress={() => openProduct(product)}
                    className="flex-row items-center py-3 border-b border-gray-50"
                  >
                    <Image source={{ uri: img }} className="w-16 h-16 rounded-2xl bg-gray-100" />
                    <View className="flex-1 ml-3">
                      <Text className="text-[10px] font-bold text-gray-400 uppercase">{mart}</Text>
                      <Text className="text-sm font-black text-gray-900 mt-0.5" numberOfLines={2}>
                        {product.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-green-700 font-black text-sm">
                          Rs. {product.discountPrice || product.price}
                        </Text>
                        {showStrike && (
                          <Text className="text-gray-400 text-xs line-through ml-2">Rs. {product.price}</Text>
                        )}
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#CBD5E1" />
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {!searchActive && (
          <>
            <View className="mt-4 px-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-bold text-gray-900">Recent searches</Text>
                {recent.length > 0 && (
                  <TouchableOpacity onPress={() => void clearRecent()}>
                    <Text className="text-xs text-[#2e7d32] font-bold">Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              {recent.length === 0 ? (
                <Text className="text-gray-400 text-sm py-2">Your recent searches will appear here.</Text>
              ) : (
                recent.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="flex-row items-center py-3 border-b border-gray-50"
                    onPress={() => setQuery(item)}
                  >
                    <MaterialCommunityIcons name="history" size={20} color="#666" />
                    <Text className="ml-3 text-gray-700 text-base flex-1">{item}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View className="mt-6 px-5">
              <Text className="text-sm font-bold text-gray-900 mb-3">Try searching</Text>
              <View className="flex-row flex-wrap gap-2">
                {TRENDING.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    className="bg-gray-50 px-3 py-2 rounded-full border border-gray-100"
                    onPress={() => setQuery(tag)}
                  >
                    <Text className="text-gray-600 font-semibold text-sm">{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text className="text-center text-gray-400 text-xs mt-8 px-8">
              Type at least 2 characters to search the live product catalog.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
