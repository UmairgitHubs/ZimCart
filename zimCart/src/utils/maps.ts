import { Linking, Platform } from 'react-native';

export const HARARE_REGION = {
  latitude: -17.8292,
  longitude: 31.0522,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export function openMapsSearch(query: string) {
  const q = encodeURIComponent(query);
  return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
}

/** Opens turn-by-turn navigation to a coordinate (Google Maps / Apple Maps). */
export async function openTurnByTurnDirections(
  latitude: number,
  longitude: number,
  label?: string
) {
  const dest = `${latitude},${longitude}`;
  void label;

  const urls = Platform.select({
    ios: [
      `http://maps.apple.com/?daddr=${dest}&dirflg=d`,
      `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`,
    ],
    android: [
      `google.navigation:q=${dest}`,
      `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`,
    ],
    default: [`https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`],
  })!;

  for (const url of urls) {
    const supported = await Linking.canOpenURL(url).catch(() => false);
    if (supported) {
      await Linking.openURL(url);
      return;
    }
  }
  await Linking.openURL(urls[urls.length - 1]);
}
