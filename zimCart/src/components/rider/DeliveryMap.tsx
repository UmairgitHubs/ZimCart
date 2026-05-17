import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HARARE_REGION } from '@/utils/maps';
import { getMapProvider } from '@/utils/mapProvider';

type Props = {
  destination: { lat: number; lng: number } | null;
  height?: number;
};

export function DeliveryMap({ destination, height = 200 }: Props) {
  const region = destination
    ? {
        latitude: destination.lat,
        longitude: destination.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    : HARARE_REGION;

  return (
    <View style={[styles.wrap, { height }]} className="rounded-2xl overflow-hidden border border-slate-100">
      <MapView
        style={StyleSheet.absoluteFill}
        provider={getMapProvider()}
        initialRegion={region}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {destination ? (
          <Marker
            coordinate={{ latitude: destination.lat, longitude: destination.lng }}
            title="Drop-off"
            pinColor="#0d9488"
          />
        ) : null}
      </MapView>
      {!destination && (
        <View style={styles.hint} pointerEvents="none">
          <Text className="text-xs font-semibold text-slate-600 text-center px-4">
            Exact pin unavailable — use navigation for the address
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', backgroundColor: '#e2e8f0' },
  hint: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
