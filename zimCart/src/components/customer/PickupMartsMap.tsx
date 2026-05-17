import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getMapProvider } from '@/utils/mapProvider';
import { coordinateForMart, regionFromCoordinates } from '@/utils/martCoordinates';
import { HARARE_REGION } from '@/utils/maps';

export type PickupMartMarker = {
  id: string;
  name: string;
  tags?: string[];
};

type Props = {
  marts: PickupMartMarker[];
  userLocation?: { latitude: number; longitude: number } | null;
  onSelectMart: (mart: PickupMartMarker) => void;
  height?: number;
};

export default function PickupMartsMap({
  marts,
  userLocation,
  onSelectMart,
  height = 420,
}: Props) {
  const center = userLocation ?? {
    latitude: HARARE_REGION.latitude,
    longitude: HARARE_REGION.longitude,
  };

  const markers = useMemo(
    () =>
      marts.map((mart, index) => ({
        mart,
        coordinate: coordinateForMart(mart.id, index, marts.length, center),
      })),
    [marts, center.latitude, center.longitude]
  );

  const region = useMemo(() => {
    const points = markers.map((m) => m.coordinate);
    if (userLocation) {
      points.push(userLocation);
    }
    return regionFromCoordinates(points);
  }, [markers, userLocation]);

  if (marts.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <MaterialCommunityIcons name="store-off-outline" size={40} color="#9CA3AF" />
        <Text style={styles.emptyText}>No pickup stores to show on the map</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { height }]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={getMapProvider()}
        initialRegion={region}
        region={region}
        showsUserLocation={!!userLocation}
        showsMyLocationButton
        toolbarEnabled={false}
      >
        {markers.map(({ mart, coordinate }) => (
          <Marker
            key={mart.id}
            coordinate={coordinate}
            title={mart.name}
            description={(mart.tags ?? []).join(', ') || 'Pickup available'}
            pinColor="#2e7d32"
            onPress={() => onSelectMart(mart)}
          />
        ))}
      </MapView>

      <View style={styles.hint} pointerEvents="box-none">
        <Text style={styles.hintText}>Tap a green pin to open that store</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  empty: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 12,
    color: '#6b7280',
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  hintText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
});
