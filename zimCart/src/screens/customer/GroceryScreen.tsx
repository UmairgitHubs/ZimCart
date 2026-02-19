import React, { useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, FlatList, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Mart } from '@/types/customer';

const { width } = Dimensions.get('window');

// --- Mock Data ---

const CATEGORIES = [
  { id: '1', name: 'Groceries', image: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png', color: '#DCFCE7' }, // Green-ish
  { id: '2', name: 'Fresh Bazaar', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png', color: '#F3E8FF' }, // Purple-ish
  { id: '3', name: 'Health', image: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png', color: '#FEF2F2' }, // Red-ish
  { id: '4', name: 'Electronics', image: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png', color: '#EFF6FF' }, // Blue-ish
  { id: '5', name: 'Pet Care', image: 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png', color: '#FFF7ED' }, // Orange-ish
];

const DEALS = [
    { id: '1', name: 'Metro Cash & Carry', discount: 'Flat 20% Off', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400&auto=format&fit=crop', rating: 4.8 },
    { id: '2', name: 'Carrefour', discount: 'Up to 50% Off', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=400&auto=format&fit=crop', rating: 4.7 },
    { id: '3', name: 'Imtiaz Super Market', discount: 'Free Delivery', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=400&auto=format&fit=crop', rating: 4.6 },
];

const POPULAR_SHOPS: Mart[] = [
    {
      id: "1",
      name: "Mega Mart",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400&auto=format&fit=crop",
      rating: 4.8,
      deliveryTime: "15-20 min",
      deliveryFee: "Free",
      minOrder: "$20",
      tags: ["Groceries"],
    },
    {
      id: "2",
      name: "Tech Zone",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=400&auto=format&fit=crop",
      deliveryTime: "30-45 min",
      rating: 4.5,
      deliveryFee: "$1.99",
      minOrder: "$50",
      tags: ["Electronics"],
    },
    {
        id: "3",
        name: "PharmaPlus",
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=400&auto=format&fit=crop",
        deliveryTime: "20-30 min",
        rating: 4.9,
        deliveryFee: "$0.99",
        minOrder: "$10",
        tags: ["Meds"],
    },
];

const ALL_SHOPS: Mart[] = [
    ...POPULAR_SHOPS,
    {
      id: "4",
      name: "Fresh Greens",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=400&auto=format&fit=crop",
      rating: 4.7,
      deliveryTime: "25-40 min",
      deliveryFee: "Free",
      minOrder: "$15",
      tags: ["Veg"],
    },
    {
        id: "5",
        name: "Alpha Stationery",
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=400&auto=format&fit=crop",
        rating: 4.6,
        deliveryTime: "10-20 min",
        deliveryFee: "$1.00",
        minOrder: "$5",
        tags: ["Stationery"],
    }
];

// --- Components ---

const CategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="items-center mr-4 w-[85px]">
        <View 
            className="w-[85px] h-[85px] rounded-2xl items-center justify-center mb-2"
            style={{ backgroundColor: item.color }}
        >
            <Image source={{ uri: item.image }} className="w-12 h-12" resizeMode="contain" />
        </View>
        <Text className="text-xs font-bold text-gray-800 text-center leading-4">{item.name}</Text>
    </TouchableOpacity>
);

const DealCard = ({ item }: { item: any }) => (
    <TouchableOpacity className="mr-4 w-40 relative">
        <View className="w-40 h-48 rounded-2xl bg-gray-100 mb-2 overflow-hidden shadow-sm border border-gray-100 relative">
             <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
             {/* Gradient Overlay */}
             <View className="absolute inset-0 bg-black/40" />
             
             {/* Discount Text */}
             <View className="absolute bottom-3 left-3 right-3">
                 <Text className="text-white font-black text-2xl leading-6 mb-1">{item.discount}</Text>
                 <Text className="text-white/90 text-xs font-bold" numberOfLines={1}>{item.name}</Text>
             </View>

             {/* Rating Badge */}
             <View className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-md flex-row items-center">
                 <MaterialCommunityIcons name="star" size={10} color="#FBBF24" />
                 <Text className="text-[10px] font-bold text-white ml-0.5">{item.rating}</Text>
             </View>
        </View>
    </TouchableOpacity>
);

const PopularShopCard = ({ item }: { item: Mart }) => (
    <TouchableOpacity className="mr-4 w-36">
        <View className="w-36 h-36 rounded-2xl bg-gray-100 mb-2 overflow-hidden relative shadow-sm border border-gray-100">
             <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
             <View className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded-md">
                 <Text className="text-[10px] font-bold text-black">{item.deliveryTime}</Text>
             </View>
        </View>
        <Text className="font-bold text-gray-900 text-sm mb-0.5" numberOfLines={1}>{item.name}</Text>
        <Text className="text-xs text-gray-500 font-medium">{item.tags?.[0] || 'Store'}</Text>
    </TouchableOpacity>
);

const DailyEssentialCard = ({ item }: { item: Mart }) => (
    <TouchableOpacity className="flex-row items-center bg-white mb-4 rounded-xl">
        {/* Logo / Image */}
        <View className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden relative border border-gray-100 mr-4">
             <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
             <View className="absolute top-0 left-0 bg-primary px-1.5 py-0.5 rounded-br-lg">
                  <Text className="text-[9px] font-bold text-white">PRO</Text>
             </View>
        </View>
        
        {/* Details */}
        <View className="flex-1 justify-center h-24 border-b border-gray-50">
            <View className="flex-row justify-between items-start pr-2">
                <Text className="text-base font-bold text-gray-900 mb-1 flex-1 mr-2" numberOfLines={1}>{item.name}</Text>
                <TouchableOpacity>
                     <MaterialCommunityIcons name="heart-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center mb-1">
                 <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                 <Text className="text-xs font-bold text-gray-800 ml-1">{item.rating}</Text>
                 <Text className="text-gray-300 mx-1">•</Text>
                 <Text className="text-xs text-gray-500">{item.tags?.join(', ')}</Text>
            </View>

            <View className="flex-row items-center mt-2">
                <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600 ml-1 mr-3">{item.deliveryTime}</Text>
                
                <MaterialCommunityIcons name="moped" size={14} color="#2e7d32" />
                <Text className="text-xs text-primary font-bold ml-1">{item.deliveryFee === 'Free' ? 'Free Delivery' : item.deliveryFee}</Text>
            </View>
             {/* Promo text example */}
            <Text className="text-[10px] text-red-500 font-bold mt-1.5">Rs. 169 Free for first order</Text>
        </View>
    </TouchableOpacity>
);

export default function GroceryScreen() {
  const insets = useSafeAreaInsets();

  const renderHeader = () => (
      <View className="bg-[#2e7d32] pb-6 rounded-b-[24px] shadow-lg z-10" style={{ paddingTop: insets.top }}>
            <StatusBar style="light" />
            
            {/* Address Row */}
            <View className="px-4 py-3 flex-row items-center">
                 <View className="bg-white/20 p-2 rounded-full mr-3">
                     <MaterialCommunityIcons name="map-marker" size={20} color="white" />
                 </View>
                 <View className="flex-1">
                     <Text className="text-white/80 text-xs font-medium">Deliver to</Text>
                     <View className="flex-row items-center">
                         <Text className="text-white font-bold text-base mr-1">107 Street 65, NYC</Text>
                         <MaterialCommunityIcons name="chevron-down" size={18} color="white" />
                     </View>
                 </View>
                 <TouchableOpacity className="bg-white/20 p-2 rounded-full relative">
                      <MaterialCommunityIcons name="cart-outline" size={22} color="white" />
                      <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#2e7d32]" />
                 </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="mx-4 mt-2 flex-row items-center bg-white rounded-xl px-3 py-3 shadow-sm">
                <MaterialCommunityIcons name="magnify" size={22} color="#4B5563" />
                <TextInput 
                    placeholder="Search for shops and products"
                    className="flex-1 ml-3 text-base font-medium text-gray-800"
                    placeholderTextColor="#9CA3AF"
                />
                <View className="h-5 w-[1px] bg-gray-200 mx-3" />
                <TouchableOpacity>
                     <MaterialCommunityIcons name="tune-vertical" size={20} color="#2e7d32" />
                </TouchableOpacity>
            </View>
      </View>
  );

  return (
    <View className="flex-1 bg-white">
      {renderHeader()}
      
      <FlatList 
        data={ALL_SHOPS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
             <View className="px-5">
                 <DailyEssentialCard item={item} />
             </View>
        )}
        ListHeaderComponent={
            <View className="pt-6 pb-2">
                 {/* Categories */}
                 <View className="mb-8">
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                         {CATEGORIES.map((cat) => (
                             <CategoryItem key={cat.id} item={cat} />
                         ))}
                     </ScrollView>
                 </View>

                 {/* Popular Shops */}
                 <View className="mb-8">
                     <Text className="text-lg font-extrabold text-gray-900 px-5 mb-4">Popular Shops</Text>
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                         {POPULAR_SHOPS.map((shop) => (
                             <PopularShopCard key={shop.id} item={shop} />
                         ))}
                     </ScrollView>
                 </View>

                 {/* Deals & Discounts */}
                 <View className="mb-8">
                     <View className="flex-row justify-between items-end px-5 mb-4">
                         <Text className="text-lg font-extrabold text-gray-900">Deals & Discounts</Text>
                         <TouchableOpacity><Text className="text-primary font-bold text-xs">See all</Text></TouchableOpacity>
                     </View>
                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                         {DEALS.map((deal) => (
                             <DealCard key={deal.id} item={deal} />
                         ))}
                     </ScrollView>
                 </View>

                 {/* All Stores Title */}
                 <Text className="text-lg font-extrabold text-gray-900 px-5 mb-4">All Stores</Text>
            </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
