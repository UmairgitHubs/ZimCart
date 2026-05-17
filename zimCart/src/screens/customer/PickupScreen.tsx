import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useMarts } from '@/hooks/useMarketplace';
import { normalizeMart } from '@/utils/normalizers';
import MartImage from '@/components/customer/MartImage';
import PickupMartsMap, { type PickupMartMarker } from '@/components/customer/PickupMartsMap';

export default function PickupScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'Map' | 'List'>('List');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const { data: rawMarts = [], isLoading } = useMarts();

  const pickupMarts = useMemo(
    () =>
      (rawMarts as unknown[])
        .map((m) => normalizeMart(m))
        .filter(Boolean) as Array<{
        id: string;
        name: string;
        image?: string;
        rating?: number;
        deliveryTime?: string;
        tags?: string[];
      }>,
    [rawMarts]
  );

  const mapMarts: PickupMartMarker[] = useMemo(
    () =>
      pickupMarts.map((mart) => ({
        id: mart.id,
        name: mart.name,
        tags: mart.tags,
      })),
    [pickupMarts]
  );

  const loadUserLocation = async () => {
    setLocationLoading(true);
    setMapError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMapError('Location permission is required to show stores near you on the map.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setMapError('Could not read your location. Showing stores around the default area.');
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'Map') {
      loadUserLocation();
    }
  }, [selectedTab]);

  const openStore = (mart: PickupMartMarker | (typeof pickupMarts)[0]) => {
    navigation.navigate('StoreDetail', { mart });
  };

  const renderPickupCard = (item: (typeof pickupMarts)[0]) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => openStore(item)}
      className="bg-white rounded-[28px] mb-4 shadow-sm border border-gray-100 overflow-hidden"
      activeOpacity={0.9}
    >
      <View className="flex-row p-4">
        <MartImage mart={item} className="w-24 h-24 rounded-2xl" />
        <View className="flex-1 ml-4 justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <Text className="text-lg font-black text-gray-900 flex-1 mr-2" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="bg-green-100 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-bold text-green-700">OPEN</Text>
              </View>
            </View>
            <View className="flex-row items-center mt-1">
              <MaterialCommunityIcons name="map-marker" size={12} color="#6B7280" />
              <Text className="text-gray-500 text-xs font-medium ml-1">Nearby pickup</Text>
              <Text className="text-gray-300 mx-2">|</Text>
              <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
              <Text className="text-gray-500 text-xs font-medium ml-1">
                {item.deliveryTime || '15-20 min'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row flex-wrap">
              {(item.tags ?? []).slice(0, 2).map((tag: string, i: number) => (
                <View key={`${item.id}-tag-${i}`} className="bg-gray-50 px-2 py-1 rounded-lg mr-2 mb-1">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase">{tag}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity className="bg-green-700 w-8 h-8 rounded-full items-center justify-center">
              <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleMapTabPress = () => {
    setMapError(null);
    setSelectedTab('Map');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      <View className="bg-green-700 pb-8 rounded-b-[40px] shadow-xl" style={{ paddingTop: insets.top }}>
        <View className="px-5 flex-row items-center justify-between mt-2 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Nearby</Text>
            <Text className="text-white font-black text-xl tracking-tighter">Pickup Stores</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-5">
          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={() => setSelectedTab('List')}
              style={[styles.tabButton, selectedTab === 'List' && styles.tabButtonActive]}
            >
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={18}
                color={selectedTab === 'List' ? '#2e7d32' : 'white'}
              />
              <Text style={[styles.tabLabel, selectedTab === 'List' && styles.tabLabelActive]}>
                List View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleMapTabPress}
              style={[styles.tabButton, selectedTab === 'Map' && styles.tabButtonActive]}
            >
              <MaterialCommunityIcons
                name="map-outline"
                size={18}
                color={selectedTab === 'Map' ? '#2e7d32' : 'white'}
              />
              <Text style={[styles.tabLabel, selectedTab === 'Map' && styles.tabLabelActive]}>
                Map View
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {selectedTab === 'List' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          className="px-4"
        >
          <View className="bg-green-700 rounded-[32px] p-6 mb-8 mt-2 flex-row items-center overflow-hidden">
            <View className="flex-1 z-10">
              <Text className="text-white font-black text-2xl leading-7">Skip the wait.</Text>
              <Text className="text-green-50/80 font-bold mt-1">
                Order ahead and pickup from stores near you.
              </Text>
            </View>
            <View className="opacity-20 absolute -right-4">
              <MaterialCommunityIcons name="shopping" size={120} color="white" />
            </View>
          </View>

          <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
            Stores with Pickup
          </Text>

          {isLoading ? (
            <ActivityIndicator color="#2e7d32" className="py-10" />
          ) : pickupMarts.length === 0 ? (
            <Text className="text-gray-400 font-bold text-center py-10">No pickup locations available</Text>
          ) : (
            pickupMarts.map((item) => renderPickupCard(item))
          )}
        </ScrollView>
      ) : (
        <View style={styles.mapPanel}>
          {mapError ? (
            <View style={styles.mapErrorBanner}>
              <MaterialCommunityIcons name="alert-circle-outline" size={22} color="#b45309" />
              <Text style={styles.mapErrorText}>{mapError}</Text>
            </View>
          ) : null}

          {locationLoading || isLoading ? (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color="#2e7d32" />
              <Text style={styles.mapLoadingText}>Loading map…</Text>
            </View>
          ) : (
            <PickupMartsMap
              marts={mapMarts}
              userLocation={userLocation}
              onSelectMart={(mart) => {
                const full = pickupMarts.find((m) => m.id === mart.id);
                if (full) {
                  openStore(full);
                } else {
                  Alert.alert('Store', mart.name);
                }
              }}
            />
          )}

          <TouchableOpacity onPress={loadUserLocation} style={styles.refreshLocationBtn}>
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#2e7d32" />
            <Text style={styles.refreshLocationText}>Refresh my location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 16,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  tabLabel: {
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },
  tabLabelActive: {
    color: '#111827',
  },
  mapPanel: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  mapErrorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  mapErrorText: {
    flex: 1,
    marginLeft: 12,
    color: '#78350f',
    fontSize: 14,
  },
  mapLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLoadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontWeight: '700',
  },
  refreshLocationBtn: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshLocationText: {
    marginLeft: 8,
    color: '#15803d',
    fontWeight: '700',
  },
});
