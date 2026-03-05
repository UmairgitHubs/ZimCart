import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Components
import HomeHeader from '@/components/customer/home/HomeHeader';
import QuickLinkItem from '@/components/customer/home/QuickLinkItem';
import CategoryCircle from '@/components/customer/home/CategoryCircle';
import PromoCard from '@/components/customer/home/PromoCard';
import ModernMartCard from '@/components/customer/cards/ModernMartCard';
import BestBuyCard from '@/components/customer/cards/BestBuyCard';
import BrandCard from '@/components/customer/cards/BrandCard';
import AisleCard from '@/components/customer/cards/AisleCard';
import FreshArrivalCard from '@/components/customer/cards/FreshArrivalCard';
import ShopCategoryCard from '@/components/customer/cards/ShopCategoryCard';
import LargeMartCard from '@/components/customer/cards/LargeMartCard';

// Data
import { 
    QUICK_LINKS, 
    CATEGORY_CIRCLES, 
    PROMO_CARDS, 
    STORES, 
    DAILY_DEALS, 
    TOP_BRANDS, 
    AISLES, 
    FRESH_ARRIVALS,
    SHOP_CATEGORIES,
    EXPLORE_MARTS
} from '@/data/mock/home';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" backgroundColor="#2e7d32" />
      <View style={{ height: insets.top, backgroundColor: '#2e7d32' }} /> 

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
         <HomeHeader />
         
         <View className="bg-white -mt-4 rounded-t-[20px] pt-6 pb-4 px-4 shadow-sm">
             {/* Quick Links */}
             <View className="flex-row justify-between mb-8">
                 {QUICK_LINKS.map(item => (
                    <QuickLinkItem 
                        key={item.id} 
                        item={item} 
                        onPress={() => {
                            if (item.name === 'Offers') navigation.navigate('Offers');
                            if (item.name === 'Marts') navigation.navigate('Marts');
                            if (item.name === 'New In') navigation.navigate('NewIn');
                            if (item.name === 'Pickup') navigation.navigate('Pickup');
                        }}
                    />
                 ))}
             </View>
             
             {/* Category Circles */}
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-4 px-4">
                 {CATEGORY_CIRCLES.map(item => (
                    <CategoryCircle 
                        key={item.id} 
                        item={item} 
                        onPress={() => {
                            if (item.name === 'Grocery') navigation.navigate('GroceryTab');
                            if (item.name === 'Tech') navigation.navigate('Tech');
                            if (item.name === 'Fashion') navigation.navigate('Fashion');
                            if (item.name === 'Beauty') navigation.navigate('Beauty');
                            if (item.name === 'Home' || item.name === 'Home Decor') navigation.navigate('HomeDecor');
                            if (item.name === 'Pet Care') navigation.navigate('PetCare');
                        }}
                    />
                 ))}
             </ScrollView>
             
             {/* Promo Cards */}
             <View className="mb-8">
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
                     {PROMO_CARDS.map(item => (
                        <PromoCard 
                            key={item.id} 
                            item={item} 
                            onPress={() => {
                                if (item.title.toLowerCase().includes('tech')) {
                                    navigation.navigate('TechSale');
                                } else if (item.title.toLowerCase().includes('grocery')) {
                                    navigation.navigate('GroceryBundle');
                                } else if (item.title.toLowerCase().includes('fashion')) {
                                    navigation.navigate('FashionWeek');
                                } else {
                                    navigation.navigate('Offers');
                                }
                            }}
                        />
                     ))}
                 </ScrollView>
             </View>
             
             {/* Popular Marts Slider */}
             <View className="mb-6">
                 <View className="flex-row justify-between items-end mb-4 px-1">
                     <Text className="text-xl font-black text-gray-900">Popular Marts</Text>
                     <TouchableOpacity><Text className="text-primary font-bold text-xs">View all</Text></TouchableOpacity>
                 </View>
                 
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
                     {STORES.map(mart => (
                         <ModernMartCard 
                            key={mart.id} 
                            mart={mart} 
                            onPress={() => navigation.navigate('StoreDetail', { mart })}
                          />
                     ))}
                 </ScrollView>
             </View>

             {/* Weekly Best Buys */}
             <View className="mb-8">
                 <View className="flex-row justify-between items-end mb-4 px-1">
                     <Text className="text-xl font-black text-gray-900">Weekly Best Buys</Text>
                     <TouchableOpacity><Text className="text-primary font-bold text-xs">View all</Text></TouchableOpacity>
                 </View>
                 
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
                     {DAILY_DEALS.map(item => (
                        <BestBuyCard key={item.id} item={item} />
                     ))}
                 </ScrollView>
             </View>

             {/* Top Brands */}
             <View className="mb-8">
                 <Text className="text-xl font-black text-gray-900 mb-4 px-1">Top Brands</Text>
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
                     {TOP_BRANDS.map(brand => (
                        <BrandCard 
                            key={brand.id} 
                            item={brand} 
                            onPress={() => navigation.navigate('CategoryDetail', { brand: brand.name })}
                        />
                     ))}
                 </ScrollView>
             </View>

             {/* Shop by Aisle */}
             <View className="mb-8">
                 <View className="flex-row justify-between items-end mb-4 px-1">
                     <Text className="text-xl font-black text-gray-900">Shop by Aisle</Text>
                     <TouchableOpacity><Text className="text-primary font-bold text-xs">View all</Text></TouchableOpacity>
                 </View>
                 <View className="flex-row flex-wrap justify-between">
                     {AISLES.map(aisle => (
                        <AisleCard 
                           key={aisle.id} 
                           item={aisle} 
                           onPress={() => {
                               if (aisle.name === 'Pet Care') navigation.navigate('PetCare');
                               else if (aisle.name === 'Tech') navigation.navigate('Tech');
                               else if (aisle.name === 'Fashion') navigation.navigate('Fashion');
                               else if (aisle.name === 'Beauty') navigation.navigate('Beauty');
                               else if (aisle.name === 'Home' || aisle.name === 'Home Decor') navigation.navigate('HomeDecor');
                               else navigation.navigate('CategoryDetail', { category: aisle });
                           }}
                        />
                     ))}
                 </View>
             </View>

             {/* Fresh Arrivals */}
             <View className="mb-8">
                 <Text className="text-xl font-black text-gray-900 mb-4 px-1">Fresh Arrivals</Text>
                 {FRESH_ARRIVALS.map(item => (
                    <FreshArrivalCard 
                        key={item.id} 
                        item={item} 
                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    />
                 ))}
             </View>

             {/* Shops by Category */}
             <View className="mb-8">
                 <Text className="text-xl font-black text-gray-900 mb-4 px-1">Browse Categories</Text>
                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
                     {SHOP_CATEGORIES.map(cat => (
                        <ShopCategoryCard 
                            key={cat.id} 
                            item={cat} 
                            onPress={() => {
                                if (cat.name === 'Pet Care') navigation.navigate('PetCare');
                                else if (cat.name === 'Tech') navigation.navigate('Tech');
                                else if (cat.name === 'Fashion') navigation.navigate('Fashion');
                                else if (cat.name === 'Beauty') navigation.navigate('Beauty');
                                else if (cat.name === 'Home' || cat.name === 'Home Decor') navigation.navigate('HomeDecor');
                                else navigation.navigate('CategoryDetail', { category: cat });
                            }}
                        />
                     ))}
                 </ScrollView>
             </View>

             {/* Explore Marts Nearby (Vertical Feed) */}
             <View className="mb-4">
                 <Text className="text-xl font-black text-gray-900 mb-4 px-1">Explore Marts Nearby</Text>
                 <View className="px-0">
                     {EXPLORE_MARTS.map(mart => (
                        <LargeMartCard 
                           key={mart.id} 
                           item={mart} 
                           onPress={() => navigation.navigate('StoreDetail', { store: mart })}
                        />
                     ))}
                 </View>
             </View>

          </View>
       </ScrollView>
    </View>
  );
}
