import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export type CustomerLocationDisplay = {
  line1: string;
  line2: string;
};

const DEFAULT_LABEL: CustomerLocationDisplay = {
  line1: 'Finding your location…',
  line2: '',
};

export function useCustomerLocation() {
  const [location, setLocation] = useState<CustomerLocationDisplay>(DEFAULT_LABEL);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setPermissionDenied(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLocation({
          line1: 'Location permission needed',
          line2: 'Tap to enable in settings',
        });
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const places = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const place = places[0];
      if (!place) {
        setLocation({
          line1: 'Current location',
          line2: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
        });
        return;
      }

      const street = [place.streetNumber, place.street].filter(Boolean).join(' ');
      const line1 =
        street ||
        place.name ||
        place.district ||
        place.subregion ||
        'Current location';
      const line2 = [place.city, place.region, place.country]
        .filter(Boolean)
        .join(', ');

      setLocation({ line1, line2 });
    } catch {
      setLocation({
        line1: 'Could not load location',
        line2: 'Tap to try again',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    location,
    isLoading,
    permissionDenied,
    refresh,
  };
}
