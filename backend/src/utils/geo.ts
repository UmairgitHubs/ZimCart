/** Haversine distance in km between two WGS84 points */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Try to extract coordinates from order address JSON snapshot */
export function parseCoordsFromAddress(addressRaw: string): { lat: number; lng: number } | null {
  try {
    const parsed = JSON.parse(addressRaw);
    if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
      return { lat: parsed.latitude, lng: parsed.longitude };
    }
    if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
      return { lat: parsed.lat, lng: parsed.lng };
    }
    if (parsed.coordinates?.latitude != null && parsed.coordinates?.longitude != null) {
      return { lat: parsed.coordinates.latitude, lng: parsed.coordinates.longitude };
    }
  } catch {
    // plain text — no coords
  }
  return null;
}

/** Harare CBD fallback when geocoding unavailable */
export const HARARE_CENTER = { lat: -17.8292, lng: 31.0522 };
