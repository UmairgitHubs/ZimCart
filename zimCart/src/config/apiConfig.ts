import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '5000';
const API_PATH = '/api/v1';

/**
 * Resolves the backend URL for development and production.
 * - Set EXPO_PUBLIC_API_URL in .env to override (e.g. http://192.168.1.5:5000/api/v1)
 * - Android emulator → 10.0.2.2 (host machine)
 * - iOS simulator → localhost
 * - Physical device → same LAN IP as Metro bundler (from Expo hostUri)
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (!__DEV__) {
    return 'http://localhost:5000/api/v1';
  }

  if (Platform.OS === 'android' && !Device.isDevice) {
    return `http://10.0.2.2:${API_PORT}${API_PATH}`;
  }

  if (Platform.OS === 'ios' && !Device.isDevice) {
    return `http://localhost:${API_PORT}${API_PATH}`;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } }).manifest2?.extra
      ?.expoClient?.hostUri;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:${API_PORT}${API_PATH}`;
    }
  }

  return `http://localhost:${API_PORT}${API_PATH}`;
}

export const API_BASE_URL = getApiBaseUrl();

if (__DEV__) {
  console.log('[ZimCart] API base URL:', API_BASE_URL);
}
