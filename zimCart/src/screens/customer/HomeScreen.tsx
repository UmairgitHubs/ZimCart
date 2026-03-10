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
    DAILY_DEALS, 
    TOP_BRANDS, 
    AISLES, 
    FRESH_ARRIVALS,
    SHOP_CATEGORIES
} from '@/data/mock/home';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMarts, useProducts, useCategories } from '@/hooks/useMarketplace';
import { ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { data: marts = [], isLoading } = useMarts();
  const { data: dealsData, isLoading: isLoadingDeals } = useProducts({ isDeal: true });
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

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
                     <TouchableOpacity onPress={() => navigation.navigate('Marts')}><Text className="text-primary font-bold text-xs">View all</Text></TouchableOpacity>
                 </View>
                 
                 {isLoading ? (
                     <View className="h-40 items-center justify-center">
                         <ActivityIndicator color="#2e7d32" />
                     </View>
                 ) : (
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
                         {marts.slice(0, 5).map((mart: any) => (
                             <ModernMartCard 
                                key={mart.id} 
                                mart={mart} 
                                onPress={() => navigation.navigate('StoreDetail', { mart })}
                              />
                         ))}
                         {marts.length === 0 && (
                             <Text className="text-gray-400 font-bold px-4">No popular marts yet</Text>
                         )}
                     </ScrollView>
                 )}
             </View>

             {/* Weekly Best Buys */}
             <View className="mb-8">
                 <View className="flex-row justify-between items-end mb-4 px-1">
                     <Text className="text-xl font-black text-gray-900">Weekly Best Buys</Text>
                     <TouchableOpacity><Text className="text-primary font-bold text-xs">View all</Text></TouchableOpacity>
                 </View>
                 
                 {isLoadingDeals ? (
                     <View className="h-40 items-center justify-center">
                         <ActivityIndicator color="#2e7d32" />
                     </View>
                 ) : (
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
                         {dealsData?.products?.map((item: any) => (
                            <BestBuyCard 
                                key={item.id} 
                                item={{
                                    id: item.id,
                                    name: item.name,
                                    mart: item.store?.name || 'ZimCart Fresh',
                                    price: `Rs. ${item.discountPrice || item.price}`,
                                    oldPrice: item.discountPrice ? `Rs. ${item.price}` : '',
                                    discount: item.discountPercentage ? `${item.discountPercentage}% OFF` : 'DEAL',
                                    image: item.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
                                    time: item.store?.deliveryTime || '30-45 min'
                                }} 
                                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                            />
                         ))}
                         {(!dealsData?.products || dealsData.products.length === 0) && (
                             <Text className="text-gray-400 font-bold px-4">No deals available this week</Text>
                         )}
                     </ScrollView>
                 )}
             </View>

             {/* Top Brands
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
             </View> */}

             {/* Shop by Aisle */}
             <View className="mb-8">
                 <View className="flex-row justify-between items-end mb-4 px-1">
                     <Text className="text-xl font-black text-gray-900">Shop by Aisle</Text>
                     <TouchableOpacity><Text className="text-primary font-bold text-xs">View all</Text></TouchableOpacity>
                 </View>
                 
                 {isLoadingCategories ? (
                     <View className="py-10 items-center justify-center">
                         <ActivityIndicator color="#2e7d32" />
                     </View>
                 ) : (
                     <View className="flex-row flex-wrap justify-between px-1">
                         {(Array.isArray(categories) ? categories : (categories as any)?.items || []).slice(0, 6).map((category: any, idx: number) => {
                            const pastelColors = ['#ecfccb', '#fee2e2', '#fff7ed', '#fef9c3', '#eff6ff', '#f3e8ff', '#e0e7ff', '#ccfbf1'];
                            const color = pastelColors[idx % pastelColors.length];
                            
                            return (
                               <AisleCard 
                                  key={category.id} 
                                  item={{
                                      id: category.id,
                                      name: category.name,
                                      color: color,
                                      image: category.image || 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png'
                                  }} 
                                  onPress={() => navigation.navigate('CategoryDetail', { category })}
                               />
                            );
                         })}
                         {(!categories || (Array.isArray(categories) ? categories.length === 0 : (categories as any)?.items?.length === 0)) && (
                            <Text className="text-gray-400 font-bold px-2 py-4">No categories found...</Text>
                         )}
                     </View>
                 )}
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
                 {isLoadingCategories ? (
                     <ActivityIndicator color="#2e7d32" />
                 ) : (
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
                         {(Array.isArray(categories) ? categories : (categories as any)?.items || []).map((cat: any) => (
                            <ShopCategoryCard 
                                key={cat.id} 
                                item={{
                                    id: cat.id,
                                    name: cat.name,
                                    items: `${cat.productCount || 0} Products`,
                                    image: cat.image || 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png'
                                }} 
                                onPress={() => navigation.navigate('CategoryDetail', { category: cat })}
                            />
                         ))}
                     </ScrollView>
                 )}
             </View>

             {/* Explore Marts Nearby (Vertical Feed) */}
             <View className="mb-4">
                 <Text className="text-xl font-black text-gray-900 mb-4 px-1">Explore Marts Nearby</Text>
                 <View className="px-0">
                    {isLoading ? (
                        <ActivityIndicator color="#2e7d32" className="my-10" />
                    ) : (
                        <>
                            {marts.slice(0, 3).map((mart: any) => (
                                <LargeMartCard 
                                    key={mart.id} 
                                    item={mart} 
                                    onPress={() => navigation.navigate('StoreDetail', { mart })}
                                />
                            ))}
                            {marts.length === 0 && (
                                <View className="items-center py-10">
                                    <MaterialCommunityIcons name="store-alert-outline" size={48} color="#D1D5DB" />
                                    <Text className="text-gray-400 font-bold mt-2">No marts nearby currently</Text>
                                </View>
                             )}
                        </>
                    )}
                 </View>
             </View>

          </View>
       </ScrollView>
    </View>
  );
}
