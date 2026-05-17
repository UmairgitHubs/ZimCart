import { HARARE_REGION } from '@/utils/maps';

type LatLng = { latitude: number; longitude: number };

/** Stable offset around a center for demo marts without DB coordinates. */
export function coordinateForMart(
  martId: string,
  index: number,
  total: number,
  center: LatLng
): LatLng {
  let hash = 0;
  for (let i = 0; i < martId.length; i += 1) {
    hash = (hash + martId.charCodeAt(i)) % 997;
  }

  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + hash * 0.17;
  const radius = 0.006 + (hash % 7) * 0.0012;

  return {
    latitude: center.latitude + Math.cos(angle) * radius,
    longitude: center.longitude + Math.sin(angle) * radius,
  };
}

export function regionFromCoordinates(points: LatLng[]) {
  if (points.length === 0) {
    return HARARE_REGION;
  }

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = Math.max(0.02, (maxLat - minLat) * 1.6 + 0.01);
  const longitudeDelta = Math.max(0.02, (maxLng - minLng) * 1.6 + 0.01);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}
