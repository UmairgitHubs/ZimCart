import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { PROVIDER_GOOGLE, type Provider } from 'react-native-maps';

/** Use Google Maps on Android only when an API key is configured (avoids Expo Go crashes). */
export function getMapProvider(): Provider | undefined {
  const apiKey =
    Constants.expoConfig?.extra?.googleMapsApiKey ??
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (Platform.OS === 'android' && apiKey) {
    return PROVIDER_GOOGLE;
  }
  return undefined;
}
